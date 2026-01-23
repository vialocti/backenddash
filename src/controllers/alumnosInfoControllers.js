import coneccionDB from "../database.js";

// src/controllers/reinscripcionController.ts


/**
 * Consulta los reinscriptos para un año determinado.
 */
export const getReinscriptos = async (req, res) => {
  const { anio } = req.params; // Se espera que el año se envíe como parámetro de la ruta
  const sql = `
    SELECT DISTINCT
      alu.persona,
      alu.alumno,
      alu.legajo,
      dper.tipo_documento,
      dper.nro_documento,
      mp.apellido,
      mp.nombres,
      mp.fecha_nacimiento,
      mp.sexo,
      alu.ubicacion,
      alu.propuesta,
      alu.plan_version,
      spv.plan,
      alu.calidad
    FROM negocio.sga_reinscripciones AS rei
    INNER JOIN negocio.sga_alumnos AS alu ON alu.alumno = rei.alumno
    INNER JOIN negocio.sga_planes_versiones AS spv ON spv.plan_version = alu.plan_version
    INNER JOIN negocio.mdp_personas AS mp ON mp.persona = alu.persona
    INNER JOIN negocio.mdp_personas_documentos AS dper ON dper.documento = mp.documento_principal
    WHERE propuesta IN (1,2,3,6,7,8)
      AND calidad IN ('A', 'P')
      AND anio_academico = $1
  `;
  try {
    const { rows } = await coneccionDB.query(sql, [anio]);
    console.log(`El número de registros es: ${rows.length}`);
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error al obtener reinscriptos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
};

/**
 * Inserta la información de un alumno en la tabla fce_per.alumnos_info.
 * Se espera que la información se envíe en el body de la petición.
 */
export const insertAlumnoInfo = async (req, res) => {
  const record = req.body; // Se espera un objeto con los datos del alumno

  // Si legajo es nulo o cadena vacía, asignamos 0
  const legajo = record.legajo && record.legajo !== '' ? record.legajo : 0;

  const insertQuery = `
    INSERT INTO fce_per.alumnos_info (
      persona,
      alumno,
      legajo,
      tipo_documento,
      nro_documento,
      apellido,
      nombres,
      fecha_nacimiento,
      genero,
      ubicacion,
      propuesta,
      plan_version,
      plan,
      calidad
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
  `;
  const values = [
    record.persona,
    record.alumno,
    legajo,
    record.tipo_documento,
    record.nro_documento,
    record.apellido, // Con queries parametrizados no es necesario reemplazar las comillas
    record.nombres,
    record.fecha_nacimiento,
    record.sexo,
    record.ubicacion,
    record.propuesta,
    record.plan_version,
    record.plan,
    record.calidad,
  ];

  try {
    await coneccionDB.query(insertQuery, values);
    console.log('Registro insertado:', values);
    res.status(200).json({ message: 'Registro insertado correctamente' });
  } catch (error) {
    console.error('Error al insertar registro:', error);
    res.status(500).json({ message: 'Error al insertar el registro' });
  }
};

/**
 * 
 * endpoit getAlumnos_info 
 */


export const traerDatosAlumnosInfo = async (req, res) => {
  const sql = `SELECT
    legajo,
    nro_documento,
    apellido,
    nombres,
    ubicacion,
    propuesta,
    plan,
    plan_version,
    anio_ingreso_pro,
    promedioca,
    coef_tcarrera,
    perdidasreg,
    ultimaperdireg
    FROM fce_per.alumnos_info` ;
  try {
    const { rows } = await coneccionDB.query(sql);
    // console.log(`El número de registros es: ${rows.length}`);
    res.status(200).json({ data: rows });

  } catch (error) {
    console.error('Error al obtener reinscriptos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
};


/**
 * Endpoint que obtiene los reinscriptos para un año dado y los inserta en la tabla destino.
 */
export const processReinscriptos = async (req, res) => {
  const { anio } = req.params;

  // 1. Consulta de origen (Guarani)
  const selectQuery = `
    SELECT DISTINCT
      alu.persona, alu.alumno, alu.legajo,
      dper.tipo_documento, dper.nro_documento,
      mp.apellido, mp.nombres, mp.fecha_nacimiento,
      mp.sexo as genero, alu.ubicacion, alu.propuesta,
      alu.plan_version, spv.plan, alu.calidad
    FROM negocio.sga_reinscripciones AS rei
    INNER JOIN negocio.sga_alumnos AS alu ON alu.alumno = rei.alumno
    INNER JOIN negocio.sga_planes_versiones AS spv ON spv.plan_version = alu.plan_version
    INNER JOIN negocio.mdp_personas AS mp ON mp.persona = alu.persona
    INNER JOIN negocio.mdp_personas_documentos AS dper ON dper.documento = mp.documento_principal
    WHERE propuesta IN (1,2,3,6,7,8)
      AND calidad IN ('A','P')
      AND anio_academico = $1
  `;

  // 2. Query con ON CONFLICT (Upsert)
  // Esto evita hacer un SELECT por cada registro, mejorando el rendimiento x10
  const upsertQuery = `
    INSERT INTO fce_per.alumnos_info (
      persona, alumno, legajo, tipo_documento, nro_documento,
      apellido, nombres, fecha_nacimiento, genero,
      ubicacion, propuesta, plan_version, plan, calidad
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    ON CONFLICT (alumno, ubicacion, propuesta) 
    DO UPDATE SET 
      plan_version = EXCLUDED.plan_version,
      calidad = EXCLUDED.calidad,
      legajo = EXCLUDED.legajo
    RETURNING (xmax = 0) AS inserted;
  `;

  try {
    await coneccionDB.query('BEGIN');

    const { rows: alumnosGuarani } = await coneccionDB.query(selectQuery, [anio]);

    let insertados = 0;
    let actualizados = 0;

    for (const row of alumnosGuarani) {
      // Normalización de legajo
      const legajo = row.legajo && row.legajo !== '' ? row.legajo : 0;

      const values = [
        row.persona, row.alumno, legajo, row.tipo_documento, row.nro_documento,
        row.apellido, row.nombres, row.fecha_nacimiento, row.genero,
        row.ubicacion, row.propuesta, row.plan_version, row.plan, row.calidad
      ];

      const resUpsert = await coneccionDB.query(upsertQuery, values);

      // xmax = 0 indica que fue un INSERT, de lo contrario fue un UPDATE
      if (resUpsert.rows[0].inserted) {
        insertados++;
      } else {
        actualizados++;
      }
    }

    await coneccionDB.query('COMMIT');

    // Respuesta estructurada para n8n
    res.status(200).json({
      status: "success",
      step: "PASO_1_REINSCRIPTOS",
      anio: anio,
      stats: {
        total_origen: alumnosGuarani.length,
        nuevos_insertados: insertados,
        actualizados: actualizados
      }
    });

  } catch (error) {
    await coneccionDB.query('ROLLBACK');
    console.error('Error en Paso 1:', error);
    res.status(500).json({
      status: "error",
      message: 'Error al procesar reinscriptos.',
      detail: error.message
    });
  }
};



//********
///proceso de llenado de datos
//obtener datos de alumnos y actualiza la tabla fce_per.alumnos_info

async function obtenerDatosAlumno(row, modo = 'I') {
  const promesas = [];
  console.log(`Obteniendo datos para alumno: ${row.alumno} en modo: ${modo}`);
  // Datos comunes a ambos modos
  promesas.push(materiasAprobadas(row.alumno, 0));     // 0
  promesas.push(materiasReprobadas(row.alumno, 0));    // 1
  promesas.push(calcularPromedio(row.alumno, 'C', 0)); // 2
  promesas.push(calcularPromedio(row.alumno, 'S', 0)); // 3
  promesas.push(traerRegulares(row.alumno, row.plan, 0)); // 4

  if (modo === 'I') {
    promesas.push(setearAnioING(row.legajo));                          // 5
    promesas.push(anioIngreso(row.persona, row.propuesta));           // 6
    promesas.push(traerperdidasRegularidad(row.alumno, 'U'));         // 7
    promesas.push(traerperdidasRegularidad(row.alumno, 'T'));         // 8
  }

  const resultados = await Promise.all(promesas);

  // Resultados comunes
  const datos = {
    matAprobadas: resultados[0],
    matReprobadas: resultados[1],
    promedioCA: resultados[2],
    promedioSA: resultados[3],
    regulares: resultados[4],
  };

  if (modo === 'I') {
    const perdidasU = resultados[7];
    const perdidasT = resultados[8];

    datos.anioIngFac = resultados[5];
    datos.anioIngresoPro = resultados[6];
    datos.aniouprg = perdidasU?.estado === 'ok' ? perdidasU.datos.anio : 0;
    datos.perdidasreg = perdidasT?.estado === 'ok' ? perdidasT.datos.cantidad : 0;
  }

  return datos;
}



/**
 * Función principal que obtiene los registros de la tabla fce_per.alumnos_info,
 * calcula datos adicionales y actualiza la misma tabla.
 */
async function infoOne(tipoO) {

  try {
    let sqlwhere = tipoO === 'P' ? `WHERE anio_ingreso_pro IS NULL` : '';
    const sqlSelect = `SELECT alumno, persona, ubicacion, propuesta, legajo, plan FROM fce_per.alumnos_info ${sqlwhere}`;

    const result = await coneccionDB.query(sqlSelect);

    //console.log("Cantidad de registros:", result.rowCount);
    //console.log(result)
    let actualizados = result.rowCount;
    if (result.rowCount > 0) {


      for (const row of result.rows) {
        const datos = await obtenerDatosAlumno(row, 'I');
        console.log(datos)
        const sqlUpdate = `
      UPDATE fce_per.alumnos_info
      SET 
        anio_ingreso_pro = $1,
        aprobadas = $2,
        reprobadas = $3,
        promedioca = $4,
        promediosa = $5,
        anio_ingreso_fac = $6,
        regularesap = $7,
        perdidasreg = $8,
        ultimaperdireg = $9
      WHERE persona = $10 AND propuesta = $11
    `;

        const values = [
          datos.anioIngresoPro,
          datos.matAprobadas,
          datos.matReprobadas,
          datos.promedioCA,
          datos.promedioSA,
          datos.anioIngFac,
          datos.regulares,
          datos.perdidasreg,
          datos.aniouprg,
          row.persona,
          row.propuesta
        ];

        await coneccionDB.query(sqlUpdate, values);
      }
    }
    return {
      status: "success",
      step: "PASO_2",
      stats: {
        tiempo: "I",
        actualizados: actualizados
      }
    };
  } catch (error) {
    console.log(error)
  }
}




/**
 * Función principal que obtiene los registros de la tabla fce_per.alumnos_info,
 * calcula datos adicionales y actualiza la misma tabla actualizacion de datos 
 */
async function infoOneAct() {
  try {
    // Obtener todos los registros de alumnos
    const sqlSelect = `
      SELECT alumno, persona, ubicacion, propuesta, legajo, plan 
      FROM fce_per.alumnos_info
    `;
    const result = await coneccionDB.query(sqlSelect);

    //console.log("El número de registros es:", result.rowCount);
    let actualizados = 0;
    actualizados = result.rowCount;
    // Establecer search_path una sola vez
    await coneccionDB.query('SET search_path = negocio');

    // Recorrer registros
    let count = 0;
    for (const row of result.rows) {
      count++;
      //console.log(`Procesando registro ${count} de ${result.rowCount} - Alumno: ${row.alumno}`);
      // Obtener solo los datos académicos (modo 'A')
      const datos = await obtenerDatosAlumno(row, 'A');
      console.log(`Datos obtenidos para alumno ${row.alumno}:`, datos);
      // Actualizar los campos correspondientes en alumnos_info
      const sqlUpdate = `
        UPDATE fce_per.alumnos_info
        SET 
          aprobadas = $1,
          reprobadas = $2,
          promedioca = $3,
          promediosa = $4,
          regularesap = $5
        WHERE persona = $6 AND propuesta = $7
      `;
      const values = [
        datos.matAprobadas,
        datos.matReprobadas,
        datos.promedioCA,
        datos.promedioSA,
        datos.regulares,
        row.persona,
        row.propuesta
      ];

      await coneccionDB.query(sqlUpdate, values);
    }

    return {
      status: "success",
      step: "PASO_2",
      stats: {
        tiempo: "A",
        actualizados: actualizados
      }
    };
  } catch (error) {
    console.error("Error en infoOneAct:", error);
    throw error;
  }
}




/**
 * Retorna la cantidad de materias aprobadas para el alumno.
 * Si anio es 0 se toma la condición por defecto, sino se filtra por fecha.
 */
async function materiasAprobadas(alumno, anio) {
  try {
    let sql, params;
    await coneccionDB.query('SET search_path TO negocio');

    if (anio === 0) {
      sql = "SELECT COUNT(*) AS canti FROM negocio.f_certificado_actividades($1, 'A', 'T', 'A')";
      params = [alumno];
    } else {
      sql = `select count(*) as canti from negocio.vw_hist_academica vha where resultado = 'A' and alumno=$1 and anio_academico < $2`
      params = [alumno, anio];
    }
    // console.log(sql);
    // console.log(params)
    const result = await coneccionDB.query(sql, params);


    return result.rows[0].canti;
  } catch (error) {
    console.error("Error en materiasAprobadas:", error);
    throw error;
  }
}
//traer perdidas de regularidad y ultimo año de ran

async function traerperdidasRegularidad(alumno, dev) {
  let sqlstr = "";


  try {
    let result;

    if (dev === 'U') {
      sqlstr = `SELECT  MAX(anio_academico) AS anioulpr 
                FROM negocio.sga_perdida_regularidad spr2 
                WHERE alumno = $1`;
      result = await coneccionDB.query(sqlstr, [alumno]);

      return {
        estado: "ok",
        mensaje: "Año de la última pérdida de regularidad obtenido",
        datos: {
          anio: result.rows[0].anioulpr

        }
      }
    } else {
      sqlstr = `SELECT COUNT(*) AS cantipr 
                FROM negocio.sga_perdida_regularidad spr 
                WHERE alumno = $1`;
      result = await coneccionDB.query(sqlstr, [alumno]);

      return {
        estado: "ok",
        mensaje: "Cantidad de pérdidas de regularidad obtenida correctamente",
        datos: {
          cantidad: parseInt(result.rows[0].cantipr, 10)
        }
      };
    }

  } catch (error) {
    console.error("Error en función traerperdidasRegularidad:", error);

    return {
      estado: "error",
      mensaje: "Ocurrió un error al consultar la pérdida de regularidad",
      error: error.message // solo el mensaje para no exponer más
    };
  }
}


/**
 * Retorna la cantidad de materias reprobadas para el alumno.
 * En el caso de anio igual a 0 se usa la función f_certificado_actividades;
 * de lo contrario se utiliza una vista.
 */
async function materiasReprobadas(alumno, anio) {
  try {
    let sql, params;
    if (anio === 0) {
      await coneccionDB.query('SET search_path TO negocio');

      sql = `
        SELECT COUNT(*) AS canti 
        FROM negocio.f_certificado_actividades($1, 'T', 'T', 'A')
        WHERE resultado='R'
      `;
      params = [alumno];
    } else {
      sql = `
        SELECT COUNT(*) AS canti 
        FROM negocio.vw_hist_academica_basica 
        WHERE fecha < '2023-10-01' AND alumno = $1 AND resultado = 'R' AND anio_academico = $2
      `;
      params = [alumno, anio];
    }
    const result = await coneccionDB.query(sql, params);
    return result.rows[0].canti;
  } catch (error) {
    console.error("Error en materiasReprobadas:", error);
    throw error;
  }
}

/**
 * Calcula el promedio del alumno; 'C' indica con aplazos y 'S' sin aplazos.
 * Se utiliza una fecha de referencia según el parámetro anio.
 */
async function calcularPromedio(alumno, tipo, anio) {
  try {
    await coneccionDB.query('SET search_path TO negocio');

    let sql, params;
    let fechaRef;

    if (anio === 0) {
      // Usamos la fecha actual
      const hoy = new Date();
      const yyyy = hoy.getFullYear();
      const mm = String(hoy.getMonth() + 1).padStart(2, '0');
      const dd = String(hoy.getDate()).padStart(2, '0');
      fechaRef = `${yyyy}-${mm}-${dd}`;
    } else {
      // Año específico -> fecha de corte 1 de abril del año siguiente
      fechaRef = `${anio + 1}-04-01`;
    }

    if (tipo === 'C') {
      sql = "SELECT negocio.f_promedio_gral_con_aplazos($1, $2) AS prom";
    } else if (tipo === 'S') {
      sql = "SELECT negocio.f_promedio_gral_sin_aplazos($1, $2) AS prom";
    } else {
      throw new Error("Tipo inválido. Debe ser 'C' o 'S'.");
    }

    params = [alumno, fechaRef];
    const result = await coneccionDB.query(sql, params);
    const prom = result.rows[0].prom;
    return prom !== null ? prom : 1.00;

  } catch (error) {
    console.error("Error en calcularPromedio:", error);
    throw error;
  }
}

/**
 * Retorna el año de ingreso a la propuesta para la persona indicada.
 * Se consulta el máximo año académico de las propuestas con situación 1 o 2.
 */
async function anioIngreso(per, pro) {
  try {
    const sql = `
      SELECT max(anio_academico) AS anio
      FROM negocio.sga_propuestas_aspira
      WHERE situacion_asp IN (1,2) AND persona = $1 AND propuesta = $2
    `;
    const result = await coneccionDB.query(sql, [per, pro]);
    return result.rows[0].anio !== null ? result.rows[0].anio : 0;
  } catch (error) {
    console.error("Error en anioIngreso:", error);
    throw error;
  }
}

/**
 * Retorna el año de ingreso a la facultad para el legajo proporcionado.
 * Se obtiene el mínimo año académico de la propuesta de ingreso.
 */
async function setearAnioING(leg) {
  try {
    const sql = `
      SELECT min(aspi.anio_academico) AS ingrefac
      FROM negocio.sga_alumnos AS alu
      INNER JOIN negocio.sga_propuestas_aspira AS aspi ON aspi.persona = alu.persona
      WHERE legajo ='${leg}' AND aspi.situacion_asp IN (1,2)
    `;
    const result = await coneccionDB.query(sql);
    return result.rows[0].ingrefac !== null ? result.rows[0].ingrefac : 0;
  } catch (error) {
    console.error("Error en setearAnioING:", error);
    throw error;
  }
}


async function traerRegulares(alumno, plan, anio) {


  try {

    // Establecer el search_path a la esquema 'negocio'
    await coneccionDB.query('SET search_path TO negocio');

    let sql = '';
    let params = []; // Parámetros para la consulta

    if (anio === 0) {
      if (plan === 12 || plan === 13 || plan === 14) {
        sql = `SELECT DISTINCT actividad_codigo 
               FROM vw_regularidades 
               WHERE alumno = $1 
                 AND resultado = 'A' 
                 AND actividad_codigo LIKE '04%'`;
        params = [alumno];
      } else {
        sql = `SELECT DISTINCT actividad_codigo 
               FROM vw_regularidades 
               WHERE alumno = $1 
                 AND resultado = 'A'`;
        params = [alumno];
      }
    } else {
      // console.log('O');
      // Si no se define otro comportamiento para anio distinto de 0, se retorna "0"
      return "0";
    }

    // Ejecutar la consulta
    const result = await coneccionDB.query(sql, params);
    // Obtener el número de filas retornadas
    const nrorow = result.rowCount;

    return nrorow.toString();
  } catch (err) {
    console.error("Error en la consulta:", err);
    throw err;
  }
}


/**
 * Controlador para exponer el endpoint que ejecuta la función infoOne.
 */
export const processInfo_One = async (req, res) => {
  const { tipoO, modo } = req.params
  //console.log(`Procesando infoOne con tipo: ${tp} y etapa: ${etapa}`);
  let result;
  try {
    if (modo === 'A') {
      result = await infoOneAct();
    } else {
      result = await infoOne(tipoO);
    }
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }

}


//
export const setCompletadoProp = async (req, res) => {
  const { alumno, propuesta, plan, matapro } = req.params;

  let porcentaje = 0;
  let matplanproT = 0.0;

  // Lógica de propuesta y plan
  if (propuesta === 2) {
    matplanproT = (plan === 6) ? 37 : 46;
  }

  if (propuesta === 3) {
    matplanproT = (plan === 7) ? 36 : 42;
  }

  if (propuesta === 1) {
    matplanproT = 37;
  }

  if (propuesta === 8) {
    matplanproT = 46;
  }

  if (propuesta === 6) {
    matplanproT = 19;
  }

  if (propuesta === 7) {
    matplanproT = (plan === 17) ? 40 : 36;
  }

  // Calcular porcentaje
  if (matapro > 0) {
    // console.log(matplanproT, matapro, propuesta, plan);
    porcentaje = Math.round((matapro / matplanproT) * 100);
  } else {
    porcentaje = 0;
  }

  //console.log(`Porcentaje calculado: ${porcentaje}`);

  // Ahora hacemos el update en la base de datos
  try {
    const client = await pool.connect();

    const sqlu = `
      UPDATE fce_per.alumnos_info
      SET completado = $1
      WHERE alumno = $2
    `;

    const values = [porcentaje, alumno];

    await coneccionDB.query(sqlu, values);



    return res.json({ message: 'Actualización exitosa', porcentaje });
  } catch (error) {
    console.error('Error en setCompletadoProp:', error);
    return res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

//materias aprobadas por anio segun plan


export const calcularAproAnio = async (req, res) => {
  const { tipoO } = req.params
  const fecha = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  //const fecha = '2021-03-31'; // Fecha de referencia
  let whereext = tipoO === 'P' ? 'AND aniocursada is null ' : ''

  try {
    const sql = `
      SELECT ali.alumno, ali.plan
      FROM fce_per.alumnos_info AS ali
      INNER JOIN negocio.sga_alumnos AS alu ON alu.alumno = ali.alumno
      WHERE plan IN (12,13,14,17) ${whereext}
    `;
    const result = await coneccionDB.query(sql);

    //console.log(`Procesando ${result.rows.length} alumnos...`);
    console.time("Procesamiento alumnos");

    await procesarAlumnosPorLotes(result.rows, fecha, 10);

    console.timeEnd("Procesamiento alumnos");
    //console.log('fin')
    res.send({ message: 'Fin Proceso' });
  } catch (error) {
    console.error("Error en calcularAproAnio:", error);
    res.status(500).send({ error: "Error en calcularAproAnio" });
  }
};

async function procesarAlumnosPorLotes(alumnos, fecha, batchSize = 10) {
  for (let i = 0; i < alumnos.length; i += batchSize) {
    const lote = alumnos.slice(i, i + batchSize);
    await Promise.all(
      lote.map(async (row) => {
        try {
          await verMatAnio(row.alumno, row.plan, fecha);
          await verMatAnioReg(row.alumno, row.plan, fecha);
        } catch (error) {
          console.error(`Error procesando alumno ${row.alumno}`, error);
        }
      })
    );
  }
}

// Función para materias aprobadas según año (histórico)
async function verMatAnio(alumno, plan, fecha) {
  //console.log(fecha)
  let condicionActividad = '';
  if (plan === 17) {
    condicionActividad = `actividad_codigo LIKE '02%'`
  } else {
    condicionActividad = `actividad_codigo LIKE '04%'`
  }
  try {

    // Establecer el search_path a negocio
    await coneccionDB.query("SET search_path TO negocio");

    const sql = `
      SELECT ha.elemento_revision, ha.plan_version, ele.anio_de_cursada
      FROM vw_hist_academica AS ha
      INNER JOIN sga_elementos_plan AS ele 
        ON ele.elemento_revision = ha.elemento_revision AND ele.plan_version = ha.plan_version
       WHERE ${condicionActividad}
        AND CAST(fecha AS DATE) <= $1
        AND resultado = 'A'
        AND alumno = $2
    `;

    const result = await coneccionDB.query(sql, [fecha, alumno]);
    //console.log("verMatAnio - Alumno:", alumno, "Registros:", result.rowCount);

    // Contadores para cada año de cursada
    let uno = 0, dos = 0, tres = 0, cuatro = 0, cinco = 0;
    for (const row of result.rows) {
      const anio = row.anio_de_cursada;
      if (anio === 1) uno++;
      else if (anio === 2) dos++;
      else if (anio === 3) tres++;
      else if (anio === 4) cuatro++;
      else if (anio === 5) cinco++;
    }

    const sqlu = `
      UPDATE fce_per.alumnos_info 
      SET aniounoap = $1, aniodosap = $2, aniotresap = $3, aniocuatroap = $4, aniocincoap = $5
      WHERE alumno = $6
    `;
    if (alumno === 33498) {
      console.log(uno, dos, tres, cuatro, cinco, fecha)
    }
    await coneccionDB.query(sqlu, [uno, dos, tres, cuatro, cinco, alumno]);
    return
  } catch (error) {
    console.error("Error en verMatAnio para alumno", alumno, ":", error);
  }
}

// Función para materias regulares según año
async function verMatAnioReg(alumno, plan, fecha) {
  //02 LLOnuevo , 04 otros planes
  let condicionActividad = '';
  if (plan === 17) {
    condicionActividad = `actividad_codigo LIKE '02%'`
  } else {
    condicionActividad = `actividad_codigo LIKE '04%'`
  }
  try {

    await coneccionDB.query("SET search_path TO negocio");

    const sql = `
      SELECT ha.elemento_revision, ha.plan_version, ele.anio_de_cursada
      FROM vw_regularidades AS ha
      INNER JOIN sga_elementos_plan AS ele 
        ON ele.elemento_revision = ha.elemento_revision AND ele.plan_version = ha.plan_version
        WHERE ${condicionActividad} 
        AND CAST(fecha AS DATE) <= $1
        AND resultado = 'A'
        AND alumno = $2
    `;

    const result = await coneccionDB.query(sql, [fecha, alumno]);
    //console.log("verMatAnioReg - Alumno:", alumno, "Registros:", result.rowCount);

    let uno = 0, dos = 0, tres = 0, cuatro = 0, cinco = 0;
    for (const row of result.rows) {
      const anio = row.anio_de_cursada;
      if (anio === 1) uno++;
      else if (anio === 2) dos++;
      else if (anio === 3) tres++;
      else if (anio === 4) cuatro++;
      else if (anio === 5) cinco++;
    }

    const sqlu = `
      UPDATE fce_per.alumnos_info 
      SET raniounoap = $1, raniodosap = $2, raniotresap = $3, raniocuatroap = $4, raniocincoap = $5
      WHERE alumno = $6
    `;
    await coneccionDB.query(sqlu, [uno, dos, tres, cuatro, cinco, alumno]);
    return
  } catch (error) {
    console.error("Error en verMatAnioReg para alumno", alumno, ":", error);
  }
}



///calcular anio de cursada



export const aniocursada19 = async (req, res) => {

  const { tipo, tipoO } = req.params
  let whereext = tipoO === 'P' ? ' AND aniocursada is null ' : ''
  try {
    //  console.log(tipo)

    // Consulta para obtener los alumnos con plan 12, 13 o 14 o 17
    const sqlSelect = `
      SELECT alumno, propuesta, aniounoap, aniodosap, aniotresap, aniocuatroap, aniocincoap
      FROM fce_per.alumnos_info
      WHERE plan IN (12,13,14,17) 
      ${whereext}
    `;
    const result = await coneccionDB.query(sqlSelect);
    //("El número de registros es:", result.rowCount);

    // Recorrer cada registro y actualizar según corresponda
    for (const row of result.rows) {
      // Se utiliza la función auxiliar para calcular anioC19
      const anioC19 = await calcularAnio19(
        row.propuesta,
        row.aniounoap,
        row.aniodosap,
        row.aniotresap,
        row.aniocuatroap,
        row.alumno
      );
      // console.log(anioC19)
      let sqlUpdate = '';
      if (tipo === '1') {
        sqlUpdate = `
          UPDATE fce_per.alumnos_info
          SET aniocursada = $1
          WHERE alumno = $2
        `;
      } else if (tipo === '2') {
        sqlUpdate = `
          UPDATE fce_per.alumnos_info
          SET aniocursada_b = $1
          WHERE alumno = $2
        `;
      } else {
        // console.log("Tipo no reconocido:", tipo);
        continue;
      }
      //console.log(anioC19, row.alumno)
      // Ejecutar la actualización utilizando parámetros para evitar inyección SQL
      await coneccionDB.query(sqlUpdate, [anioC19, row.alumno]);
    }
    res.send('Nro. de registros = ' + result.rowCount.toString());
  } catch (error) {
    console.error("Error en la actualización:", error);
    throw error;
  }
}

///////
async function calcularAnio19(car, uno, dos, tres, cuatro, alumno) {
  try {
    const carInt = parseInt(car, 10);
    //console.log(uno,dos,tres,cuatro,alumno)
    // Caso para contador: car == 8 o car == 450
    if (carInt === 8 || carInt === 450) {
      if (uno > 8 && dos > 9 && tres > 8 && cuatro > 3) {
        return 5;
      }
      if (uno > 8 && dos > 9 && tres > 3) {
        return 4;
      }
      if (uno > 8 && dos > 3) {
        return 3;
      }
      if (uno > 3) {
        return 2;
      } else {
        return 1;
      }
    }

    // Caso para la: car == 2 o car == 386
    if (carInt === 2 || carInt === 386) {
      if (uno > 8 && dos > 8 && tres > 9 && cuatro > 3) {
        return 5;
      }
      if (uno > 8 && dos > 8 && tres > 3) {
        return 4;
      }
      if (uno > 8 && dos > 3) {
        return 3;
      }
      if (uno > 3) {
        return 2;
      } else {
        return 1;
      }
    }
    if (carInt === 3 || carInt === 464) {
      if (uno > 8 && dos > 8 && tres > 7 && cuatro > 3) {
        return 5;
      }
      if (uno > 8 && dos > 8 && tres > 3) {
        return 4;
      }
      if (uno > 8 && dos > 3) {
        return 3;
      }
      if (uno > 3) {
        return 2;
      } else {
        return 1;
      }
    }

    if (carInt === 7 || carInt === 3905) {

      if (uno > 9 && dos > 9 && tres > 5 && await actividadTroncal(3, alumno)) {

        return 4;
      }
      if (uno > 9 && dos > 5 && await actividadTroncal(2, alumno)) {
        return 3;
      }
      if (uno > 5 && await actividadTroncal(1, alumno)) {
        return 2;
      } else {
        return 1;
      }
    }
  } catch (error) {
    console.error(error);
    return 1
  }
}

const actividadTroncal = async (anio, alumno) => {
  try {

    await coneccionDB.query('SET search_path TO negocio');
    let nro = 0

    let sqlstr = `SELECT COUNT(*) as nrotroncal FROM negocio.vw_hist_academica  WHERE resultado='A' AND alumno =${alumno}`
    if (anio === 3) {
      sqlstr += ` AND actividad_codigo in ('02370', '02375')`
      //  console.log(sqlstr)
      const resu = await coneccionDB.query(sqlstr)
      if (resu.rows[0].nrotroncal > 1) {
        return true
      } else { return false }

    } else if (anio === 2) {
      sqlstr += ` AND actividad_codigo in ('02270', '02275')`
      // console.log(sqlstr)
      const resu = await coneccionDB.query(sqlstr)
      if (resu.rows[0].nrotroncal > 1) {
        return true
      } else { return false }

    } else if (anio === 1) {
      sqlstr += ` AND actividad_codigo in ('02170', '02175')`

      const resu = await coneccionDB.query(sqlstr)
      if (resu.rows[0].nrotroncal > 1) {
        return true
      } else { return false }
    }
  } catch (error) {
    console.log(error)
  }
}

///////////ANIO CURSADA 98






function calcularAnio(car, cantimat) {
  let anioc = "";
  try {
    const carInt = parseInt(car, 10);
    const cantimatInt = parseInt(cantimat, 10);

    // Contador: car == 1 o car == 451
    if (carInt === 1 || carInt === 451) {
      if (cantimatInt < 4) {
        anioc = 1;
      } else if (cantimatInt > 3 && cantimatInt < 12) {
        anioc = 2;
      } else if (cantimatInt > 11 && cantimatInt < 19) {
        anioc = 3;
      } else if (cantimatInt > 18 && cantimatInt < 26) {
        anioc = 4;
      } else if (cantimatInt > 25) {
        anioc = 5;
      }
    }
    // Economía: car == 3 o car == 464
    else if (carInt === 3 || carInt === 464) {
      if (cantimatInt < 4) {
        anioc = 1;
      } else if (cantimatInt > 3 && cantimatInt < 10) {
        anioc = 2;
      } else if (cantimatInt > 9 && cantimatInt < 18) {
        anioc = 3;
      } else if (cantimatInt > 17 && cantimatInt < 26) {
        anioc = 4;
      } else if (cantimatInt > 25) {
        anioc = 5;
      }
    }
    // Administración: car == 2 o car == 386
    else if (carInt === 2 || carInt === 386) {
      if (cantimatInt < 4) {
        anioc = 1;
      } else if (cantimatInt > 3 && cantimatInt < 13) {
        anioc = 2;
      } else if (cantimatInt > 12 && cantimatInt < 22) {
        anioc = 3;
      } else if (cantimatInt > 21) {
        anioc = 4;
      }
    }
    // Logística: car == 7 o car == 3905
    else if (carInt === 7 || carInt === 3905) {
      if (cantimatInt < 5) {
        anioc = 1;
      } else if (cantimatInt > 4 && cantimatInt < 13) {
        anioc = 2;
      } else if (cantimatInt > 12 && cantimatInt < 23) {
        anioc = 3;
      } else if (cantimatInt > 22) {
        anioc = 4;
      }
    }
    // LNRG: car == 6 o car == 8216
    else if (carInt === 6 || carInt === 8216) {
      if (cantimatInt < 8) {
        anioc = 1;
      } else if (cantimatInt > 7 && cantimatInt < 15) {
        anioc = 2;
      } else if (cantimatInt > 14) {
        anioc = 3;
      }
    }
    return anioc;
  } catch (error) {
    console.error("Error en calcularAnio:", error);

  }
}

/**
 * Función que actualiza el campo "aniocursada" o "aniocursada_b" en la tabla fce_per.alumnos_info,
 * según el valor calculado de "anio" a partir de la propuesta y la cantidad de materias aprobadas.
 * Se actualizan los registros que cumplen la condición de plan (5,6,7,10,11).
 *
*/
export const aniocursada98 = async (req, res) => {

  const { tipo, tipoO } = req.params
  let whereext = tipoO === 'P' ? ' AND aniocursada is null ' : ''
  try {


    // Seleccionar registros de alumnos para los planes indicados
    const sqlSelect = `
      SELECT alumno, propuesta, aprobadas 
      FROM fce_per.alumnos_info 
      WHERE plan IN (5, 6, 7, 10, 11) 
      ${whereext}
    `;
    const result = await coneccionDB.query(sqlSelect);
    //console.log("El número de registros es:", result.rowCount);

    // Recorrer cada registro y actualizar el campo correspondiente
    for (const row of result.rows) {
      // Se calcula el valor del año a partir de "propuesta" y "aprobadas"
      const anioC = calcularAnio(row.propuesta, row.aprobadas);
      let sqlUpdate = "";
      if (tipo === '1') {
        sqlUpdate = `
          UPDATE fce_per.alumnos_info
          SET aniocursada = $1
          WHERE alumno = $2
        `;
      } else if (tipo === '2') {
        sqlUpdate = `
          UPDATE fce_per.alumnos_info
          SET aniocursada_b = $1
          WHERE alumno = $2
        `;
      } else {
        //    console.log("Tipo no reconocido:", tipo);
        continue;
      }
      // Ejecutar la actualización utilizando parámetros para evitar inyección SQL
      await coneccionDB.query(sqlUpdate, [anioC, row.alumno]);
    }
    res.send('Fin NroReg= ' + result.rowCount)
  } catch (error) {
    console.error("Error en aniocursada98:", error);
    throw error;
  }
}


///calculo de velocidad de tfc propuesta

export const calculoVelocidad = async (req, res) => {

  const { anio, epoca, tipoO } = req.params
  let whereext = tipoO === 'P' ? " WHERE  coef_tcarrera is null OR coef_tcarrera='NaN' "
    : ""

  const sqlstr = `
    SELECT alumno, anio_ingreso_pro, propuesta, plan_version, aprobadas, regularesap 
    FROM fce_per.alumnos_info ${whereext}
  `;

  //console.log(sqlstr)
  try {

    const result = await coneccionDB.query(sqlstr);
    const rows = result.rows;

    console.log("Número de registros:", rows.length);

    for (const row of rows) {
      let bimestres = [75, 79, 57, 80].includes(row.plan_version) ? 16 : 20;
      //console.log(row.alumno,anio,row.anio_ingreso_fac,epoca)
      let nrobimestres = (anio - row.anio_ingreso_pro) * 4 + parseInt(epoca);

      let aprobadas = row.aprobadas;
      let regulares = row.regularesap;

      let idealExamen = await traerExamenideal(nrobimestres, row.propuesta, row.plan_version);
      let idealCursadas = await traerRegularideal(nrobimestres, row.propuesta, row.plan_version);

      //console.log(nrobimestres,idealExamen, idealCursadas, row.propuesta, row.plan_version,aprobadas, regulares);
      let calculotiempo;
      if (aprobadas > 0 && nrobimestres > 0 || regulares > 0 && nrobimestres > 0) {
        if (aprobadas > 0 && regulares > 0) {
          if (aprobadas > regulares) {
            calculotiempo = idealExamen / aprobadas;
            // console.log(calculotiempo,aprobadas,idealExamen,regulares,row.alumno)
          } else {
            calculotiempo = (idealExamen / aprobadas) * 0.7 + (idealCursadas / regulares) * 0.3;
          }
        } else if (aprobadas > 0 && regulares === 0) {

          calculotiempo = idealExamen / aprobadas;
          //console.log(calculotiempo,aprobadas,idealExamen,regulares,row.alumno)
        } else if (aprobadas === 0 && regulares > 0) {
          calculotiempo = idealExamen * 2 * 0.7 + (idealCursadas / regulares) * 0.3;
        } else {
          calculotiempo = idealExamen * 2;
        }

        if (nrobimestres > bimestres) {
          calculotiempo *= nrobimestres / bimestres;
        }
      } else {
        calculotiempo = 100
      }

      const sqlu = `
        UPDATE fce_per.alumnos_info 
        SET coef_tcarrera = $1 
        WHERE alumno = $2
      `;
      await coneccionDB.query(sqlu, [calculotiempo.toFixed(2), row.alumno]);

      //console.log(`ExamenIdeal: ${idealExamen}, Aprobadas: ${aprobadas}`);
      //console.log(`CursadasIdeal: ${idealCursadas}, Regulares: ${regulares}`);
      //console.log(nrobimestres, bimestres, calculotiempo);

    }
    res.status(200).send({ message: 'OK' })
  } catch (error) {
    console.error("Error en la consulta:", error);
  }
}


async function traerExamenideal(bimestre, propuesta, planversion) {

  //console.log(bimestre, propuesta,planversion)

  const sqlstr = `
    SELECT uno1b, uno2b, uno3b, uno4b,dos1b, dos2b, dos3b, dos4b, 
           tres1b, tres2b, tres3b, tres4b, cuatro1b, cuatro2b, cuatro3b, cuatro4b, 
           cinco1b, cinco2b, cinco3b, cinco4b 
    FROM fce_per.examen_plan_trayecto 
    WHERE cod_propuesta = $1 AND plan_version = $2
  `;


  try {

    const result = await coneccionDB.query(sqlstr, [propuesta, planversion]);
    const row = result.rows[0];

    if (!row) return 0;

    let cantidad = [75, 79, 57, 80].includes(planversion) ? 16 : 20;
    let codigo = cantidad === 16 ? 1 : 2;

    let arrayExamen = Object.values(row);
    if ((codigo === 1 && bimestre > 16) || (codigo === 2 && bimestre > 20)) {
      return arrayExamen[cantidad - 1];
    }
    return arrayExamen[bimestre - 1];
  } catch (error) {
    console.error("Error en traerExamenideal:", error);
    return 0;
  }
}


//
async function traerRegularideal(bimestre, propuesta, planversion) {
  const sqlstr = `
    SELECT uno1b, uno2b, uno3b, uno4b, dos1b,dos2b, dos3b, dos4b, 
           tres1b, tres2b, tres3b, tres4b, cuatro1b, cuatro2b, cuatro3b, cuatro4b, 
           cinco1b, cinco2b, cinco3b, cinco4b 
    FROM fce_per.regular_plan_trayecto 
    WHERE cod_propuesta = $1 AND plan_version = $2
  `;


  try {

    const result = await coneccionDB.query(sqlstr, [propuesta, planversion]);
    const row = result.rows[0];

    if (!row) return 0;

    let cantidad = [75, 79, 57, 80].includes(planversion) ? 16 : 20;
    let codigo = cantidad === 16 ? 1 : 2;

    let arrayExamen = Object.values(row);
    if ((codigo === 1 && bimestre > 16) || (codigo === 2 && bimestre > 20)) {
      return arrayExamen[cantidad - 1];
    }
    return arrayExamen[bimestre - 1];
  } catch (error) {
    console.error("Error en traerRegularideal:", error);
    return 0;
  }
}


///

/**
 * control de calidad alumnos info
 * 
 */


const verificarCalidad = async (alumno) => {
  const sql = `SELECT calidad FROM negocio.sga_alumnos WHERE alumno=$1`;

  try {
    const { rows } = await coneccionDB.query(sql, [alumno]);
    return rows[0]?.calidad || null; // <-- Manejo seguro si no hay resultados

  } catch (error) {
    console.error('Error al obtener calidad del alumno:', error);
    return null; // <-- Evitas romper el proceso
  }
}



export const controlCalidadAluinfo = async (req, res) => {
  const sql = `
    SELECT
      legajo,
      alumno,
      calidad
    FROM fce_per.alumnos_info`;

  try {
    const { rows } = await coneccionDB.query(sql);
    // console.log('Datos obtenidos de alumnos_info:', rows);

    for (const eleemt of rows) {
      const { legajo, alumno, calidad: calidadActual } = eleemt;

      // Verificamos la calidad más actual desde la otra tabla
      const calidadNueva = await verificarCalidad(alumno);
      // console.log(`Alumno: ${alumno} | Calidad actual: ${calidadActual} | Nueva calidad: ${calidadNueva}`);

      if (calidadNueva === null) {
        console.warn(`No se encontró calidad para el alumno ${alumno}`);
        continue; // Si no hay calidad nueva, pasamos al siguiente
      }

      if (calidadNueva !== calidadActual) {
        // Si la calidad es diferente, actualizamos la tabla alumnos_info
        const updateSql = `
          UPDATE fce_per.alumnos_info
          SET calidad = $1
          WHERE alumno = $2
        `;
        await coneccionDB.query(updateSql, [calidadNueva, alumno]);

        //console.log(`Calidad actualizada para legajo ${legajo}: ${calidadActual} ➡️ ${calidadNueva}`);
      }
    }

    res.status(200).json({ message: 'Proceso finalizado correctamente' });

  } catch (error) {
    console.error('Error durante el proceso de control de calidad:', error);
    res.status(500).json({ message: 'Error al procesar los datos' });
  }
};


////control de porcentaje de avance carrera
export const controlPorcentaje = async (req, res) => {
  const { tipoO } = req.params

  let whereext = tipoO === 'P' ? ' WHERE completado is null ' : ''


  const sql = `
    SELECT
      
      alumno,
      aprobadas,
      propuesta,
      plan
      
    FROM fce_per.alumnos_info ${whereext}`;

  let matplanproT = 0;
  let completo = 0.0;
  try {
    const { rows } = await coneccionDB.query(sql);
    // console.log('Datos obtenidos de alumnos_info:', rows);

    for (const element of rows) {
      const { alumno, aprobadas, propuesta, plan } = element;

      if (propuesta == 2) {

        if (plan == 6) {
          matplanproT = 37
        } else {
          matplanproT = 46
        }
      }

      if (propuesta === 3) {

        if (plan === 7) {

          matplanproT = 36
        } else {

          matplanproT = 42
        }
      }

      if (propuesta === 1) {
        matplanproT = 37
      }

      if (propuesta === 8) {
        matplanproT = 46
      }

      if (propuesta === 6) {
        matplanproT = 19
      }

      if (propuesta == 7) {
        if (plan === 11) {
          matplanproT = 36
        } else {
          matplanproT = 40
        }
      }

      if (aprobadas === 0) {
        completo = 0
      } else {
        completo = Math.round((aprobadas / matplanproT) * 100)
      }


      const updateSql = `
          UPDATE fce_per.alumnos_info
          SET completado = $1
          WHERE alumno = $2
        `;
      await coneccionDB.query(updateSql, [completo, alumno]);



    }

    res.status(200).json({ message: 'Proceso finalizado correctamente' });

  } catch (error) {
    console.error('Error durante el proceso de control de porcentaje carrera:', error);
    res.status(500).json({ message: 'Error al procesar los datos' });
  }
};



//control de matricula

const traerlegajo = async (alumno) => {

  const sql = `SELECT legajo FROM negocio.sga_alumnos WHERE alumno=$1`;

  try {
    const { rows } = await coneccionDB.query(sql, [alumno]);
    return rows[0]?.legajo || null; // <-- Manejo seguro si no hay resultados

  } catch (error) {
    console.error('Error al obtener legajo del alumno:', error);
    return null; // <-- Evitas romper el proceso
  }



}


export const controlMatricula = async (req, res) => {
  const sql = `
    SELECT
      
      alumno,
      legajo
    FROM fce_per.alumnos_info WHERE legajo=0`;

  try {
    const { rows } = await coneccionDB.query(sql);
    // console.log('Datos obtenidos de alumnos_info:', rows);

    for (const eleemt of rows) {
      const { alumno } = eleemt;

      // Verificamos la calidad más actual desde la otra tabla
      const legajo = await traerlegajo(alumno);


      if (legajo !== null) {
        // Si la calidad es diferente, actualizamos la tabla alumnos_info
        const updateSql = `
          UPDATE fce_per.alumnos_info
          SET legajo = $1
          WHERE alumno = $2
        `;
        await coneccionDB.query(updateSql, [legajo, alumno]);

        //console.log(`Calidad actualizada para legajo ${legajo}: ${calidadActual} ➡️ ${calidadNueva}`);
      }
    }

    res.status(200).json({ message: 'Proceso finalizado correctamente' });

  } catch (error) {
    console.error('Error durante el proceso de control de matricula:', error);
    res.status(500).json({ message: 'Error al procesar los datos' });
  }
};


////copia real del llenado de informacion solo para anio ultima perdida de regularidad
async function infoOneparcial(tp) {
  let client;

  try {
    let sqlwhere = tp === 'P' ? ` WHERE anio_ingreso_pro is null` : ''
    const sqlSelect = `
      SELECT alumno, persona, ubicacion, propuesta, legajo, plan 
      FROM fce_per.alumnos_info ${sqlwhere}
    `;
    const result = await coneccionDB.query(sqlSelect);
    console.log("El número de registros es:", result.rowCount);
    let aniouprg = 0
    let perdidasreg = 0
    // Recorrer cada registro
    const resu = await coneccionDB.query('set search_path=negocio')
    for (const row of result.rows) {
      // Llamadas a funciones auxiliares (todas retornan Promises)
      // const anioIngFac = await setearAnioING(row.legajo);
      //const matAprobadas = await materiasAprobadas(row.alumno, 0);
      //const matReprobadas = await materiasReprobadas(row.alumno, 0);
      //const promedioCA = await calcularPromedio(row.alumno, 'C', 0);
      //const promedioSA = await calcularPromedio(row.alumno, 'S', 0);
      //const anioIngresoPro = await anioIngreso(row.persona, row.propuesta);
      //const regulares= await traerRegulares(row.alumno,row.plan,0)


      const result1 = await traerperdidasRegularidad(row.alumno, 'U')
      if (result1.estado === 'ok' && result1.datos.anio !== undefined) {
        aniouprg = result1.datos.anio;
        //console.log(result1)  

      }
      const result = await traerperdidasRegularidad(row.alumno, 'T')

      if (result.estado === 'ok' && result.datos.cantidad !== undefined) {
        perdidasreg = result.datos.cantidad;
      }



      //console.log(regulares)
      const sqlUpdate = `
        UPDATE fce_per.alumnos_info
        SET 
            perdidasreg = $1,
            ultimaperdireg = $2
        WHERE persona = $3 AND propuesta = $4
      `;
      const values = [
        perdidasreg,
        aniouprg,
        row.persona,
        row.propuesta
      ];

      await coneccionDB.query(sqlUpdate, values);

    }

    return { message: 'Actualización completada' };
  } catch (error) {
    console.error("Error en infoOne:", error);
    throw error;

  }
}



import coneccionDB from '../database.js'
import  { format } from '@fast-csv/format';

//const coneccionDB = require('../database.js');

/*
select pv.plan_version, pv.plan,pv.version, pv.nombre,pl.codigo from negocio.sga_planes_versiones pv 
inner join negocio.sga_planes pl on pl.plan=pv.plan
where pv.estado in ('A','V') and pl.propuesta in (1,2,3,6,7,8)order by pl.codigo

select ubicacion, sa.propuesta,sa.plan_version,pv.plan,pv.nombre,pl.codigo, count(sa.plan_version) from negocio.sga_alumnos sa 
inner join negocio.sga_planes_versiones pv on pv.plan_version = sa.plan_version 
inner join negocio.sga_planes pl on pl.plan=pv.plan
where not sa.legajo is null and sa.calidad='A' and sa.propuesta in (1,2,3,6,7,8)
group by ubicacion,sa.propuesta,sa.plan_version,pv.plan,pv.nombre,pl.codigo order by ubicacion, sa.propuesta



*/

//verificar alumno

export const getDatosAlumnoApp= async(req,res)=>{

const {documento}= req.body

const hoy = new Date();
const anioActual = hoy.getFullYear();

// Crear fechas de inicio y fin del rango
const fechaInicio = new Date(`${anioActual}-03-10`);
const fechaFin = new Date(`${anioActual}-06-01`);

// ¿Está hoy dentro del rango?
const enRango = hoy >= fechaInicio && hoy <= fechaFin;
let whereClause = `
  ${enRango ? '' : 'not legajo isnull and'}
  mpc.contacto_tipo = 'MP' 
  and sa.calidad='A' 
  and mpd.nro_documento = '${documento}'
`;

try {
    let sqlQry=`select distinct left(usuario,3) as claustro,sa.ubicacion,sa.propuesta,sa.legajo,sa.calidad,mpd.nro_documento , apellido, nombres, mpc.email, sa.alumno  from negocio.mdp_personas mp 
    inner join negocio.mdp_personas_documentos mpd on mpd.documento = mp.documento_principal 
    inner join negocio.mdp_personas_contactos mpc on mpc.persona = mp.persona
    inner join negocio.sga_alumnos sa on sa.persona= mp.persona
    where ${whereClause}
    `
    
    const result = await coneccionDB.query(sqlQry)
    if(result.rows.length>0){
            res.status(201).send(result.rows)
    }else{
        res.status(404).send({message:'No existe Alumno'})
    }
} catch (error) {
    //console.log(error)
    res.status(500).send({message:'se produjo un error'})
}

}


//planes activos con versiones 

export const getPlanesVersionActivos = async (req, res) => {
    let sqlstr = `select pv.plan_version, pv.plan,pv.version, pv.nombre,pl.codigo,pv.estado from negocio.sga_planes_versiones pv 
    inner join negocio.sga_planes pl on pl.plan=pv.plan
    where pv.estado in ('A','V') and pl.propuesta in (1,2,3,6,7,8)order by pl.codigo
    `
    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }
}

//cantidad de alumnos activos mas de una carrera por persona puede haber 
export const getAlumnosActivos = async (req, res) => {
    let sql = "select count(legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)"

    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {
       res.status(500).send({message:'Error fatal'})
    }

}


//cantidad de alumnos activos mas de una carrera por persona puede haber 
export const getAlumnosActivos_Info = async (req, res) => {
  const sql = `
    SELECT persona, alumno, legajo, ubicacion, propuesta, plan_version
    FROM negocio.sga_alumnos
    WHERE calidad = 'A'
      AND legajo IS NOT NULL
      AND propuesta IN (1, 2, 3, 6, 7, 8)
  `;

  try {
    const result = await coneccionDB.query(sql);
    const rows = result.rows;

    if (rows.length === 0) {
      return res.status(404).send('No se encontraron datos.');
    }

    // Cabeceras de respuesta HTTP para archivo CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="alumnos_activos.csv"');

    // Usamos fast-csv para escribir directamente en la respuesta
    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    rows.forEach(row => csvStream.write(row));
    csvStream.end();

  } catch (error) {
    console.error('Error al generar CSV:', error);
    res.status(500).send({ message: 'Error fatal' });
  }
};

//cantidad de alumnos (personas fisicas)
export const getAlumnosPerActivos = async (req, res) => {


    let sql = "select count(distinct legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)"

    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}


//alumnos por propuestas, ubicacion y sexo
export const getAlumnosPorPropuesta = async (req, res) => {

    
    let sql = `select ubicacion,CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
    count(propuesta),sexo from negocio.sga_alumnos as alu 
    inner join negocio.mdp_personas as per on per.persona=alu.persona
    where not legajo isnull and calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) 
    group by propuesta,sexo,ubicacion order by ubicacion,propuesta`


    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}

//alumnos ubi propuesta y planes versiones por sexo
export const getAlumnosPorUbiPropuesta = async (req, res) => {

    let sqlqy = `select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede 
    , sa.propuesta,sa.plan_version,pv.plan,pv.nombre,pl.codigo, count(sa.plan_version),sexo from negocio.sga_alumnos sa 
    inner join negocio.mdp_personas as per on per.persona = sa.persona
    inner join negocio.sga_planes_versiones pv on pv.plan_version = sa.plan_version 
    inner join negocio.sga_planes pl on pl.plan=pv.plan
    where not sa.legajo is null and sa.calidad='A' and sa.propuesta in (1,2,3,6,7,8)
    group by ubicacion,sa.propuesta,sa.plan_version,pv.plan,pv.nombre,pl.codigo,sexo order by ubicacion, sa.propuesta`
    try {
        const resu = await coneccionDB.query(sqlqy)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }
}
//ver alumnos_info

export const getAlumnos_Info= async (req, res)=>{
    let sqlstr=` select * from fce_per.alumnos_info ai order by ubicacion, propuesta,plan,aniocursada `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }
}


//alumnos por ubicacion - propuesta
export const getAlumnosPorUbiPropuestaSVP = async (req, res) => {


    let sqlqy = ` select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, 
    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) 
    group by ubicacion,propuesta order by ubicacion,propuesta`

    try {
        const resu = await coneccionDB.query(sqlqy)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }

}

//alumnos por ubicacion - propuesta provisorios
export const getAlumnosPorUbiPropuestaProvisorios = async (req, res) => {


    let sqlqy = ` select case ubicacion WHEN 1 THEN 185 WHEN 2 THEN 186 WHEN 3 THEN 2714 WHEN 4 THEN 2970 END as codinst,
    case propuesta WHEN 8 THEN 450 WHEN 2 THEN 386 WHEN 3 THEN 464 WHEN 6 THEN 8216 WHEN 7 THEN 3905 END as codtit, count(propuesta)  
    from negocio.sga_alumnos where legajo isnull and calidad='A' and propuesta in (2,3,6,7,8) 
    group by ubicacion, propuesta order by ubicacion,propuesta`
    try {
        const resu = await coneccionDB.query(sqlqy)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }

}

//alumnos por ubicacion - propuesta provisorios

export const getAlumnosPorUbiProvisorios = async (req, res) => {

    const {anioac} = req.params
    let sqlqy = ` select case alu.ubicacion WHEN 1 THEN 185 WHEN 2 THEN 186 WHEN 3 THEN 2714 WHEN 4 THEN 2970 END as codinst,count(alu.propuesta)  
    from negocio.sga_alumnos alu
    inner join negocio.sga_propuestas_aspira spa on spa.persona=alu.persona and spa.propuesta=alu.propuesta
    where legajo isnull and calidad='A' and alu.propuesta in (2,3,6,7,8) and anio_academico=${anioac} and spa.situacion_asp  in (1,2) group by alu.ubicacion order by alu.ubicacion`
    try {
        const resu = await coneccionDB.query(sqlqy)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }

}
    
//por ubicacion
//alumnos por ubicacion - propuesta
export const getAlumnosPorUbi = async (req, res) => {


    let sqlqy = `select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, 
    count(ubicacion) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) 
    group by ubicacion order by ubicacion`



    try {
        const resu = await coneccionDB.query(sqlqy)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }

}

export const getAlumnosAnioCursada= async (req, res)=>{
    let sqlstr=` select ubicacion,case propuesta when 1 then 'CPN' when 2 then 'LA' when 3 then 'LE' when 6 then 'LNRG' when 7 then 'LLO'when 8 then 'CP' end as carerra
    , case plan when 5 then '98' when 6 then '98' when 7 then '98' when 10 then '1' when 11 then '1' when 12 then '19' when 13 then '19' when 14 then '19' when 17 then '2' end as planl, aniocursada, count(aniocursada) from fce_per.alumnos_info ai
    where calidad = 'A'
    group by ubicacion ,propuesta ,plan,aniocursada order by ubicacion, propuesta,plan,aniocursada `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }
}



//reinscripciones

//cantidad reinscripciones por anio, ubicacion,propuesta

export const getReinscriptosUbiProp = async (req, res) => {

    const { anio } = req.params

    let sql = `select CASE alu.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,
     CASE alu.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
    count(alu.propuesta) from negocio.sga_reinscripciones as rei
     inner join negocio.sga_alumnos as alu on alu.alumno=rei.alumno
     where rei.anio_academico=${anio} and  not alu.legajo isnull and  alu.propuesta in (1,2,3,6,7,8)
     group by alu.ubicacion,alu.propuesta order by alu.ubicacion,alu.propuesta `

    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }
}


//desgranamiento cohorte reinscriptos por anio de una cohorte


const TreinscriptosPorAnioCohorte = async (anioI, sede, carrera, i, tipoI) => {


    try {
        let sqlstr = `select count(*) as reinsc from negocio.sga_reinscripciones where anio_academico=${i} and
        alumno in (select sa.alumno  from negocio.sga_propuestas_aspira spa 
        inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta 
        where anio_academico =${anioI} and spa.propuesta in (${carrera}) and sa.ubicacion=${sede} and spa.tipo_ingreso =${tipoI} 
        and situacion_asp in (1,2) and not sa.legajo is null 
        )`

        let resultado = await coneccionDB.query(sqlstr)
        return resultado


    } catch (error) {
        console.log(error)
    }
}


const traerEgresadosCohorte=async (anioI, sede, carrera,i,tipoI)=>{
    let anioR= i + 1
    let fecha = anioR +'-04-01'
    /*
    let certificado=0
    if(carrera==='1')
        {certificado='3'}else if(carrera===2){
            certificado=4
        }else if(carrera==='3'){
            certificado=5
        }else if(carrera==='6'){
            certificado=6
        }else if(carrera==='7'){
            certificado=7
        }else if(carrera==='8'){
            certificado=9
        }
*/
    try {
        
        //let sqlstr =`select case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 8 then 'CP' end as carrera, count(certificado) from negocio.sga_certificados_otorg sco  
        let sqlstr =`select count(*) from negocio.sga_certificados_otorg sco  
                where fecha_egreso<='${fecha}' and persona in (select sa.persona  from negocio.sga_propuestas_aspira spa 
                inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta 
                where anio_academico =${anioI} and spa.propuesta in (${carrera}) and sa.ubicacion=${sede} and spa.tipo_ingreso =${tipoI} 
                and situacion_asp in (1,2) and not sa.legajo is null) and certificado in (3,4,5,6,7,9)
                        
        `
        const resultado = await coneccionDB.query(sqlstr)

        return resultado.rows
    } catch (error) {
        
    console.log(error)
    
    }

}


export const getEvolucionCohorte = async (req, res) => {

    const { anioI, sede, carrera, anioFC, tipoI } = req.params
   

    let aniototal = []

    try {
        for (let i = Number(anioI) + 1; i < Number(anioFC) + 1; i++) {
            console.log(anioI, sede, carrera, i, tipoI)
            let totalI = await TreinscriptosPorAnioCohorte(anioI, sede, carrera, i, tipoI)
            let egresados=await traerEgresadosCohorte(anioI, sede, carrera, i, tipoI)
            //console.log(egresados)
            let objti = { anio: i, total: totalI.rows[0],tote:egresados[0].count }

            aniototal.push(objti)

        }
        //console.log(aniototal)
        res.send(aniototal)
    } catch (error) {
        console.log(error)
    }
}


export const consultaQuery=async (req, res) => {
    const {sqlstr} = req.params;
    //console.log(sqlstr)
  
    if (!sqlstr) {
      return res.status(400).json({ error: "Consulta no proporcionada" });
    }
  
    try {
      const result = await coneccionDB.query(sqlstr);
      res.json(result.rows);
    } catch (error) {
      console.error("Error ejecutando consulta:", error);
      res.status(500).send({ error: "Error en la consulta SQL" });
    }
  };


  // controllers/alumnosController.js

export const getResumenAlumnos = async (req, res) => {
    //const { pool } = require('../db'); // Asegúrate que tenés un archivo db.js que exporta el pool
  
    const query = ` 
      WITH alumnos_filtrados AS (
  SELECT *
  FROM fce_per.alumnos_info
  WHERE calidad = 'A'
    AND propuesta NOT IN (6)
    AND coef_tcarrera NOT IN (0, 100) -- Ahora filtramos 0 y 100
)
SELECT
   CASE ubicacion 
            WHEN 1 THEN 'MZA' 
            WHEN 2 THEN 'SRF' 
            WHEN 3 THEN 'GALV' 
            WHEN 4 THEN 'ESTE' 
          END AS ubicacion,

CASE
    WHEN propuesta = 1 THEN 'CPN'
    WHEN propuesta = 2 THEN 'LA'
    WHEN propuesta = 3 THEN 'LE'
    WHEN propuesta = 7 THEN 'LLO'
    WHEN propuesta = 8 THEN 'CP'
    ELSE 'Otra'
  END AS propuesta,
  
  aniocursada,
  COUNT(*) AS cantidad_alumnos,
  ROUND(AVG(coef_tcarrera), 2) AS promedio_coef_tcarrera,
  ROUND(AVG(completado), 2) AS promedio_completado,
  ROUND(AVG(perdidasreg), 2) AS promedio_perdidas_reg,
  ROUND(AVG(promedioca), 2) AS promedio_promedioca
FROM alumnos_filtrados
GROUP BY propuesta, ubicacion, aniocursada

UNION ALL

SELECT
  'TOTAL' AS propuesta,
  NULL AS ubicacion,
  NULL AS aniocursada,
  COUNT(*) AS cantidad_alumnos,
  ROUND(AVG(coef_tcarrera), 2) AS promedio_coef_tcarrera,
  ROUND(AVG(completado), 2) AS promedio_completado,
  ROUND(AVG(perdidasreg), 2) AS promedio_perdidas_reg,
  ROUND(AVG(promedioca), 2) AS promedio_promedioca
  
FROM alumnos_filtrados
ORDER BY 
  propuesta NULLS LAST,
  ubicacion NULLS LAST,
  aniocursada NULLS LAST;


    `;
  
    try {
      const { rows } = await coneccionDB.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      res.status(500).json({ message: 'Error ejecutando la consulta', error: error.message });
    }
  };
  //////////
  ////////////

  const obtenerReinscripcion = async (alumno, anio) => {
    try {
      const sql = `
        SELECT COUNT(*) AS reinscripcion
        FROM negocio.sga_reinscripciones
        WHERE alumno = $1 AND anio_academico = $2
      `;
  
      const result = await coneccionDB.query(sql, [alumno, anio]);
      return result.rows[0].reinscripcion;
    } catch (error) {
      console.error("Error en obtenerReinscripcion:", error);
      return 0;
    }
  } //////

  const actividadTroncal =async(anio,alumno)=>{
    try {
      
    await coneccionDB.query('SET search_path TO negocio');
    let nro=0
    
    let sqlstr=`SELECT COUNT(*) as nrotroncal FROM negocio.vw_hist_academica  WHERE resultado='A' AND alumno =${alumno}`
    if (anio===3){
      sqlstr += ` AND actividad_codigo in ('02370', '02375')`
      console.log(sqlstr)
       const resu = await coneccionDB.query(sqlstr)
       if (resu.rows[0].nrotroncal > 1){
        return true
       }else{return false}
  
    }else if(anio===2){
      sqlstr += ` AND actividad_codigo in ('02270', '02275')`
      console.log(sqlstr)
      const resu = await coneccionDB.query(sqlstr)
      if (resu.rows[0].nrotroncal > 1){
        return true
       }else{return false}
  
    }else if(anio===1){
      sqlstr += ` AND actividad_codigo in ('02170', '02175')`
      
      const resu = await coneccionDB.query(sqlstr)
      if (resu.rows[0].nrotroncal > 1){
          return true
      }else{return false}
    }
   } catch (error) {
     console.log(error)   
    }
  }
  //////////
  //////////
  async function calcularAnio19 (car, uno, dos, tres, cuatro,alumno) {
    try {
      const carInt = parseInt(car, 10);
      
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
  
      if (carInt===7 || carInt===3905){
      
        if (uno > 9 && dos > 9 && tres > 5 && await actividadTroncal(3,alumno)) {
          
          return 4;
        }
        if (uno > 9 && dos > 5 && await actividadTroncal(2,alumno)) {
          return 3;
        }
        if (uno > 5 && await actividadTroncal(1,alumno)) {
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
  
  ////////

  async function obtenerMateriasPorAnio(alumno, plan, fecha) {
    const condicionActividad = plan === 17
      ? `actividad_codigo LIKE '02%'`
      : `actividad_codigo LIKE '04%'`;
  
    try {
      await coneccionDB.query("SET search_path TO negocio");
  
      const sql = `
        SELECT ele.anio_de_cursada
        FROM vw_hist_academica AS ha
        INNER JOIN sga_elementos_plan AS ele 
          ON ele.elemento_revision = ha.elemento_revision AND ele.plan_version = ha.plan_version
        WHERE ${condicionActividad}
          AND CAST(fecha AS DATE) <= $1
          AND resultado = 'A'
          AND alumno = $2
      `;
      
      const result = await coneccionDB.query(sql, [fecha, alumno]);
  
      let uno = 0, dos = 0, tres = 0, cuatro = 0;
      for (const row of result.rows) {
        const anio = row.anio_de_cursada;
        if (anio === 1) uno++;
        else if (anio === 2) dos++;
        else if (anio === 3) tres++;
        else if (anio === 4) cuatro++;
      }
  
      return { uno, dos, tres, cuatro };
    } catch (error) {
      console.error("Error en obtenerMateriasPorAnio:", error);
      return { uno: 0, dos: 0, tres: 0, cuatro: 0 };
    }
  }
  
//////////
/////////
    async function obtenerMateriasPorAnioLLO(alumno, fecha) {
       
        try {
        
        await coneccionDB.query("SET search_path TO negocio");
    
        const sql = `
            SELECT count(*)as aprobadas
            FROM vw_hist_academica AS ha
            WHERE CAST(fecha AS DATE) <= $1
            AND resultado = 'A'
            AND alumno = $2
        `;
    
        const result = await coneccionDB.query(sql, [fecha, alumno]);
        let materiasAnio = result.rows[0].aprobadas;
        console.log(materiasAnio)
        let aniocursada = 0;
        if (materiasAnio < 5) aniocursada = 1;
        else if (materiasAnio < 13) aniocursada = 2;
        else if (materiasAnio < 23) aniocursada = 3;
        else aniocursada = 4;

    
        return aniocursada; ;

        } catch (error) {
        console.error("Error en obtenerMateriasPorAnio:", error);
        return 1;
        }
    }   
  /////////
  export const calcularAniosCursada = async (req, res) => {
    const {fecha, anio} = req.params; // Fecha por parámetro o default
  
    try {
      const sqlSelect = `
        SELECT alumno, propuesta, plan
        FROM fce_per.alumnos_ingresantes
        WHERE plan IN (17)
      `;
      const result = await coneccionDB.query(sqlSelect);
      const resultados = [];
  
      for (const row of result.rows) {
        const { alumno, propuesta, plan } = row;
  
        const { uno, dos, tres, cuatro } = await obtenerMateriasPorAnio(alumno, plan, fecha);
       // const aniocursada = await calcularAnio19(propuesta, uno, dos, tres, cuatro, alumno);
        //const aniocursada = await obtenerMateriasPorAnioLLO(alumno, fecha);
        //resultados.push({ alumno, aniocursada });
        const reinscripcion=await obtenerReinscripcion(alumno,anio)
        /*
        const sqlUpdate = `
          UPDATE fce_per.alumnos_ingresantes
          SET a_2025 = $1
          WHERE alumno = $2
        `;
        await coneccionDB.query(sqlUpdate, [aniocursada, alumno]);
        */
       /*reinscripcio*/
        console.log(alumno, reinscripcion)
         const sqlUpdate = `
          UPDATE fce_per.alumnos_ingresantes
          SET r_2025 = $1
          WHERE alumno = $2
        `;
        await coneccionDB.query(sqlUpdate, [reinscripcion, alumno]);
        
      }
  
      res.json({
        total: resultados.length,
        registros: resultados
      });
    } catch (error) {
      console.error("Error al calcular años de cursada:", error);
      res.status(500).send("Error en el servidor");
    }
  };
  

  /////////


  //////////
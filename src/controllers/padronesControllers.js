import coneccionDB from "../database";

export const getPadronesEgresados = async (req, res) => {
    const { fecha_i, fecha_f } = req.params;
    const sql = `
          SELECT CONCAT(pe.apellido,', ',pe.nombres),nro_documento ,alu.legajo, case alu.ubicacion when 1 then 'MZA' when 2 then 'SRF'
           when 3 then 'GALV' when 4 then 'ESTE' end as sede , eg.fecha_egreso, case eg.certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE'
           when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta FROM  
        negocio.sga_certificados_otorg as eg  INNER JOIN negocio.mdp_personas as pe ON pe.persona=eg.persona 
        INNER JOIN  negocio.mdp_personas_documentos ped ON ped.documento = pe.documento_principal
         INNER JOIN negocio.sga_alumnos as alu ON alu.alumno=eg.alumno 
         WHERE eg.certificado in (3,4,5,6,7,9) and fecha_egreso >'${fecha_i}' and fecha_egreso <'${fecha_f}' order by fecha_egreso;
    `;
    const result = await coneccionDB.query(sql);
    res.json(result.rows);
};



export const getPadronesAlumnos = async (req, res) => {
    const { fecha_i, fecha_f } = req.params;
    const resu =  await coneccionDB.query('SET search_path TO negocio');
    if (resu.command==='SET'){

    const sql = `
       WITH ResumenMaterias AS (
    SELECT 
        sa.alumno, 
        sa.legajo, 
        CONCAT(mp.apellido, ', ', mp.nombres) AS nombre_completo,
        mpd.nro_documento, 
        case sa.ubicacion when 1 then 'MZA' when 2 then 'SRF'  when 3 then 'GALV' when 4 then 'ESTE' end as sede , 
        case sa.propuesta when 1 then 'CPN' when 2 then 'LA'  when 3 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 8 then 'CP' end as propuesta,
        (SELECT COUNT(*) 
         FROM negocio.vw_hist_academica vh 
         WHERE vh.alumno = sa.alumno 
           AND vh.resultado = 'A' 
           AND vh.fecha > '${fecha_i}' 
           AND vh.fecha < '${fecha_f}'
        ) AS materias_aprobadas
    FROM negocio.sga_alumnos sa 
    INNER JOIN negocio.mdp_personas mp ON mp.persona = sa.persona
    INNER JOIN negocio.mdp_personas_documentos mpd ON mpd.documento = mp.documento_principal 
    WHERE sa.calidad = 'A' 
      AND sa.propuesta IN (2, 3, 6, 7, 8) 
      AND sa.legajo IS NOT NULL
)
SELECT 
    *,
    CASE 
        WHEN materias_aprobadas >= 2 THEN 'S' 
        ELSE 'N' 
    END AS elector
FROM ResumenMaterias;
    `;
    const result = await coneccionDB.query(sql);
    res.json(result.rows);
}else{
    return false
}
};
import coneccionDB from "../database";

//total por anio ubicacion
export const getIngresantesAnioUbi = async (req, res) => {

    const { anio } = req.params

    let sqlstr = `select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, count(sa.ubicacion) as canti  from negocio.sga_propuestas_aspira spa
    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta 
    where anio_academico =${anio} and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null 
    group by sa.ubicacion`

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//sede propuesta con tipo Ingreso 
export const getIngresantesAnioSedePropuestaTI = async (req, res) => {

    const { anio } = req.params
    let sqlstr = `select  CASE sa.propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera
     ,CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,spa.tipo_ingreso , count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa 
    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta 
    where anio_academico =${anio} and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null 
    group by sede,carrera,tipo_ingreso`




    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }


}


//sede propuesta sin TI 
export const getIngresantesAnioSedePropuesta = async (req, res) => {

    const { anio } = req.params
    let sqlstr = `select CASE sa.propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
     CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, count(sa.propuesta) as canti  from negocio.sga_propuestas_aspira spa 
    inner join negocio.sga_alumnos sa on sa.persona=spa.persona and sa.propuesta=spa.propuesta 
    where anio_academico =${anio} and spa.propuesta in (2,3,6,7,8) and situacion_asp in (1,2) and not sa.legajo is null 
    group by sa.ubicacion,sa.propuesta`




    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }


}
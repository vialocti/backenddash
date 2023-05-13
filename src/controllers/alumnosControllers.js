import coneccionDB from '../database'
//cantidad de alumnos activos
export const getAlumnosActivos = async (req, res) => {


    let sql = "select count(legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)"

    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}
//cantidad de alumnos fijos
export const getAlumnosPerActivos = async (req, res) => {


    let sql = "select count(distinct legajo) as canti from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8)"

    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}


//alumnos por propuestas
export const getAlumnosPorPropuesta = async (req, res) => {


    let sql = `select CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) 
     group by propuesta order by propuesta`


    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}

//alumnos por ubicacion - propuesta
export const getAlumnosPorUbiPropuesta = async (req, res) => {


    let sql = ` select CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede, 
    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
     count(propuesta) from negocio.sga_alumnos where calidad = 'A' and not legajo isnull and  propuesta in (1,2,3,6,7,8) 
    group by ubicacion,propuesta order by ubicacion,propuesta`



    try {
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

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
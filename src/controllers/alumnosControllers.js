import coneccionDB from '../database.js'

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

    }

}
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


export const getEvolucionCohorte = async (req, res) => {

    const { anioI, sede, carrera, anioFC, tipoI } = req.params

    let aniototal = []

    try {
        for (let i = Number(anioI) + 1; i < Number(anioFC) + 1; i++) {

            let totalI = await TreinscriptosPorAnioCohorte(anioI, sede, carrera, i, tipoI)
            let objti = { anio: i, total: totalI.rows[0] }

            aniototal.push(objti)

        }
        res.send(aniototal)
    } catch (error) {
        console.log(error)
    }
}



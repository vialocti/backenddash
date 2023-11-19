//import { Connection } from 'pg'
import coneccionDB from '../database'
/*
export const nameFuncion = async (req, res) => {

    const {par, par} = req.params
    

    let sqlstr = `
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}
*/

//import coneccionDB from '../database'

//alumos info por sede carrera plan version anio
export const getAlumnosInfoSedePropuestaplanversion  = async (req, res) => {

    const {ubicacion, propuesta, plan, planversion,anioipro} = req.params
    

    let sqlstr = `select alumno,legajo,ubicacion,propuesta,plan,plan_version ,concat(apellido,', ',nombres) as estudiante ,anio_ingreso_pro ,anio_ingreso_fac ,aprobadas,reprobadas,regularesap ,promedioca, promediosa ,completado  from fce_per.alumnos_info ai 
    where ubicacion=${ubicacion} and propuesta=${propuesta} and plan=${plan} and plan_version =${planversion} and anio_ingreso_pro =${anioipro} order by anio_ingreso_fac 
    `
   console.warn(sqlstr)
    try {
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//planes activos en la tabla info
export const getplanesVersion = async (req, res) => {

       

  let sqlstr=`select distinct ai.propuesta,ai.plan, ai.plan_version, spv.nombre from fce_per.alumnos_info ai
            inner join negocio.sga_planes_versiones spv on spv.plan_version =ai.plan_version 
            order by propuesta`

    try {
            
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}



//import { Connection } from 'pg'
import coneccionDB from '../database.js'
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
    

    let sqlstr = `select alumno,ROUND(SQRT(CAST(legajo AS numeric)), 4) as legajo,ubicacion,propuesta,plan,plan_version ,concat(upper(substring(md5(apellido),1,8)) ,', ',upper(substring(md5(nombres),1,16))) as estudiante ,anio_ingreso_pro ,anio_ingreso_fac ,aprobadas,reprobadas,regularesap ,promedioca, promediosa ,completado,coef_tcarrera,por_relativo  from fce_per.alumnos_info ai 
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


export const traerReinscripciones=async (req,res)=>{

    const {anios} = req.params
    try {
    
        let strqy =`select ubicacion,anio_academico, propuesta, count(anio_academico) from negocio.sga_reinscripciones sr
        inner join negocio.sga_alumnos alu on alu.alumno=sr.alumno
        where anio_academico  in (${anios}) and propuesta in (1,2,3,6,7,8)  group by ubicacion,propuesta,anio_academico order by ubicacion, propuesta,anio_academico 
        `
        const resu = await coneccionDB.query(strqy)
        res.send(resu.rows)
        
    } catch (error) {
        console.log(error)
    }
}



export const traerCantidadInscriptosTotalfceper = async (req, res) =>{

    const {anio,sede} = req.params;
      let sqlstr=`select sum(total_inscriptos), sum(regulares)  from fce_per.dash_actividad_resultados dar  where anio_academico =$1 and sede=$2`
    try {
       
        const resu = await coneccionDB.query(sqlstr,[anio,sede])
        res.send(resu.rows)
    } catch (error) {
        console.log(error)   
    }
}


export const traerDatosHistoricosIndicesTotalPeriodo=async (req,res)=>{
    const {anioI, anioF,sede} = req.params;
    
      let sqlstr=`select * from fce_per.dash_indices_total idt  where anio_academico>=$1 and anio_academico<=$2 and sede=$3`
    try {
       
        const resu = await coneccionDB.query(sqlstr,[anioI,anioF,sede])
        res.send(resu.rows)
    } catch (error) {
        console.log(error)   
    }
}


///--------------------------------
const buscarDatosIndiceT= async (anio)=>{
    
    
    let sqlstr=`select cast(sum("totalInscriptos") as numeric) as "totalInscriptos", sum("totalRegulares") as "totalRegulares", sum("totalDesaprobados") as "totalDesaprobados", sum("totalAusentes") as "totalAusentes"
    , sum("totalPromocionados") as "totalPromocionados",  sum(totalaprobadascc)as totalaprobadascc, sum(totalaprobadascl) as totalaprobadascl from fce_per.dash_indices_total where anio_academico =$1 and sede in ('1','2','4')`
  try {
     
      const resu = await coneccionDB.query(sqlstr,[anio])

      return resu.rows
  } catch (error) {
      console.log(error)   
  }

}


////-------------------------------///

export const traerIndiceTotalAnios = async(req,res)=>{

    const {anioI, anioF} = req.params;
    let listaInd=[]
    
  try {
     
     for( let i = parseInt(anioI);i<parseInt(anioF)+1; i++){
         let datosAnio = await buscarDatosIndiceT(i) 
         datosAnio[0].anio_academico=i
         datosAnio[0].promedioindicecursada= (datosAnio[0].totalRegulares/datosAnio[0].totalInscriptos * 0.7 + datosAnio[0].totalPromocionados/datosAnio[0].totalInscriptos * 0.3).toFixed(3)
         datosAnio[0].promedioindicecorto= (datosAnio[0].totalRegulares/datosAnio[0].totalInscriptos * 0.7 + (datosAnio[0].totalPromocionados/datosAnio[0].totalInscriptos + datosAnio[0].totalaprobadascc/datosAnio[0].totalInscriptos)   * 0.3).toFixed(3)
         datosAnio[0].promedioindicelargo= (datosAnio[0].totalRegulares/datosAnio[0].totalInscriptos * 0.7 + (datosAnio[0].totalPromocionados/datosAnio[0].totalInscriptos + datosAnio[0].totalaprobadascc/datosAnio[0].totalInscriptos + datosAnio[0].totalaprobadascl/datosAnio[0].totalInscriptos) * 0.3).toFixed(3)

         listaInd.push(datosAnio[0])
     } 

      res.send(listaInd)
  } catch (error) {
      console.log(error)   
  }

}


 
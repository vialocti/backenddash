//import { Connection } from 'pg'
import coneccionDB from '../database.js'
import { enviarDatos, traerCantidadporActividad, traerInscriptosSedeAnio, traerRechazadosBajaActividad } from '../services/cursadas/cursadasServices.js'


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
///traelos periodos lectivos en un año academico
export const getPeriodosLectivosAnio = async  (req, res)=>{
    const {anio}=req.params

    let sqlstr = `select spl.periodo_lectivo,spl.periodo,spg.nombre, spg.periodo_generico  from negocio.sga_periodos_lectivos spl
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spg on spg.periodo_generico =sp.periodo_generico 
    where sp.anio_academico =${anio}`

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)

    } catch (error) {
     console.log(error)   
    }
}



//listado de comisiones
export const getListComisionesAnio = async (req, res) => {

    const { anio } = req.params


    let sqlstr = `select sc.ubicacion, se.nombre as mater,sc.comision, sc.nombre,sc.periodo_lectivo,sc.elemento,sc.nombre as nmat,se.codigo,se.nombre, spl.periodo,sp.anio_academico, sp.periodo_generico, sp.nombre , spgt.periodo_generico_tipo,sc.estado  from negocio.sga_comisiones sc 
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and not sc.nombre like'V%' order by sc.ubicacion, sc.periodo_lectivo `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//listado de comisiones por materia solo numero de comision
export const getComisionesAnioMateria = async (req, res) => {

    const { anio, nmateria } = req.params


        let sqlstr = `select sc.comision  from negocio.sga_comisiones sc 
        inner join negocio.sga_elementos se on se.elemento = sc.elemento 
        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
        where sp.anio_academico =${anio} and se.nombre = '${nmateria}' and not sc.nombre like'V%' order by comision `
   // console.log(sqlstr)
    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}


//comisiones por anio sede cantidad
export const getComisionesAnio = async (req, res) => {

    const { anio } = req.params


    let sqlstr = `select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,count(sc.ubicacion) from negocio.sga_comisiones sc
inner join negocio.sga_elementos se on se.elemento = sc.elemento 
inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo
inner join negocio.sga_periodos sp on sp.periodo=spl.periodo 
 
where sp.anio_academico =${anio} and not sc.nombre like'V%' 
group by sc.ubicacion
order by sc.ubicacion
`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}


//comisiones sede plan
export const getComisionesSedePL = async (req, res) => {

    const { anio } = req.params


    let sqlstr = `select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,sp.nombre ,count(sp.nombre) from negocio.sga_comisiones sc
inner join negocio.sga_elementos se on se.elemento = sc.elemento 
inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo
inner join negocio.sga_periodos sp on sp.periodo=spl.periodo 
 
where sp.anio_academico =${anio} and not sc.nombre like'V%' 
group by sc.ubicacion,sp.nombre
order by sc.ubicacion,sp.nombre  
`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//--------//cantidad de inscriptos comision
export const getComisionesCantiInscriptos = async (req, res) => {

    const { anio } = req.params


    let sqlstr = `select sc.ubicacion,sc.nombre as ncomi,se.nombre,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and not sc.nombre like'V%'
    
    group by sc.ubicacion, sc.nombre,se.nombre,sic.comision
    order by sc.ubicacion, sc.nombre  
`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}
 
//
////
//cantidad de inscriptos por espacio curricular para comparativas
export const getActividadCantiInscriptos = async (req, res) => {

    const { anio, sede } = req.params


    let sqlstr = `select sc.ubicacion,se.nombre, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and not sc.nombre like'V%'
    
    group by sc.ubicacion, se.nombre
    order by sc.ubicacion, se.nombre  

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}
////
//cantidad de inscriptos por espacio curricular
export const getActividadCantiInscriptosC = async (req, res) => {

    const { anio, sede } = req.params


    let sqlstr = `select sc.ubicacion,se.nombre,sc.nombre as comi, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and not sc.nombre like'V%'
    
    group by sc.ubicacion, se.nombre,sc.nombre
    order by sc.ubicacion, se.nombre  

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}




//cantidad de inscriptos por actividad discriminando comisiones
//

export const getActividadComisionCantiInscriptos = async (req, res) => {

    const { anio, sede, actividad } = req.params


    let sqlstr = `select sc.ubicacion,sc.nombre as ncomi,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and se.nombre='${actividad}' and  not sc.nombre like'V%'
    
    group by sc.ubicacion, sc.nombre,sic.comision
    order by sc.ubicacion, sc.nombre 

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}



//cantidad de inscriptos por plan - comision
//--------
export const getComisionesCantiInscriptosPlan = async (req, res) => {

        const { anio } = req.params
    
    
        let sqlstr = `select distinct sc.ubicacion,spv.nombre as names ,sc.nombre as namec, se.nombre,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
        inner join negocio.sga_comisiones sc on sc.comision=sic.comision
        inner join negocio.sga_elementos se on se.elemento = sc.elemento 
        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
        inner join negocio.sga_planes_versiones spv on spv.plan_version =sic.plan_version 
        where sp.anio_academico =${anio} and not sc.nombre like'V%'
        
        group by sic.comision,spv.nombre,sc.ubicacion, sc.nombre,se.nombre
        order by sc.ubicacion, sc.nombre
    `
    
        try {
    
    
            const resu = await coneccionDB.query(sqlstr)
            res.send(resu.rows)
        } catch (error) {
            console.log(error)
        }
    

}
//detalle de actas por periodo
export const resultadoActaDetallesporPeriodo = async (req, res) => {

    const {anio, periodo, origen} = req.params
    

    let sqlstr = ` select sc.comision, sc.nombre  as namec,sp.nombre  ,sa.origen ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sa.estado='C' and rectificado='N' and sp.anio_academico =${anio} and sa.origen='${origen}' and sp.periodo_generico =${periodo}
    group by sc.comision,sc.nombre,sp.nombre,sa.origen,sad.resultado order by sc.comision
`
    //console.log(sqlstr)
    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}


//detalle de actas regular, promocion por comision(nombre de la comision)

export const resultadoActaDetallesporComision = async (req, res) => {

    const {anio,ncomision} = req.params
    

    let sqlstr = `select sc.comision,sc.nombre,sp.nombre  ,sa.origen ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sa.estado='C' and sp.anio_academico =${anio} and sa.origen in('P','R') 
     and sc.comision='${ncomision}' and rectificado='N'
    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sad.resultado
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}


//materias
export const getListMateriasComision = async (req, res) => {

    const { anio} = req.params


        let sqlstr = `select distinct se.nombre  from negocio.sga_comisiones sc 
        inner join negocio.sga_elementos se on se.elemento = sc.elemento 
        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
        where sp.anio_academico =${anio} and not sc.nombre like'V%' order by se.nombre `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}


//detalle de actas regular, promocion por comision(nombre de la comision)

export const resultadoActaDetallesporComisiones = async (req, res) => {

    const {anio,ncomisiones} = req.params
    

    let sqlstr = `select sc.comision,sc.nombre,sp.nombre as periodo ,sa.origen ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sa.estado='C' and sp.anio_academico =${anio} and sa.origen in('P','R') 
     and sc.comision in (${ncomisiones}) and rectificado='N'
    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sad.resultado
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}

export const getComparativasInscripcion =async (req,res)=>{

    const {anio, sede} = req.params
    
  
    try {
         let datosCompara=[]
        
      
      
        const traerdato=async (anioc,actividad)=>{
           
           return await traerCantidadporActividad(anioc,sede,actividad)
        }

        const traerdatoR = async (anioc,sede,actividad)=>{
           
            return await traerRechazadosBajaActividad(anioc,sede,actividad)
         }

            const result = await traerInscriptosSedeAnio(anio,sede)
            //console.log(result)
            
            result.forEach(async dato=>{  
                
                let datofila={ubi:1,materia:'',total:0,total1:0,total2:0,total3:0,total4:0,totaR:0,totaR1:0,totaR2:0,totaR3:0,totaR4:0}
               
                     
                //inscriptos anios anteriores
                let dresu1=await traerdato(anio-1,dato.nombre)
                let dresu2=await traerdato(anio-2,dato.nombre)
                let dresu3=await traerdato(anio-3,dato.nombre)
                let dresu4=await traerdato(anio-4,dato.nombre)
               
               
                //rechazados
                let dresur1=await traerdatoR(anio-1,sede,dato.nombre)
                let dresur2=await traerdatoR(anio-2,sede,dato.nombre)
                let dresur3=await traerdatoR(anio-3,sede,dato.nombre)
                let dresur4=await traerdatoR(anio-4,sede,dato.nombre)
                
               
                if(dresu1.length===1){
                    datofila.total1=dresu1[0].tot
                }
                if(dresu2.length===1){
                    datofila.total2=dresu2[0].tot
                }
                if(dresu3.length===1){
                    datofila.total3=dresu3[0].tot
                }
                if(dresu4.length===1){
                    datofila.total4=dresu4[0].tot
                }

           
               
                if(dresur1){
                    datofila.totaR1=dresur1
                }
                if(dresur2){
                    datofila.totaR2=dresur2
                }
                if(dresur3){
                    datofila.totaR3=dresur3
                }
                if(dresur4){
                    datofila.totaR4=dresur4
                }


                datofila.ubi=dato.ubicacion
                datofila.materia=dato.nombre
                datofila.total=dato.tot
                datofila.totaR= await traerRechazadosBajaActividad(anio,sede,dato.nombre)
               console.log(datofila)
                //enviarDatos(datofila) 
              
                
                  datosCompara.push(datofila)
              }
                
                )
                
             
                
                
                setTimeout(()=>res.send(datosCompara),1000)
                
                
            
    } catch (error) {
        console.log(error)
    }



}

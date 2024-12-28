//import { Connection } from 'pg'
import coneccionDB from '../database.js'
import { traerCantidadporActividad, traerInscriptosSedeAnio, traerRechazadosBajaActividad, tratarExamenes } from '../services/cursadas/cursadasServices.js'
import { traerFechaInicioIndices } from './utilesControllers.js'


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

    const { anio} = req.params


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
   // console.log(anio,nmateria)
     
        let sqlstr = `select sc.comision  from negocio.sga_comisiones sc 
        inner join negocio.sga_elementos se on se.elemento = sc.elemento 
        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
        where sp.anio_academico =${anio} and se.nombre = '${nmateria}' and not sc.nombre like'V%' order by comision `
       //console.log(sqlstr)
    try {
        const resu = await coneccionDB.query(sqlstr)
        //console.log(resu.rows)
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
    

    let sqlstr = `select sc.comision,sc.nombre,sp.nombre  ,sa.origen,sa.tipo_acta ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sa.estado='C' and sp.anio_academico =${anio} and sa.origen in('P','R') 
     and sc.comision='${ncomision}' 
    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sa.tipo_acta,sad.resultado
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}


//materias con comisiones anio sede
export const getListMateriasComision = async (req, res) => {

    const { anio, sede } = req.params
        let sedem=""
        if(parseInt(sede)===1){
            sedem="and sc.nombre like 'M0%'"
        }else if(parseInt(sede)===2){
            sedem="and sc.nombre like 'S0%'"
        }else if(parseInt(sede)===3){
            sedem="and sc.nombre like 'GA%'"
        }else if(parseInt(sede)===4){
            sedem="and sc.nombre like 'SM%'"
        }


        let sqlstr = `select distinct se.nombre  from negocio.sga_comisiones sc 
        inner join negocio.sga_elementos se on se.elemento = sc.elemento 
        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
        where sp.anio_academico =${anio} and not sc.nombre like'V%' ${sedem} order by se.nombre `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//detalle cursadasy rendimiento
//cuantas rectificadas son de ausentes cuantas de aptobados y cauantas de reprobadaos


const traerNrorectificadasPorResultado =async (nrocomision)=>{
    
    
    
    try {
        
        const sqlstr=` select resultado,count(resultado) as count from negocio.sga_actas_detalle sad
        inner join negocio.sga_actas sa on sa.id_acta=sad.id_acta
        where rectificado ='S'and sa.comision =${nrocomision} and tipo_acta ='N' group by resultado`

        const result = await coneccionDB.query(sqlstr)
        return result.rows
        
    } catch (error) {
        console.log(error)
    }
}




//traercodigo y nombre de cada comision
const traerDato=(comision,datoscrudos, dis)=>{
     //console.log(comision)
    //console.log(datoscrudos)
    
    const result = datoscrudos.find(e => +e.comision===+comision)
   if(result){
    if(dis===0){
        return result.nombre
    }else if(dis===1){
        return result.periodo
    }
}else{return false}
}

/*
//rectificadas buscar actas rectificadas
const traerDatosRectificadas=(comision, datoscrudos,dis)=>{
    
    
    if(dis ===0){
        const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='R' && e.resultado==='A')
        if(result){
        return result.count
        }else{
            return 0
        }
    }else if(dis===1){
        const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='R' && e.resultado==='R')
        if(result){
        return result.count
        }else{
            return 0
        }
    }else if(dis===2){
        const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='R' && e.resultado==='U')
        if(result){
        return result.count
        }else{
            return 0
        }
    }
}
*/
//traerdatos

const traerDatoPerfomance=(comision,datoscrudos, dis)=>{
    //console.log(comision)
    //console.log(datoscrudos)
    
    //console.log(result)
    if(dis===0){
        //const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='N' && e.resultado==='A')
        //const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.resultado==='A')
        let datofilter=[]
        datofilter = datoscrudos.filter(e => e.comision === +comision && e.origen === 'R' && e.resultado === "A") // Filtrar filas con "A"
        //console.log(datofilter)
        if(datofilter.length>0){
            let result = datofilter.reduce((sum, e) => sum + parseInt(e.count), 0); // Sumar los valores
            return result
        }else{return 0}

    }else if(dis===1){
        //const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='N' && e.resultado==='R')
        let datofilter=[]
        datofilter = datoscrudos.filter(e => +e.comision===+comision && e.origen==='R' && e.resultado==='R')
        //console.log(datofilter)
        if(datofilter.length>0){
            let result = datofilter.reduce((sum, e) => sum + parseInt(e.count), 0); // Sumar los valores
            return result
        }else   
            {return 0}
    
        }else if(dis===2){
        //const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='R' && e.tipo_acta==='N' && e.resultado==='U')
        let datofilter=[]
        datofilter = datoscrudos.filter(e => +e.comision===+comision && e.origen==='R' &&  e.resultado==='U')
        //console.log(datofilter)
        if(datofilter.length>0){
            let result = datofilter.reduce((sum, e) => sum + parseInt(e.count), 0); // Sumar los valores
            return result
        }else{
            return 0
        }
    }else if(dis===3){
        //const result = datoscrudos.find(e => +e.comision===+comision && e.origen==='P' && e.tipo_acta==='N' && e.resultado==='A')
        let datofilter=[]
        datofilter = datoscrudos.filter(e => +e.comision===+comision && e.origen==='P'  && e.resultado==='A')
        //console.log(datofilter)
        if(datofilter.length>0){
            let result = datofilter.reduce((sum, e) => sum + parseInt(e.count), 0); // Sumar los valores
            return result
        }else{
            return 0
        }
    }
    
}
//traer codigo materia de la comision
const traerCodMat=async(comision)=>{
    //console.log(comision)
    try {
        let sqlqry= `select se.codigo from negocio.sga_comisiones sc
        inner join negocio.sga_elementos se on se.elemento =sc.elemento 
        where sc.comision=${comision}
        `
        const resu=await coneccionDB.query(sqlqry)
        return resu.rows[0].codigo
    } catch (error) {
        console.log(error)
    }

}

//traer numero rectificadas por comision




//convertir datos crudos en por comisiones

//comienzo de tratamiento de datos

export const convertirDatos= async (ncomisiones, datoscrudos,anio)=>{
  
    let comitratamiento = ncomisiones.split(',')
    //console.log(datoscrudos)
    const arrayDatos = []
  

    try {
        comitratamiento.forEach(element => {
            let dato={
                comision:0,
                codmat:'',
                nombre:'',
                periodo:'',
                regular:0,
                reprobado:0,
                ausente:0,
                promocionado:0,
                total:0,
                porccentajeR:0.0,
                porccentajeP:0.0,
                examenuno:0,
                porcentaje1E:0.0,
                examendos:0,
                porcentaje2E:0.0
               }
            dato.comision=element
           
            dato.nombre = traerDato(element,datoscrudos, 0)
            dato.periodo = traerDato(element,datoscrudos, 1)
            if(dato.nombre && dato.periodo){
                    arrayDatos.push(dato)
            }
        });
        
       

        arrayDatos.forEach(elemento=>{
            elemento.regular = traerDatoPerfomance(elemento.comision,datoscrudos, 0)
            elemento.reprobado = traerDatoPerfomance(elemento.comision,datoscrudos, 1)
            elemento.ausente = traerDatoPerfomance(elemento.comision,datoscrudos, 2)
            elemento.promocionado = traerDatoPerfomance(elemento.comision,datoscrudos, 3)

      })
      //console.log('HOLA')

      //console.log(arrayDatos)
      
     

      //console.log(arrayDatos)

      arrayDatos.forEach(async element=>{
           
          
           element.total= parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado)
           element.porccentajeR=parseInt(element.regular)/(parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado))
           element.porccentajeP=parseInt(element.promocionado)/(parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado))

      })


       arrayDatos.forEach(async element =>{
            element.codmat= await traerCodMat(element.comision)
       })
       
       
       setTimeout(()=> console.log('Ok'),2000)
       
       
       //tratarExamenes(arrayDatos)
       return arrayDatos


      
    } catch (error) {
        console.log(error)
    }


}



/*
export const convertirDatos= async (ncomisiones, datoscrudos,anio)=>{
  
    let comitratamiento = ncomisiones.split(',')
    //console.log(datoscrudos)
    const arrayDatos = []
  

    try {
        comitratamiento.forEach(element => {
            let dato={
                comision:0,
                codmat:'',
                nombre:'',
                periodo:'',
                regular:0,
                reprobado:0,
                ausente:0,
                promocionado:0,
                total:0,
                porccentajeR:0.0,
                porccentajeP:0.0,
                examenuno:0,
                porcentaje1E:0.0,
                examendos:0,
                porcentaje2E:0.0
               }
            dato.comision=element
           
            dato.nombre = traerDato(element,datoscrudos, 0)
            dato.periodo = traerDato(element,datoscrudos, 1)
            if(dato.nombre && dato.periodo){
                    arrayDatos.push(dato)
            }
        });
        /*
        arrayDatos.forEach(elemento=>{
               
                
        })

        arrayDatos.forEach(elemento=>{
            elemento.regular = traerDatoPerfomance(elemento.comision,datoscrudos, 0)
            elemento.reprobado = traerDatoPerfomance(elemento.comision,datoscrudos, 1)
            elemento.ausente = traerDatoPerfomance(elemento.comision,datoscrudos, 2)
            elemento.promocionado = traerDatoPerfomance(elemento.comision,datoscrudos, 3)

      })
      console.log('HOLA')

      console.log(arrayDatos)
      
      arrayDatos.forEach( elemento=>{
          
           let nroAprobados  = traerDatosRectificadas(elemento.comision,datoscrudos,0)
           let nroReprobados = traerDatosRectificadas(elemento.comision,datoscrudos,1)
           let nroAusentes = traerDatosRectificadas(elemento.comision,datoscrudos,2)
           
           
           //console.log(nroAprobados)
           //console.log(nroReprobados)
           //console.log(nroAusentes)
           
          if (nroAprobados>0){
            //console.log(elemento.regular, nroAprobados)
            elemento.regular = +elemento.regular + parseInt(nroAprobados)
          }
          if (nroReprobados>0){
            //console.log(elemento.regular, nroAprobados)
            elemento.reprobado = +elemento.reprobado + parseInt(nroReprobados)
          }
          if (nroAusentes>0){
            //console.log(elemento.regular, nroAprobados)
            elemento.ausente = +elemento.ausente + parseInt(nroAusentes)
          }

      })

      //console.log(arrayDatos)

      arrayDatos.forEach(async element=>{
            const datosRectificadas =await traerNrorectificadasPorResultado(element.comision)
            
            console.log(element.comision)
            console.log(datosRectificadas)
            if(datosRectificadas.length===1){
                //console.log(datosRectificadas)
               //console.log(datosRectificadas[0].count)
               if(datosRectificadas[0].resultado==='R'){
               element.reprobado= +element.reprobado - datosRectificadas[0].count
               }else if (datosRectificadas[0].resultado==='U'){
                element.ausente= +element.ausente - datosRectificadas[0].count
               }else if(datosRectificadas[0].resultado='A'){
                element.regular= +element.regular - datosRectificadas[0].count
               }
            
            } else if(datosRectificadas.length===2){
                
                //console.log(datosRectificadas[0].count)
                //console.log(datosRectificadas[1].count)

                if(datosRectificadas[0].resultado==='R' && datosRectificadas[1].resultado==='U'){   
                   // console.log('hola')
                    element.reprobado= +element.reprobado - datosRectificadas[0].count
                    element.ausente= +element.ausente - datosRectificadas[1].count
                }else if(datosRectificadas[0].resultado==='A' && datosRectificadas[1].resultado==='R'){
                    element.reprobado= +element.reprobado - datosRectificadas[1].count
                    element.regular= +element.regular - datosRectificadas[0].count
                }else if(datosRectificadas[0].resultado==='A' && datosRectificadas[1].resultado==='U'){
                    element.regular= +element.regular - datosRectificadas[0].count
                    element.ausente= +element.ausente - datosRectificadas[1].count
                }
           
            }else if(datosRectificadas.length===3){
               
                element.regular= +element.regular - datosRectificadas[0].count
                element.reprobado= +element.reprobado - datosRectificadas[1].count
                element.ausente= +element.ausente - datosRectificadas[2].count

            }
          
           element.total= parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado)
           element.porccentajeR=parseInt(element.regular)/(parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado))
           element.porccentajeP=parseInt(element.promocionado)/(parseInt(element.regular) + parseInt(element.ausente) + parseInt(element.reprobado))

      })


       arrayDatos.forEach(async element =>{
            element.codmat= await traerCodMat(element.comision)
       })
       
       
       setTimeout(()=> console.log('Ok'),2000)
       
       
       //tratarExamenes(arrayDatos)
       return arrayDatos


      
    } catch (error) {
        console.log(error)
    }


}

*/


//detalle de actas regular, promocion por comision(nombre de la comision)
//la madre de las funciones de resultados de actividad

 
export const resultadoActaDetallesporComisiones = async (req, res) => {

    const {anio,ncomisiones, codsede, recursado} = req.params
    //console.log(ncomisiones)
    let conrecu= ''
    if (recursado==='N'){
        conrecu=`and not upper(sc.nombre) like('%RECUR%')`
    }else if (recursado==='R'){
        conrecu=`and upper(sc.nombre) like('%RECUR%')`
    }
    

    let sqlstr = `select sc.comision,sc.nombre,sp.nombre as periodo ,sa.origen,sa.tipo_acta ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sad.rectificado='N' and sa.estado='C' and sp.anio_academico =${anio} and sa.origen in('P','R') 
     and sc.comision in (${ncomisiones}) and sc.nombre like('${codsede}%') ${conrecu}
    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sa.tipo_acta,sad.resultado
  `
//
    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        
        const datos = await convertirDatos(ncomisiones, resu.rows, anio)
       
       setTimeout(()=>{
        datos.forEach(async element=>{
            element.examenuno= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1) || 0
            element.porcentaje1E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1)/element.total || 0

            element.examendos= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2) || 0
            element.porcentaje2E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2)/element.total || 0

            //console.log('E2')
            //console.log(element.examendos, element.porcentaje2E)

           })
    
        
    },1000) 
    setTimeout(()=>{
       //console.log(datos)
        res.send(datos)
    },3000)
        
       //res.send(datos)
    } catch (error) {

    }

}



//













//detalle de actas regular, promocion por comision(nombre de la comision)
//la madre de las funciones de resultados de actividad

/*primera 
export const resultadoActaDetallesporComisiones = async (req, res) => {

    const {anio,ncomisiones, codsede} = req.params
    //console.log(ncomisiones)
    

    let sqlstr = `select sc.comision,sc.nombre,sp.nombre as periodo ,sa.origen,sa.tipo_acta ,resultado,count(resultado)  from negocio.sga_actas_detalle sad 
    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta
    inner join negocio.sga_comisiones sc on sc.comision=sa.comision 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
    where sa.estado='C' and sp.anio_academico =${anio} and sa.origen in('P','R') 
     and sc.comision in (${ncomisiones}) and sc.nombre like('${codsede}%') and not upper(sc.nombre) like('%RECUR%')
    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sa.tipo_acta,sad.resultado
  `

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
       const datos = await convertirDatos(ncomisiones, resu.rows, anio)
       
       setTimeout(()=>{
        datos.forEach(async element=>{
            element.examenuno= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1) || 0
            element.porcentaje1E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1)/element.total || 0

            element.examendos= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2) || 0
            element.porcentaje2E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2)/element.total || 0

            //console.log('E2')
            //console.log(element.examendos, element.porcentaje2E)

           })
    
        
    },1000) 
    setTimeout(()=>{
       //console.log(datos)
        res.send(datos)
    },3000)
        
       //res.send(datos)
    } catch (error) {

    }

}

*/

//

//comparativa de inscripciones
//

export const getComparativasInscripcion =async (req,res)=>{

    const {anio, sede} = req.params
    
   //console.log(anio,sede)
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
               //console.log(datofila)
                //enviarDatos(datofila) 
              
                
                  datosCompara.push(datofila)
              }
                
                )
                               
                
                setTimeout(()=>res.send(datosCompara),1000)
                
                
            
    } catch (error) {
        console.log(error)
    }



}
//consulta de datos historicos

export const traerDatosHistoricosResultados=async (req,res)=>{
    
     const {sede,anioI,anioF,actividad}=req.params
     //console.log(actividad,sede,anioI,anioF)
    
    let sql=''
    if(actividad==='Todas'){

        sql = `select * from fce_per.dash_actividad_resultados where anio_academico>=${anioI} and anio_academico<=${anioF} and sede='${sede}' order by actividad_nombre`
    }else{
    
    
        sql = `select * from fce_per.dash_actividad_resultados where anio_academico>=${anioI} and anio_academico<=${anioF} and sede='${sede}' 
        and actividad_nombre='${actividad}' order by anio_academico` 
    }
    //console.log(sql)
    try {
        
        const resu =await coneccionDB.query(sql)
        //console.log(resu.rows)
        res.send(resu.rows)

    } catch (error) {
        console.log(error)
    }
}



//actividades historicas

export const traerActividadesHistoricas=async (req,res)=>{
    const {sede, anioI}= req.params
    
    try {
        let sqlStr = `SELECT actividad_nombre FROM fce_per.dash_actividad_resultados WHERE sede='${sede}' AND anio_academico=${anioI}`    
        
        
        const resu = await coneccionDB.query(sqlStr)
        res.send(resu.rows)

    } catch (error) {
        
        console.log(error)
    }
}

//trae examen cantidad por comision de cursada

const traerExamenAprobadosComision=async (anio, comision,codmat, ciclo)=>{

    const fechas = await traerFechaInicioIndices(comision)
    //console.log(anio,comision,codmat,ciclo)
    try {
        let sqlstr=''
        if (ciclo=== 2){
        sqlstr=`select count(turno_examen_nombre)  from negocio.vw_hist_academica  vwh where vwh.alumno in (
            select distinct sic.alumno from negocio.sga_insc_cursada sic 
            inner join negocio.sga_comisiones sc on sc.comision=sic.comision
            inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
            inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
            where sp.anio_academico =${anio} and sc.comision=${comision}
            ) and fecha > '${fechas.fechaI}' and fecha<='${fechas.fechaF}' and actividad_codigo ='${codmat}' and origen='E' and resultado ='A'
            
        `
        }else{

        sqlstr=`select fecha,turno_examen_nombre, count(turno_examen_nombre)  from negocio.vw_hist_academica  vwh where vwh.alumno in (
            select distinct sic.alumno from negocio.sga_insc_cursada sic 
            inner join negocio.sga_comisiones sc on sc.comision=sic.comision
            inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo 
            inner join negocio.sga_periodos sp on sp.periodo =spl.periodo 
            where sp.anio_academico =${anio} and sc.comision=${comision}
            ) and fecha > '${fechas.fechaI}' and fecha<='${fechas.fechaF}' and actividad_codigo ='${codmat}' and origen='E' and resultado ='A'
            group by fecha,turno_examen_nombre
            order by fecha`

        }
        //console.log(sqlstr)
            const resu = await coneccionDB.query(sqlstr)
           
            
            if(ciclo===1){
                return resu.rows[0].count
            }

            if(ciclo===2){
                    
                return resu.rows[0].count
            }

    } catch (error) {
        console.log(error)
    }

}
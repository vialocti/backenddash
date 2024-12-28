
/*
 const rows = await axios.get(`${uri}/materiascomision/${anio}`)getListMateriasComision
const rows = await axios.get(`${uri}/comisionesnumero/${anio}/${nmateria}`)getComisionesAnioMateria

      let ncomisiones = await traerNumerosComisiones(anio,materia)
        //console.log(ncomisiones)
        const rows = await axios.get(`${uri}/detalleporcomisiones/${anio}/${ncomisiones}/${codsede}`)
*/
import coneccionDB from '../database.js'
import { convertirDatos } from './cursadasControllers.js'


const grabarRegistro= async(registro)=>{
  const {actividad, anio, codsede,total,regulares,reprobados,ausentes,promocionados,indiceReg, indiceProm,indiceAct,recursado} = registro
  console.log(codsede)
  let sede=0
  if(codsede==='M0'){
    sede=1
  }else if(codsede==='S0'){
    sede=2
  }else if(codsede==='GA'){
    sede=3
  }else if(codsede==='SM'){
    sede=4
  }
  try{
  let sqlI = "INSERT INTO fce_per.dash_actividad_resultados (anio_academico,sede,actividad_nombre,total_inscriptos,regulares,reprobados,ausentes,promocionados,relacion_regular,relacion_promocion,indice_cursada,recursado) values("
  sqlI=sqlI + anio + "," + sede +",'" + actividad + "'," + total + "," + regulares + "," + reprobados + "," + ausentes + "," + promocionados + "," + indiceReg + ", " + indiceProm + "," + indiceAct + ",'" + recursado + "')"
  //console.log(sqlI)
   const result = await coneccionDB.query(sqlI)
   
  console.log(result.rowCount)
  }catch(error){
    
    console.log(error)
  }


}


const tratarDatos=(detalleComisiones,anio,actividad,codsede,recursado)=>{
  console.log(anio,actividad)
  console.log(detalleComisiones)
  
  
  let cantiRegular = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.regular)}, 0)
  let cantiReprobado = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.reprobado)}, 0)
  let cantiAusente = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.ausente)}, 0)
  let cantiPromo = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.promocionado)}, 0)
  let cantiTotal = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.total)}, 0)
  let indicereg= cantiRegular/cantiTotal 
  let indicepro=cantiPromo/cantiTotal
  let indiceT=indicereg * 0.7 + indicepro * 0.3

  let cantiA1 = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.examenuno)}, 0)
  let registro = {
  actividad:actividad,
  anio:anio,
  codsede:codsede,
  total:cantiTotal,
  regulares:cantiRegular,
  reprobados:cantiReprobado,
  ausentes:cantiAusente,
  promocionados:cantiPromo,
  indiceReg:indicereg.toFixed(2),
  indiceProm:indicepro.toFixed(2),
  indiceAct:indiceT.toFixed(2),
  aprobadose1:cantiA1,
  recursado:recursado
}
if(cantiTotal>0){
const result= grabarRegistro(registro)
}
//return true
}


const resultadoDetallesporComisionesH = async (anio,ncomisiones,codsede, actividad, recursado) => {

  
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

  try {
      
      //console.log(anio,ncomisiones,codsede)
      const resu = await coneccionDB.query(sqlstr)
      
      
     const datos = await convertirDatos (ncomisiones, resu.rows,anio)
     //console.log(datos)
     //setTimeout(()=>{ console.log('siga siga')},10000)
     /*
     setTimeout(()=>{
     datos.forEach(async element=>{
         

         let examenuno=-1
         let examendos=-1
         let porcentaje1E=-1
         let porcentaje2E=-1

         examenuno= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1) || 0
        porcentaje1E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 1)/element.total || 0

          examendos= await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2) || 0
          porcentaje2E=await traerExamenAprobadosComision(anio,element.comision,element.codmat, 2)/element.total || 0

          //console.log('E2')
          if (examenuno>-1 && examendos>-1 && porcentaje1E>-1 && porcentaje2E>-1){
          element.examenuno=examenuno 
          element.porcentaje1E=porcentaje1E

          element.examendos= examendos
          element.porcentaje2E=porcentaje2E
          }
         })
  
       
     //console.log(datos)
        },1500)
        */
     setTimeout(()=>{ tratarDatos(datos,anio,actividad,codsede, recursado)},1000)
     
      console.log(datos)
     //return datos
  } catch (error) {

  }

}


const getNrocomisionesMateria = async (anio, nmateria) => {


   
      let sqlstr = `select sc.comision  from negocio.sga_comisiones sc 
      inner join negocio.sga_elementos se on se.elemento = sc.elemento 
      inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
      inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
      inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
      where sp.anio_academico =${anio} and se.nombre = '${nmateria}' and not sc.nombre like'V%' order by comision `
     // console.log(sqlstr)
  try {
      const resu = await coneccionDB.query(sqlstr)
      return resu.rows
      
  } catch (error) {
      console.log(error)
  }

}



const getListMateriasComision = async (anio) => {

      let sqlstr = `select distinct se.nombre  from negocio.sga_comisiones sc 
      inner join negocio.sga_elementos se on se.elemento = sc.elemento 
      inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
      inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
      inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
      where sp.anio_academico =${anio} and not sc.nombre like'V%' order by se.nombre `

  try {
      const resu = await coneccionDB.query(sqlstr)
      return resu.rows
  } catch (error) {
      console.log(error)
  }

}

const getListadomateriasComisionRec=async (anio,sede)=>{
    
  let sqlstr=`select actividad_nombre as nombre from fce_per.dash_actividad_resultados where anio_academico=${anio} and cast(sede as integer)=${sede} and recursado='R'`
    try {
      const resu = await coneccionDB.query(sqlstr)
    
      console.log(resu.rows)
      return resu.rows
  } catch (error) {
      console.log(error)
  }
}






//import {getListMateriasComision,getComisionesAnioMateria,resultadoActaDetallesporComisiones} from './cursadasControllers.js'

export const grabardatosCursadas =async (req,res)=>{

    const {anio,sede,recursado}=req.params
    const arrayCapo = []
    let comisionesN=''
    let dato=null
    let result
    if (recursado==='S'){
        result= await getListadomateriasComisionRec(anio,sede)
    }else{
        result = await getListMateriasComision(anio,sede)
    }
    const materias = result
   
    
   
    if(materias){

        materias.forEach(async element => {
        //console.log(element.nombre)
          const comisiones = await getNrocomisionesMateria(anio,element.nombre)
        
            //console.log(comisiones)
       
          if(comisiones){
            
            for (const elemento of comisiones) {
              
              comisionesN += elemento.comision + ",";
            
            }
            comisionesN = comisionesN.substring(0, comisionesN.length - 1);
            //console.log(comisionesN)
            
            
          
          //const datos = await resultadoDetallesporComisiones(anio,comisionesN,'S0')
          //console.log(datos)
            dato={
              actividad:element.nombre,
              anio,
              sede:sede==='1'?'M0':sede==='2'?'S0':sede==='3'?'GA':'SM',
              comisionesN
            }
            //console.log(arrayCapo)
           
            comisionesN=''  
            //console.log('P')
         
            arrayCapo.push(dato)
              
            
            
          }
      });
      
      
     
    }

    setTimeout(() => {
         console.log('fin')
      //console.log(arrayCapo)
   

    //console.log(arrayCapo)
    if(arrayCapo && arrayCapo.length>0){
    
    
     
      arrayCapo.forEach( elemento=>{
        setTimeout(async() =>{
        const result = await resultadoDetallesporComisionesH(elemento.anio,elemento.comisionesN,elemento.sede, elemento.actividad,recursado)
        
      }, 2000)


        setTimeout(()=>console.log('na'),1000)
        //tratarDatos(datos,anio,elemento.actividad, elemento.sede)
     
        //console.log(result)
        
      })
    
        
    
  } else{
    console.log('nada')
  }
}, 2000);
}

export const traerFechaInicioIndices =async (comision)=>{
    
    

    try{
    let strQry = `select  spl.fecha_fin_dictado from negocio.sga_comisiones sc 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo 
    where sc.comision = ${comision}`

    const resu = await coneccionDB.query(strQry)
    const  fecha = resu.rows[0]
    
    let anioI = fecha.fecha_fin_dictado.getFullYear()
    let mes = fecha.fecha_fin_dictado.getMonth() + 1
    let dia = fecha.fecha_fin_dictado.getDate()
    let anioF= anioI + 2

    if(dia<10){
      dia='0' + dia
    }
    if(mes<10){
      mes='0' + mes
    }
    let fechaI = anioI + "-" + mes + "-" + dia
    let fechaF = anioF + "-" + mes + "-" + dia

    return {'fechaI':fechaI, 'fechaF':fechaF}
    }
    catch(error){
      console.log(error)
    }
}





const traerExamenAprobadosComision=async (anio, comision,codmat, ciclo)=>{

  const fechas = await traerFechaInicioIndices(comision)
 console.log(anio,comision,codmat,ciclo)
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
        
          if (resu.rowCount>0){
          
              //console.log(ciclo,resu.rows[0].count)    
              return resu.rows[0].count
         
              
        }else{return 0}

        
  } catch (error) {
      console.log(error)
  }

}

//examenes por comision 

/////

const getListMateriasComisionDH = async (anio,sede) => {

  let sqlstr = `select actividad_nombre, id, recursado  from fce_per.dash_actividad_resultados where anio_academico=${anio} and sede='${sede}'` 
 

try {
  const resu = await coneccionDB.query(sqlstr)
  return resu.rows
} catch (error) {
  console.log(error)
}

}


/////
////
const actualizar_datos=async (id, aprobadase1,aprobadase2)=>{

  let sqlu=`UPDATE fce_per.dash_actividad_resultados SET aprobadase1=${aprobadase1}, aprobadase2=${aprobadase2} WHERE id=${id}`
  try {
    const resu= await coneccionDB.query(sqlu)
    return 'ok'
  } catch (error) {
    console.log(error)
  }

}

//tratamiento examenes

const tratamiento_examenes=async (id, comisiones, codigosmat, anio)=>{

    let aprobadase1=0
    let aprobadase2=0
     // console.log(comisiones, codigosmat)
    
      let comi = comisiones.split(",")
      let codi = codigosmat.split(",")
      //console.log(id)
     
      //if(id==='3'){
      for(let i=0; i<comi.length;i++){
        
        aprobadase1 += parseInt(await traerExamenAprobadosComision(anio,comi[i], codi[i],1))
        
      }

      for(let i=0; i<comi.length;i++){

        aprobadase2 += parseInt(await traerExamenAprobadosComision(anio,comi[i], codi[i],2))
        
      }
        
      const result = await actualizar_datos(id, aprobadase1, aprobadase2)
      console.log(result)
    //}
      //

}

//
const getNrocomisionesMateriaEx = async (anio, nmateria,codsede,recursado) => {

 //console.log(anio,nmateria,codsede)
 let conrecu= ''
 if (recursado==='N'){
     conrecu=`and not upper(sc.nombre) like('%RECUR%')`
 }else if (recursado==='R'){
     conrecu=`and upper(sc.nombre) like('%RECUR%')`
 }
   
  let sqlstr = `select sc.comision, se.codigo as codmat  from negocio.sga_comisiones sc 
  inner join negocio.sga_elementos se on se.elemento = sc.elemento 
  inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
  inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
  inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
  where sp.anio_academico =${anio} and se.nombre = '${nmateria}'  and left(sc.nombre,2)='${codsede}'  ${conrecu}  order by comision `
  if(recursado==='R'){
  console.log(sqlstr)
  }
try {
  const resu = await coneccionDB.query(sqlstr)
  return resu.rows
  
} catch (error) {
  console.log(error)
}

}


///buscar comisiones en archivo
export const grabardatosCursadasExamenes =async (req,res)=>{

  const {anio,sede}=req.params
  const arrayCapo = []
  let comisionesN=''
  let codigosmatN=''
  let dato=null
  const result = await getListMateriasComisionDH(anio, sede)
  const materias = result
 
  let codsede=sede==='1'?'M0':sede==='2'?'S0':sede==='3'?'GA':'SM'
 
  if(materias){
     // console.log(materias)
      materias.forEach(async element => {
      //console.log(element.actividad_nombre)
        
          const comisiones = await getNrocomisionesMateriaEx(anio,element.actividad_nombre,codsede,element.recursado)
      
      
          for (const elemento of comisiones) {
            
              comisionesN += elemento.comision + ",";
              codigosmatN += elemento.codmat + ",";
          
              }
          
              comisionesN = comisionesN.substring(0, comisionesN.length - 1);
              codigosmatN = codigosmatN.substring(0, codigosmatN.length - 1);
              //console.log(comisionesN)
          
          
        
            //const datos = await resultadoDetallesporComisiones(anio,comisionesN,'S0')
            //console.log(datos)
              dato={
                id:element.id,
                actividad:element.actividad_nombre,
                anio,
                sede:sede==='1'?'M0':sede==='2'?'S0':sede==='3'?'GA':'SM',
                comisiones: comisionesN,
                codigosmat: codigosmatN
              }
              //console.log(arrayCapo)
            
              comisionesN=''
              codigosmatN=''
          //console.log('P')
       
             arrayCapo.push(dato)
            
          
          
        

    });
    
    
   
  }

  setTimeout(() => {
       console.log('fin')
    //console.log(arrayCapo)
 

 // console.log(arrayCapo)
  if(arrayCapo && arrayCapo.length>0){
  
  
    //console.log(arrayCapo)
    
    arrayCapo.forEach( elemento=>{
      setTimeout(async() =>{
     
        tratamiento_examenes(elemento.id, elemento.comisiones, elemento.codigosmat, elemento.anio)
    }, 2000)


      setTimeout(()=>console.log('na'),1000)
      //tratarDatos(datos,anio,elemento.actividad, elemento.sede)
   
      //console.log(result)
      
    })
  
      
 
} else{
  console.log('nada')
}
}, 2000);
}



const grabarDatosIndice= async(id, relae1,relae2,indiceC1,indiceC2)=>{


  let sqlu=`UPDATE fce_per.dash_actividad_resultados SET relacion_e1=${relae1}, relacion_e2=${relae2}
  , indice_e1=${indiceC1}, indice_e2=${indiceC2}  WHERE id=${id}`
  try {
    const resu= await coneccionDB.query(sqlu)
    return 'ok2'
  } catch (error) {
    console.log(error)
  }




}


export const calculoIndicesTotales =async (req,res)=>{
  const {anio,sede}=req.params
  
  let sqlstr = `select total_inscriptos,relacion_regular,relacion_promocion, aprobadase1, aprobadase2, id 
   from fce_per.dash_actividad_resultados where anio_academico=${anio} and sede='${sede}'` 
  

  try {
  const result = await coneccionDB.query(sqlstr)
  if (result.rows){
    result.rows.forEach( async element=>{
      let totai= element.total_inscriptos
      let r_regu = element.relacion_regular
      let r_promo = element.relacion_promocion
      let aproe1 = element.aprobadase1
      let aproe2 = element.aprobadase2

    let relae1=(aproe1/totai).toFixed(2)
    let relae2=(aproe2/totai).toFixed(2)
    let indiceC1= parseFloat(r_regu) * 0.7 + (parseFloat(r_promo) + parseFloat(relae1)) * 0.3
    let indiceC2= parseFloat(r_regu) * 0.7 + (parseFloat(r_promo) + parseFloat(relae2)) * 0.3
    await grabarDatosIndice(element.id, relae1,relae2,indiceC1.toFixed(3),indiceC2.toFixed(3))
    })
  }

  } catch (error) {
    console.log(error)
  }

} 


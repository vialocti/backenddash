
/*
 const rows = await axios.get(`${uri}/materiascomision/${anio}`)getListMateriasComision
const rows = await axios.get(`${uri}/comisionesnumero/${anio}/${nmateria}`)getComisionesAnioMateria

      let ncomisiones = await traerNumerosComisiones(anio,materia)
        //console.log(ncomisiones)
        const rows = await axios.get(`${uri}/detalleporcomisiones/${anio}/${ncomisiones}/${codsede}`)
*/

import coneccionDB from '../database.js'
import { convertirDatos } from './cursadasControllers.js'

//const coneccionDB = require('../database.js');
//const { convertirDatos } = require('./cursadasControllers.js');


const grabarRegistro= async(registro)=>{
  const {actividad, anio, codsede,total,regulares,reprobados,ausentes,promocionados,indiceReg, indiceProm,indiceAct,recursado} = registro
  console.log(codsede, actividad)
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
   
  //console.log(result.rowCount)
  }catch(error){
    
    console.log(error)
  }


}


const tratarDatos=(detalleComisiones,anio,actividad,codsede,recursado)=>{
  //console.log(anio,actividad)
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
  regulares:cantiRegular-cantiPromo, //resto promocionados a regulareas
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
return 
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
     
      //console.log(datos)
     return
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
    
      //console.log(resu.rows)
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
        result = await getListMateriasComision(anio)
    }
    const materias = result
   
    //console.log(materias)
  
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
            //console.log(dato)
            //console.log(arrayCapo)
           
            comisionesN=''  
            //console.log('P')
         
            arrayCapo.push(dato)
              
            
            
          }
      });
      
      
     
    }

    setTimeout(() => {
         //console.log('fin')
      //console.log(arrayCapo)
   

    //console.log(arrayCapo)
    if(arrayCapo && arrayCapo.length>0){
    
    
     
      arrayCapo.forEach( elemento=>{
        setTimeout(async() =>{
        const result = await resultadoDetallesporComisionesH(elemento.anio,elemento.comisionesN,elemento.sede, elemento.actividad,recursado)
        
      }, 2000)


        setTimeout(()=>{let a = 0},1000)
        //tratarDatos(datos,anio,elemento.actividad, elemento.sede)
     
        //console.log(result)
       
      })
     res.status(201).send({message:'OK'})
        
    
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
        
          if (resu.rowCount>0){
          
              //console.log(ciclo,resu.rows[0].count)    
              return parseInt(resu.rows[0].count)
         
              
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

///traer promocionados AGREGADO NOW
const traerPromocionados=async (id)=>{
  
  
  try {
    const result = await coneccionDB.query(`SELECT promocionados FROM  fce_per.dash_actividad_resultados WHERE id=${id}`)
    return result.rows[0].promocionados
    return 0
  } catch (error) {
    console.log(error)
    return 0  
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
      const promocionados=await traerPromocionados(id)
        aprobadase1+=parseInt(promocionados)
        aprobadase2+=parseInt(promocionados)

      const result = await actualizar_datos(id, aprobadase1, aprobadase2)
      //console.log(result)
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
  //console.log(sqlstr)
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
       //console.log('fin')
    //console.log(arrayCapo)
 

 // console.log(arrayCapo)
  if(arrayCapo && arrayCapo.length>0){
  
  
    //console.log(arrayCapo)
    
    arrayCapo.forEach( elemento=>{
      setTimeout(async() =>{
     
        tratamiento_examenes(elemento.id, elemento.comisiones, elemento.codigosmat, elemento.anio)
    }, 2000)


     // setTimeout(()=>console.log('na'),1000)
      //tratarDatos(datos,anio,elemento.actividad, elemento.sede)
   
      //console.log(result)
      
    })
  
    
 
} else{
  console.log('nada')
}
}, 2000);
res.send({message:'OK'}) 
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
      //let r_promo = element.relacion_promocion
      let aproe1 = element.aprobadase1 
      let aproe2 = element.aprobadase2

    let relae1=(aproe1/totai).toFixed(2)
    let relae2=(aproe2/totai).toFixed(2)
    let indiceC1= parseFloat(r_regu) * 0.7 + (parseFloat(relae1)) * 0.3
    let indiceC2= parseFloat(r_regu) * 0.7 + (parseFloat(relae2)) * 0.3
    await grabarDatosIndice(element.id, relae1,relae2,indiceC1.toFixed(3),indiceC2.toFixed(3))
    })
  }

  } catch (error) {
    console.log(error)
  }
  res.send({message:'Ok'})
} 



/// tratamiento para  reportes varios

////
//cantidad de materias aprobadas por alumno en un año
//
const alumnost =async(anio,sede,propuesta)=>{

  let ubi='1'
  if (sede===0){
    ubi='1,2'
  }
    
  const sqlstr = `
           SELECT count(sa.alumno) as canti
        FROM negocio.sga_propuestas_aspira spa
        INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
        WHERE anio_academico = $1
          AND sa.ubicacion IN (1,2,4)
          AND spa.propuesta = $2
          AND spa.tipo_ingreso <> 6
          AND situacion_asp IN (1, 2)
          AND sa.legajo IS NOT NULL
 `;

  try {
      const resu = await coneccionDB.query(sqlstr, [anio, propuesta]);
      //console.log(resu)
      return resu.rows[0].canti

  } catch (error) {
      console.error('Error en la consulta:', error);
      return ({ message: 'Ocurrió un error en el servidor.' });
  }
}
//////

const tratarQry=(alumnos)=>{

  let tabla=[]
  let datos={
      cero:0,
      una:alumnos.filter(alumno => alumno.total_aprobadas==='1').length,
      dos:alumnos.filter(alumno => alumno.total_aprobadas==='2').length,
      tres:alumnos.filter(alumno => alumno.total_aprobadas==='3').length,
      cuatro:alumnos.filter(alumno => alumno.total_aprobadas==='4').length,
      cinco:alumnos.filter(alumno => alumno.total_aprobadas==='5').length,
      seis:alumnos.filter(alumno => alumno.total_aprobadas==='6').length,
      siete:alumnos.filter(alumno => alumno.total_aprobadas==='7').length,
      ocho:alumnos.filter(alumno => alumno.total_aprobadas==='8').length,
      nueve:alumnos.filter(alumno => parseInt(alumno.total_aprobadas)>8).length,

  }
  tabla.push(datos)
  return tabla
}

////
const convertirMatriz=(datola, datole, datocpn,datollo, datolaAnt, datoleAnt, datocpnAnt,datolloAnt)=>{
  const matriz=[] 
  matriz.push(datolloAnt)
  matriz.push(datocpnAnt)
  matriz.push(datolaAnt)
  matriz.push(datoleAnt)
  matriz.push(datollo)
  matriz.push(datocpn)
  matriz.push(datola)
  matriz.push(datole)
 

 return matriz
}

const cargarDatos = async(anio,sede,propuesta,fecha)=>{
  let ubi='1'
  if (sede===0){
    ubi='1,2'
  }
  let wherefecha=''
  
  if(fecha!=='0'){
    wherefecha='and vha.fecha <= $3'
  
  }
  const sqlstr = `
  SELECT alumno, COUNT(alumno) AS total_aprobadas
  FROM negocio.vw_hist_academica vha
  WHERE origen IN ('E', 'P')
    AND resultado = 'A'
    AND alumno IN (
        SELECT sa.alumno
        FROM negocio.sga_propuestas_aspira spa
        INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
        WHERE anio_academico = $1
          AND sa.ubicacion in (1,2,4)
          AND spa.propuesta = $2
          AND spa.tipo_ingreso <> 6
          AND situacion_asp IN (1, 2)
          AND sa.legajo IS NOT NULL
    )
    AND anio_academico = $1 ${wherefecha}
  GROUP BY alumno;
`;

let resu=null
try {

  // Ejecutar la consulta con parámetros
  if (fecha !== '0'){
    
    resu = await coneccionDB.query(sqlstr, [anio, propuesta,fecha]);
   
  }else{
    resu = await coneccionDB.query(sqlstr, [anio, propuesta]);
  }
      // Verificar si hay resultados y enviar la respuesta
      if (resu.rows.length === 0) {
        return 'No se encontraron registros'
      } else if (resu.rowCount>0) {
          let carrera=''
          let alumnostmatap= resu.rowCount
          let alumnostI = parseInt( await alumnost(anio,sede,propuesta))
          let alucero=alumnostI-alumnostmatap
          //console.log(alucero,alumnostmatap,alumnostI)
          const tablavalores = tratarQry(resu.rows)
          tablavalores[0].cero=alucero
          tablavalores[0].anio=anio
          tablavalores[0].sede=sede
          tablavalores[0].totali=alumnostI
          if(propuesta===2){
            carrera='LA'
          }else if (propuesta===3){
            carrera='LE'
          }else if(propuesta===7){
            carrera='LLO'
          }else if(propuesta===8){
            carrera='CP'
          }
          tablavalores[0].propuesta=carrera
            //  console.log(tablavalores)
          return tablavalores

          
      }
  } catch (error) {
      console.error('Error en la consulta:', error);
     return 'Ocurrió un error en el servidor.';
  }


}

////


export const generarReporteAprobadasAnioUno =async (req, res)=>{

  const {anio, sede, fecha} = req.params
  let fechaA='0'
  let fechaAP='0'

  if (fecha !== '0'){
    fechaA=fecha
    fechaAP = fechaA.replace(anio, anio-1);
    //console.log(fechaA, fechaAP)
  }

  try {

  
  if (parseInt(sede)===0){
    //console.log('hola')
    const [datola, datole, datocpn, datollo, datolaAnt, datoleAnt, datocpnAnt, datolloAnt] = await Promise.all([
      cargarDatos(anio, sede, 2,fechaA),
      cargarDatos(anio, sede, 3,fechaA),
      cargarDatos(anio, sede, 7, fechaA),
      cargarDatos(anio, sede, 8, fechaA),
      cargarDatos(anio-1, sede, 2, fechaAP),
      cargarDatos(anio-1, sede, 3, fechaAP),
      cargarDatos(anio-1, sede, 7, fechaAP),
      cargarDatos(anio-1, sede, 8, fechaAP),
    ]);

    //console.log(datola)
    const matriz= convertirMatriz(datola[0], datole[0], datocpn[0],datollo[0], datolaAnt[0], datoleAnt[0], datocpnAnt[0],datolloAnt[0])
    if (matriz[0]==='N'){
      res.send([])
    }else{
    res.send(matriz)
    }
  }
  }catch(error){
    console.error('Error en la consulta:', error);
    res.status(500).send({ message: 'Ocurrió un error en el servidor.' });
  }


}



///// generar reporte discriminacion por actividad primer año o cualquier año


//traer numero de ingresantes anio propuestas CP, LA, LE y LLO sedes mza,sr y este


const obtenerAniocursadaactividad = async(propuesta, actividad)=>{

let  sqlstr=`select anio_de_cursada from negocio.sga_elementos_plan sep
inner join negocio.sga_planes_versiones spv on spv.plan_version = sep.plan_version 
inner join negocio.sga_planes sp on sp.plan=spv.plan
where spv.estado='V'  and propuesta=$1 and sep.nombre =$2`

try {
  const resu = await coneccionDB.query(sqlstr, [propuesta, actividad]);
  //console.log(resu.rows)
  return resu.rows

} catch (error) {
  console.error('Error en la consulta:', error);
  return ({ message: 'Ocurrió un error en el servidor.' });
}


}

const obtenerIngresantesCarreraSede = async (anio, propuesta)=>{

  

  const sqlstr =`select count(*) as total
            FROM negocio.sga_propuestas_aspira spa
            INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
            WHERE anio_academico = $1
              AND sa.ubicacion in (1,2,4)
              AND spa.tipo_ingreso in (1,3)
              AND situacion_asp IN (1, 2)
              AND sa.legajo IS NOT null
              and sa.propuesta in ($2)
              `


  try {
    const resu = await coneccionDB.query(sqlstr, [anio, propuesta]);
    //console.log(resu.rows)
    return resu.rows

} catch (error) {
    console.error('Error en la consulta:', error);
    return ({ message: 'Ocurrió un error en el servidor.' });
}



}

// Calcular cantidad de regulares por año, carrera

const obtenerCantidadregularesPropuesta = async ()=>{


    const sqlstr=`select actividad_nombre, resultado, COUNT(actividad_nombre) AS cantidad from negocio.vw_regularidades vr
           WHERE alumno IN (
            SELECT sa.alumno
            FROM negocio.sga_propuestas_aspira spa
            INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
            WHERE anio_academico = $1
              AND sa.ubicacion in ($2)
              AND spa.propuesta = $3
              AND spa.tipo_ingreso <> 6
              AND situacion_asp IN (1, 2)
              AND sa.legajo IS NOT NULL
        ) 
        AND anio_academico = $1 and origen='R' and estado='A' and resultado ='A' and fecha <='$4'
        GROUP BY actividad_nombre, resultado`


        try {
          const resu = await coneccionDB.query(sqlstr, [anio, ubicacion, propuesta, fecha]);
          //console.log(resu)
          return resu.rows
      
      } catch (error) {
          console.error('Error en la consulta:', error);
          return ({ message: 'Ocurrió un error en el servidor.' });
      }
            



}




const obtenerCantidadregularesPropuestaActividad = async (anio,propuesta,codmat, fecha)=>{

  //console.log(anio,propuesta,codmat,fecha)
  let wherefecha = '';
  const params = [anio, propuesta,codmat];
  
  if (fecha !== '0') {
      wherefecha = 'AND vr.fecha <= $4';
      params.push(fecha);
  }
  

  const sqlstr=` select COUNT(*) AS cantidad from negocio.vw_regularidades vr
			WHERE alumno IN (
            SELECT sa.alumno
            FROM negocio.sga_propuestas_aspira spa
            INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
            WHERE anio_academico = $1
              AND sa.ubicacion in (1,2,4)
              AND spa.propuesta = $2
              AND spa.tipo_ingreso <> 6
              AND situacion_asp IN (1, 2)
              AND sa.legajo IS NOT NULL
        ) 
        AND anio_academico = $1  and estado='A' and resultado ='A' and actividad_codigo=$3  ${wherefecha}`


        try {
          // Configurar search_path y ejecutar consulta en una transacción
          await coneccionDB.query('SET search_path TO negocio');
          const result = await coneccionDB.query(sqlstr, params);
          return result.rows;
      } catch (error) {
          console.error('Error en obtenerAprobadasPropuestas:', error);
          return []; // Retornar array vacío para mantener la estructura
      }



}





////calcular datos Materias año

//obtener cantidad de aprobadas por anio, carrera, sede
const obtenerAprobadasPropuestas = async (anio, propuesta, fecha) => {
  let wherefecha = '';
  const params = [anio, propuesta];
  
  if (fecha !== '0') {
      wherefecha = 'AND vha.fecha <= $3';
      params.push(fecha);
  }

  const sqlstr = `
      SELECT actividad_codigo, actividad_nombre, COUNT(actividad_nombre) AS cantidad
      FROM negocio.vw_hist_academica vha
      WHERE alumno IN (
          SELECT sa.alumno
          FROM negocio.sga_propuestas_aspira spa
          INNER JOIN negocio.sga_alumnos sa 
              ON sa.persona = spa.persona 
              AND sa.propuesta = spa.propuesta
          WHERE anio_academico = $1
              AND sa.ubicacion IN (1, 2, 4)
              AND spa.propuesta = $2
              AND spa.tipo_ingreso <> 6
              AND situacion_asp IN (1, 2)
              AND sa.legajo IS NOT NULL
      ) 
      AND anio_academico = $1 
      AND resultado = 'A' 
      ${wherefecha}
      GROUP BY actividad_codigo, actividad_nombre
  `;

  try {
      // Configurar search_path y ejecutar consulta en una transacción
      await coneccionDB.query('SET search_path TO negocio');
      const result = await coneccionDB.query(sqlstr, params);
      return result.rows;
  } catch (error) {
      console.error('Error en obtenerAprobadasPropuestas:', error);
      return []; // Retornar array vacío para mantener la estructura
  }
};

const obtenerDatosReporte = async (anio, fecha) => {
  try {
      const propuestas = [2, 3, 8];
      const promesas = propuestas.map(propuesta => 
          obtenerAprobadasPropuestas(anio, propuesta, fecha)
      );

      const resultados = await Promise.all(promesas);

      return resultados.flatMap((datos, index) => 
          datos.map(row => ({
              anio: anio,
              fechaR:fecha,
              propuesta: propuestas[index],
              codigomat: row.actividad_codigo,
              nombremat: row.actividad_nombre,
              aprobadas: row.cantidad,
              relap:0.00,
              regulares:0,
              relreg:0.00,
              libres:0,
              rellibres:0.00,
              totalI:0,
              aniocursada:0
          }))
      );
      
  } catch (error) {
      console.error('Error en obtenerDatosReporte:', error);
      return [];
  }
};

export const traerReporteActividades = async (req, res) => {
  try {
      const { anio, fecha } = req.params;
      
      const anioNumerico = parseInt(anio, 10);
      let fechaRA='0'
      let fechaRAA='0'
      if (fecha==='0'){
          fechaRAA='0'
          fechaRA='0'
      }else{
      
      let partes = fecha.split('-');
      let nuevoAnio = parseInt(partes[0]) - 1;
      fechaRAA =  `${nuevoAnio}-${partes[1]}-${partes[2]}`;
      fechaRA=fecha
    }
     
      //console.log(fechaRA, fechaRAA)
      if (isNaN(anioNumerico)) {
          return res.status(400).json({ error: 'Año inválido' });
      }

      const [datoanioA, datoanio] = await Promise.all([
          obtenerDatosReporte(anioNumerico - 1, fechaRAA),
          obtenerDatosReporte(anioNumerico, fechaRA)
      ]);
      let datosCombinados = [...datoanioA, ...datoanio] 
      //console.log(datosCombinados)
      const datosActualizados = await Promise.all(
        datosCombinados.map(async (element) => {
            const regulares = await obtenerCantidadregularesPropuestaActividad(
                element.anio,
                element.propuesta,
                element.codigomat,
                element.fechaR
            );
            const totalIng = await obtenerIngresantesCarreraSede(element.anio, element.propuesta);
            const anicur = await obtenerAniocursadaactividad(element.propuesta, element.nombremat)
            return {
                ...element,
                regulares: regulares[0].cantidad - element.aprobadas <0 ? 0 :regulares[0].cantidad - element.aprobadas,
                totalI:totalIng[0].total,
                aniocursada:anicur[0].anio_de_cursada
                
                
            };
        })
    );
    

    datosActualizados.map((element)=>{
      element.libres=parseInt(element.totalI) - (parseInt(element.aprobadas) + element.regulares)
      element.relap= (parseInt(element.aprobadas) / parseInt(element.totalI)).toFixed(3)
      element.relreg= (parseInt(element.regulares) / parseInt(element.totalI)).toFixed(3)
      element.rellibres= ((parseInt(element.totalI) - (parseInt(element.aprobadas) + element.regulares)) / parseInt(element.totalI)).toFixed(3)
    })

    if (!Array.isArray(datosActualizados)) {
      console.error("datosActualizados no es un array, convirtiendo a array vacío.");
      datosActualizados = [];
  }

    res.send(datosActualizados)
    
      
  } catch (error) {
      console.error('Error en traerReporteActividades:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};


///reporte de alumnos con x mat aprobadas




//materias aprobas por alumno
const obtenerAprobadasAlumnosMaterias = async (anio, propuesta) => {
  
  const params = [anio, propuesta];
  
  

  const sqlstr = `SELECT alumno, COUNT(alumno) AS total_aprobadas
    FROM negocio.vw_hist_academica vha
    WHERE origen IN ('E', 'P')
      AND resultado = 'A'
      AND alumno IN (
          SELECT sa.alumno
          FROM negocio.sga_propuestas_aspira spa
          INNER JOIN negocio.sga_alumnos sa ON sa.persona = spa.persona AND sa.propuesta = spa.propuesta
          WHERE anio_academico = $1
            AND sa.ubicacion in(1,2)
            AND spa.propuesta = $2
            AND spa.tipo_ingreso <> 6
            AND situacion_asp IN (1, 2)
            AND sa.legajo IS NOT NULL
      )
      AND anio_academico = $1
    GROUP BY alumno
   
  `;

  try {
      // Configurar search_path y ejecutar consulta en una transacción
      await coneccionDB.query('SET search_path TO negocio');
      const result = await coneccionDB.query(sqlstr, params);
      return result.rows;
  } catch (error) {
      console.error('Error en obtenerAprobadasMateriasAlumnos:', error);
      return []; // Retornar array vacío para mantener la estructura
  }
};

//entrada t

export const obtenerDatosreporteAlumnosMat=async (req,res)=>{

  const {anio, matap}=req.params
  const propuestas = [2, 3, 8];
  const promesas = propuestas.map(propuesta => 
    obtenerAprobadasAlumnosMaterias(anio, propuesta)
  );

  const resultados = await Promise.all(promesas);

  const arrayplano = resultados.flatMap((datos, index) => 
    datos.map(row => ({
        anio: anio,
        propuesta: propuestas[index],
        alumno: row.alumno,
        aprobadas: row.total_aprobadas,
        legajo:'',
        apellido:'',
        nombres:''
    }))
);
  //console.log(arrayplano)
  try {
    res.send(arrayplano.filter(element=>parseInt(element.aprobadas) > 8))
  } catch (error) {
    console.error('Error en traerReporteActividades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


//reporte alumnos coeficientes de t carrera


export const reportAlumnosCoeficienteOptimo= async (req,res)=>{

  const {anio, propuestas, matap}=req.params
 //console.log(propuestas)
  const sqlstr=`select legajo,ai.nro_documento ,ai.apellido ,nombres,ubicacion,propuesta,ai.promedioca ,ai.promediosa, aprobadas, 
  reprobadas, ai.coef_tcarrera  from fce_per.alumnos_info ai where ai.anio_ingreso_fac =${anio}  and ai.propuesta in 
  (${propuestas}) and ai.aprobadas >=${matap} 
`
//console.log(sqlstr) 
try {
  const result = await coneccionDB.query(sqlstr);
      res.send(result.rows);
  } catch (error) {
      console.error('Error en obtenerAlumnos:', error);
      return []; // Retornar array vacío para mantener la estructura

}
}

/////



////
const traerresultadocomision = async (comision) => {
  let sqlstr = `
      SELECT sc.comision, sc.nombre, sp.nombre AS periodo, sa.origen, sa.tipo_acta, sad.resultado, COUNT(sad.resultado) AS count 
      FROM negocio.sga_actas_detalle sad
      INNER JOIN negocio.sga_actas sa ON sa.id_acta = sad.id_acta
      INNER JOIN negocio.sga_comisiones sc ON sc.comision = sa.comision 
      INNER JOIN negocio.sga_periodos_lectivos spl ON spl.periodo_lectivo = sc.periodo_lectivo 
      INNER JOIN negocio.sga_periodos sp ON sp.periodo = spl.periodo 
      WHERE sad.rectificado = 'N' AND sa.estado = 'C' AND sa.origen IN ('P', 'R') 
      AND sc.comision = ${comision}
      GROUP BY sc.comision, sc.nombre, sp.nombre, sa.origen, sa.tipo_acta, sad.resultado
  `;

  try {
      const result = await coneccionDB.query(sqlstr);
      return result.rows;
  } catch (error) {
      console.error('Error en obtener resultados de comisiones:', error);
      return []; // Retornar array vacío para evitar errores en procesamiento
  }
};



/////esta es la papa de las comisiones 

const tratarComisiones = async (comisiones,anio, sede) => {
  const resultadocomisiones = [];
  
  for (const element of comisiones) {
      let resultados = await traerresultadocomision(element.comision);
      //console.log(resultados)
      // Inicializar objeto de datos
      let dato = {
          anio:anio,
          sede:sede==='1'?'MZA':sede==='2'?'SRF':sede==='3'?'GALV':sede==='4'?'ESTE':'',
          comision: element.comision,
          codmat: element.codmat,
          actividad: await traerNombreActividad(element.codmat),
          propuesta: await traerNombrePropuesta(element.codmat),
          nombre: element.nombre,
          periodo: resultados.length > 0 ? resultados[0].periodo : '',
          regulares: 0,
          reprobados: 0,
          ausentes: 0,
          promocionados: 0,
          total: 0,
          aprobadose1: await traerExamenAprobadosComision(anio, element.comision, element.codmat, 1) || 0,
          aprobadose2: await traerExamenAprobadosComision(anio, element.comision, element.codmat, 2) || 0,
          contacto:await traercontacto(element.comision)
      };

      //console.log(resultados)
      // Procesar los resultados obtenidos de la base de datos
      resultados.forEach(resultado => {
          if (resultado.origen === 'R') {
              if (resultado.resultado === 'A') {
                  dato.regulares += parseInt(resultado.count);
              } else if (resultado.resultado === 'R') {
                  dato.reprobados += parseInt(resultado.count);
              } else if (resultado.resultado === 'U') {
                  dato.ausentes += parseInt(resultado.count);
              }
          } else if (resultado.origen === 'P' && resultado.resultado === 'A') {
              dato.promocionados += parseInt(resultado.count);
          }
      });

      // Calcular total
      dato.total = parseInt(dato.regulares) + parseInt(dato.reprobados) + parseInt(dato.ausentes);
      if(dato.total>0){
        dato.relreg=parseFloat((dato.regulares/dato.total).toFixed(2))
        dato.relpro=parseFloat((dato.promocionados/dato.total).toFixed(2))
        dato.relape1=parseFloat((dato.aprobadose1/dato.total).toFixed(2))
        dato.relape2=parseFloat((dato.aprobadose2/dato.total).toFixed(2))
        dato.indicec=parseFloat((dato.relreg * 0.7 + dato.relpro * 0.3).toFixed(2))
        dato.indicee1=parseFloat((dato.relreg * 0.7 + (dato.relpro + dato.relape1 ) * 0.3).toFixed(2))
        dato.indicee2=parseFloat((dato.relreg * 0.7 + (dato.relpro + dato.relape2)* 0.3).toFixed(2))
        dato.regulares-=parseInt(dato.promocionados)
        dato.aprobadose1+=parseInt(dato.promocionados)
        dato.aprobadose2+=parseInt(dato.promocionados)
      resultadocomisiones.push(dato);
      }
    }
  //console.log(resultadocomisiones)

  return resultadocomisiones;
};



/// materia
const traerNombreActividad=async (codigomat)=>{

  let sqlstr=`select distinct nombre from negocio.sga_elementos se where codigo=$1`

  try {
    const result = await coneccionDB.query(sqlstr,[codigomat]);
      return result.rows[0].nombre;
  } catch (error) {
    console.log(error)
  }
}

// propuesta
const traerNombrePropuesta=async (codigomat)=>{

  let sqlstr=` select distinct sp2.nombre  from negocio.sga_elementos_plan sep
	 inner join negocio.sga_planes_versiones spv on spv.plan_version = sep.plan_version
	 inner join negocio.sga_planes sp on sp.plan=spv.plan
	 inner join negocio.sga_propuestas sp2 on sp2.propuesta = sp.propuesta
	 inner join negocio.sga_elementos_revision ser on ser.elemento_revision = sep.elemento_revision
	 inner join negocio.sga_elementos se on se.elemento=ser.elemento
	 where se.codigo =$1 and spv.estado in ('A','V') and not spv.plan=1`

  try {
    const result = await coneccionDB.query(sqlstr,[codigomat]);
    if (result.rowCount === 1) {
      return result.rows[0].nombre;
  } else if (result.rowCount > 1) {
      // Unir los nombres en un solo string separados por comas
      return result.rows.map(row => row.nombre).join(', ');
  } else {
      return 'Sin datos';
  }
  } catch (error) {
    console.log(error)
  }
}


const traercontacto=async (comision)=>{

  let  sqlstr=`select distinct concat (concat(mp.nombres,' ', mp.apellido),'(', mpc.email,')') as contacto from negocio.sga_comisiones com
inner join negocio.sga_docentes_comision sdc on sdc.comision = com.comision
inner join negocio.sga_docentes sd on sd.docente=sdc.docente
inner join negocio.sga_docentes_resp sdr on sdr.docente=sd.docente
inner join negocio.mdp_personas mp on mp.persona=sd.persona
inner join negocio.mdp_personas_contactos mpc on mpc.persona=mp.persona
where mpc.contacto_tipo ='MP' and sdr.responsabilidad  in (1,2,3,5,7,101) and com.comision =$1
order by contacto`

try {
  const result = await coneccionDB.query(sqlstr,[comision]);
  console.log(comision,result.rows)
  if (result.rowCount === 1) {
    return result.rows[0].contacto;
} else if (result.rowCount > 1) {
    // Unir los nombres en un solo string separados por comas
    return result.rows.map(row => row.contacto).join(', ');
} else {
    return 'Sin datos';
}
} catch (error) {
  console.log(error)
}


}

//indices por comisiones 
export const indicescomisionessede = async (req, res) => {
  const { anio, sede } = req.params;
  
  let codsede = '';

  if (sede === '1') {
    codsede = 'M0';
  } else if (sede === '2') {
    codsede = 'S0';
  } else if (sede === '3') {
    codsede = 'GA';
  } else if (sede === '4') {
    codsede = 'SM';
  }

  let strQry = `
    SELECT DISTINCT sc.comision, se.codigo AS codmat, sc.nombre, sc.elemento  
    FROM negocio.sga_comisiones sc 
    INNER JOIN negocio.sga_elementos se ON se.elemento = sc.elemento 
    INNER JOIN negocio.sga_periodos_lectivos spl ON spl.periodo_lectivo = sc.periodo_lectivo
    INNER JOIN negocio.sga_periodos sp ON sp.periodo = spl.periodo
    INNER JOIN negocio.sga_periodos_genericos spgt ON spgt.periodo_generico = sp.periodo_generico 
    WHERE sp.anio_academico = $1 AND LEFT(sc.nombre, 2) = $2 AND NOT sc.nombre LIKE '%V%' 
    ORDER BY comision
  `;

  try {
    const result = await coneccionDB.query(strQry, [anio, codsede]);

    // 🔴 IMPORTANTE: Usamos `await` para esperar la ejecución de tratarComisiones()
    const resultadocomi = await tratarComisiones(result.rows, anio,sede);

    res.send(resultadocomi);
  } catch (error) {
    console.error('Error en obtenerAlumnos:', error);
    res.status(500).send({ error: "Error en la consulta de comisiones" });
  }
};




//////
///////
////seccion info alumnos


/////borrado de tablas indices


export const deleteTablesIndices =async(req, res)=>{

  try {
    const resu1 = await coneccionDB.query('TRUNCATE fce_per.dash_actividad_resultados')
    const resu2 = await coneccionDB.query('TRUNCATE fce_per.dash_indices_total')
    console.log(resu1)
    console.log(resu2)
    res.send({message:'ok'})

  } catch (error) {
    console.log(error)
  }
}
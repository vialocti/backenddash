
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
  const {actividad, anio, codsede,total,regulares,reprobados,ausentes,promocionados,indiceReg, indiceProm,indiceAct} = registro
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
  let sqlI = "INSERT INTO fce_per.dash_actividad_resultados (anio_academico,sede,actividad_nombre,total_inscriptos,regulares,reprobados,ausentes,promocionados,relacion_regular,relacion_promocion,indice_cursada) values("
  sqlI=sqlI + anio + "," + sede +",'" + actividad + "'," + total + "," + regulares + "," + reprobados + "," + ausentes + "," + promocionados + "," + indiceReg + ", " + indiceProm + "," + indiceAct + ")"
  //console.log(sqlI)
   const result = await coneccionDB.query(sqlI)
   
  console.log(result.rowCount)
  }catch(error){
    
    console.log(error)
  }


}


const tratarDatos=(detalleComisiones,anio,actividad,codsede)=>{
  console.log(anio,actividad)
  //console.log(datos)
  
  
  let cantiRegular = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.regular)}, 0)
  let cantiReprobado = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.reprobado)}, 0)
  let cantiAusente = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.ausente)}, 0)
  let cantiPromo = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.promocionado)}, 0)
  let cantiTotal = detalleComisiones.reduce((total,valorActual)=>{return total + parseInt(valorActual.total)}, 0)
  let indicereg= cantiRegular/cantiTotal 
  let indicepro=cantiPromo/cantiTotal
  let indiceT=indicereg * 0.7 + indicepro * 0.3
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
  indiceAct:indiceT.toFixed(2)
}
if(cantiTotal>0){
const result= grabarRegistro(registro)
}
//return true
}


const resultadoDetallesporComisiones = async (anio,ncomisiones,codsede,actividad) => {

  

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
      //console.log(resu)
     const datos = await convertirDatos (ncomisiones, resu.rows)
     setTimeout(()=>{
      //console.log(datos)
      tratarDatos(datos,anio,actividad,codsede)
    },2000) 
     
      
     //res.send(datos)
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
     //console.log(sqlstr)
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





//import {getListMateriasComision,getComisionesAnioMateria,resultadoActaDetallesporComisiones} from './cursadasControllers.js'

export const grabardatosCursadas =async (req,res)=>{

    const {anio,sede}=req.params
    const arrayCapo=[]
    let comisionesN=''
    const result = await getListMateriasComision(anio)
    const materias = result
    

    
    materias.forEach(async element => {
        //console.log(element.nombre)
        
        const comisiones = await getNrocomisionesMateria(anio,element.nombre)
        
        //console.log(comisiones)
       
        if(comisiones){
          
            for (const elemento of comisiones) {
              //console.log(elemento);
              comisionesN += elemento.comision + ",";
            }
            comisionesN = comisionesN.substring(0, comisionesN.length - 1);
            //console.log(comisionesN)
            
           
          
          //const datos = await resultadoDetallesporComisiones(anio,comisionesN,'S0')
          //console.log(datos)
        }
        let dato={
              actividad:element.nombre,
              anio,
              sede:sede==='1'?'M0':sede==='2'?'S0':sede==='3'?'GA':'SM',
              comisionesN
            }
            comisionesN=''  
            //console.log(dato)
            arrayCapo.push(dato)

    });
    

    setTimeout(()=>{
      
      arrayCapo.forEach(async elemento=>{
        const result = await resultadoDetallesporComisiones(elemento.anio,elemento.comisionesN,elemento.sede,elemento.actividad)
        
        setTimeout(()=>console.log('na'),2000)
        //tratarDatos(datos,anio,elemento.actividad, elemento.sede)
        console.log('-----')
        //console.log()
        
      })
    
    }
      
      ,2000)
}
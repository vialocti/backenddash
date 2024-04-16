
import coneccionDB from '../../database.js'


export const traerInscriptosSedeAnio = async (anio, sede) => {

    


    let sqlstr = `select sc.ubicacion,se.nombre, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and not sc.nombre like'V%'
    
    group by sc.ubicacion, se.nombre
    order by se.nombre  

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        // console.log(resu.rowCount)
        return resu.rows
    } catch (error) {
        console.log(error)
    }

}



export const traerCantidadporActividad = async (anioc,sede,actividad)  =>{

    
    //console.log(anioc,sede,actividad)

    let sqlstr = `select sc.ubicacion,se.nombre, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anioc} and sc.ubicacion=${sede} and se.nombre='${actividad}' and  not sc.nombre like'V%'
    
    group by sc.ubicacion, se.nombre
     

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        //console.log(resu.rows,anioc)
        return resu.rows
    } catch (error) {
        console.log(error)
    }

}

export const traerRechazadosBajaActividad = async (anio,sede,actividad)=>{
    
   //console.log(anio,sede,actividad)

    
    let sqlstr=`select distinct alumno from negocio.sga_insc_cursada_log sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and se.nombre='${actividad}' and  not sc.nombre like'V%' and sic.operacion in ('B','R')
    group by alumno`


    try {


        const resu = await coneccionDB.query(sqlstr)
        //console.log(resu.rowCount)
        return resu.rowCount
    } catch (error) {
        console.log(error)
    }


}   


export const enviarDatos=(datosCompara) =>{
 
    console.log(datosCompara)

}





//////tratamientos de examens comisiones de cursado


//paso one
const buscarIncriptos = async (comision)=>{


    let sqlstr =`select alumno from negocio.sga_insc_cursada sic where comision =${comision}`
    try {


        const resu = await coneccionDB.query(sqlstr)
        // console.log(resu.rowCount)
        return resu.rows
    } catch (error) {
        console.log(error)
    }


}
//paso one I


const traerDatosComision = async (comision)=>{


    let sqlstr =`select sc.comision, sc.nombre,sc.elemento, sc.periodo_lectivo, spl.fecha_inicio_dictado, spl.fecha_fin_dictado from negocio.sga_comisiones sc
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo where comision =${comision}`
    try {


        const resu = await coneccionDB.query(sqlstr)
        // console.log(resu.rowCount)
        return resu.rows
    } catch (error) {
        console.log(error)
    }


}



//rutiina de inicio de proceso
export const tratarExamenes =(datos)=>{
    
    datos.forEach(async element => {
        let alumnosInc =[]
        let datoComision=null
    
        datoComision= await traerDatosComision(element.comision)
        console.log(datoComision)    
        alumnosInc = await  buscarIncriptos(element.comision)        
        console.log(alumnosInc)       
        setTimeout(()=>console.log('-------------------'),200)
    });
}

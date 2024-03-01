
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
    order by sc.ubicacion, se.nombre  

`

    try {


        const resu = await coneccionDB.query(sqlstr)
        return resu.rows
    } catch (error) {
        console.log(error)
    }

}



export const traerCantidadporActividad = async (anioc,sede,actividad)  =>{

    


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
        return resu.rows
    } catch (error) {
        console.log(error)
    }

}

export const enviarDatos=(datosCompara) =>{
 
    console.log(datosCompara)

}

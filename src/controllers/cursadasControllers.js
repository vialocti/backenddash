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
 ////
//cantidad de inscriptos por espacio curricular
export const getActividadCantiInscriptos = async (req, res) => {

    const { anio, sede } = req.params


    let sqlstr = `select sc.ubicacion,se.nombre,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic 
    inner join negocio.sga_comisiones sc on sc.comision=sic.comision
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo
    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico 
    where sp.anio_academico =${anio} and sc.ubicacion=${sede} and not sc.nombre like'V%'
    
    group by sc.ubicacion, se.nombre,sic.comision
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


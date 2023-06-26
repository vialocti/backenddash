import coneccionDB from '../database'
/*
export const nameFuncion = async (req, res) => {

    const {} = req.params
    

    let sqlstr = `select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,count(sc.ubicacion) from negocio.sga_comisiones sc
inner join negocio.sga_elementos se on se.elemento = sc.elemento 
inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo
inner join negocio.sga_periodos sp on sp.periodo=spl.periodo 
 
where sp.anio_academico =2023 and not sc.nombre like'V%' 
group by sc.ubicacion
order by sc.ubicacion
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}
*/




export const getListComisionesAnio = async (req, res) => {

    const { anio } = req.params


    let sqlstr = `select sc.comision,sc.periodo_lectivo,sp.nombre ,sc.ubicacion,sc.nombre,sc.elemento,se.codigo,se.nombre,sc.estado  from negocio.sga_comisiones sc
    inner join negocio.sga_elementos se on se.elemento = sc.elemento 
    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo
    inner join negocio.sga_periodos sp on sp.periodo=spl.periodo 
     where sp.anio_academico =${anio} and not sc.nombre like'V%' order by sc.ubicacion,sc.periodo_lectivo `

    try {
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}


//
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


//
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
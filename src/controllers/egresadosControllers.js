import coneccionDB from '../database'

export const getEgresadoSedeCarreraAnio = async (req, res) => {

    const { anio, lapso } = req.params
    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (lapso === 'C') {

        fecha_i = `${anio}-01-01`
        fecha_f = `${aniot}-01-01`

    } else if (lapso === 'L') {

        fecha_i = `${anio}-04-01`
        fecha_f = `${aniot}-04-01`

    }


    let sql_1 = `select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,
     CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,
    count(sa.propuesta) as canti,avg(promedio) as pro,avg(promedio_sin_aplazos) as prosa  from negocio.sga_certificados_otorg sco `
    let sql_I = " inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno"
    let sql_w = ` where sco.fecha_egreso >='${fecha_i}' and sco.fecha_egreso <'${fecha_f}'`
    let sql_g = " group by sa.ubicacion ,sa.propuesta order by sa.ubicacion,sa.propuesta"


    try {
        let sql = `${sql_1} ${sql_I} ${sql_w} ${sql_g}`
        //console.log(sql)
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}

export const getListadoEgreSedeCarreraAnio = async (req, res) => {

    const { anio, lapso, sede, car } = req.params
    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (lapso === 'C') {

        fecha_i = `${anio}-01-01`
        fecha_f = `${aniot}-01-01`

    } else if (lapso === 'L') {

        fecha_i = `${anio}-04-01`
        fecha_f = `${aniot}-04-01`

    }


    let sql = `select sa.legajo,mp.apellido,mp.nombres, CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,
    sco.fecha_egreso, CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,sco.promedio, sco.promedio_sin_aplazos 
    from negocio.sga_certificados_otorg sco
    inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno
    inner join negocio.mdp_personas mp on mp.persona=sco.persona 
    where sa.ubicacion=${sede} and sa.propuesta=${car} and sco.fecha_egreso >='${fecha_i}' and sco.fecha_egreso <'${fecha_f}' `





    try {
        //  let sql = `${sql_1} ${sql_I} ${sql_w} ${sql_g}`
        // console.log(sql)
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {

    }

}


export const getCantidadEgreSedeCarreraAnio = async (req, res) => {

    const { anio, lapso, sede } = req.params
    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (lapso === 'C') {

        fecha_i = `${anio}-01-01`
        fecha_f = `${aniot}-01-01`

    } else if (lapso === 'L') {

        fecha_i = `${anio}-04-01`
        fecha_f = `${aniot}-04-01`

    }


    let sql = `select CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera, 
    count(sa.propuesta) from negocio.sga_certificados_otorg sco
    inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno
    inner join negocio.mdp_personas mp on mp.persona=sco.persona 
    where sa.ubicacion=${sede} and sco.fecha_egreso >='${fecha_i}' and sco.fecha_egreso <'${fecha_f}' 
    group by sa.propuesta
    `





    try {
        //  let sql = `${sql_1} ${sql_I} ${sql_w} ${sql_g}`
        // console.log(sql)
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//cantidad por sedes
export const getCantidadEgreSedesAnio = async (req, res) => {

    const { anio, lapso } = req.params
    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (lapso === 'C') {

        fecha_i = `${anio}-01-01`
        fecha_f = `${aniot}-01-01`

    } else if (lapso === 'L') {

        fecha_i = `${anio}-04-01`
        fecha_f = `${aniot}-04-01`

    }



    let sql = `select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,
    count(sa.ubicacion)
        from negocio.sga_certificados_otorg sco
        inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno
        inner join negocio.mdp_personas mp on mp.persona=sco.persona 
        where sco.fecha_egreso >='${fecha_i}' and sco.fecha_egreso <'${fecha_f}' 
        group by sa.ubicacion
    `

    try {
        //  let sql = `${sql_1} ${sql_I} ${sql_w} ${sql_g}`
        // console.log(sql)
        const resu = await coneccionDB.query(sql)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}


export const getEgresadosPromedios = async (req, res) => {

    const { anio, car, lapso } = req.params

    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (lapso === 'C') {

        fecha_i = `${anio}-01-01`
        fecha_f = `${aniot}-01-01`

    } else if (lapso === 'L') {

        fecha_i = `${anio}-04-01`
        fecha_f = `${aniot}-04-01`

    }



    let sql = `select alu.legajo,concat(per.apellido,', ',per.nombres) as nameC,cer.persona,alu.alumno,certificado,promedio,promedio_sin_aplazos,fecha_egreso,
(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)) as anio 
,(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,2)) as aniop
,(fecha_egreso - cast( (concat((select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)),'-04-01')) as DATE))/365.0 as tiempo
 from negocio.sga_certificados_otorg cer 
  inner join negocio.mdp_personas per on per.persona=cer.persona
  inner join negocio.sga_alumnos alu on alu.alumno=cer.alumno
 where fecha_egreso >'${fecha_i}' and fecha_egreso <'${fecha_f}' and certificado=${car}
`
    try {
        const wer = await coneccionDB.query('set search_path=negocio')
        const resp = await coneccionDB.query(sql)
        res.send(resp.rows)
    } catch (error) {
        console.log(error)
    }

}









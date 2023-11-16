import coneccionDB from '../database'


//promedio por carrera anio

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

//listado carrera sede anio
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
    console.log('aaa')
    const { anio, car, lapso, ficola, ffcola } = req.params

    let fecha_i = ''
    let fecha_f = ''
    let aniot = Number(anio) + 1

    if (ficola === '0' && ffcola === '0') {
        if (lapso === 'C') {

            fecha_i = `${anio}-01-01`
            fecha_f = `${aniot}-01-01`

        } else if (lapso === 'L') {

            fecha_i = `${anio}-04-01`
            fecha_f = `${aniot}-04-01`

        }
    } else {
        fecha_i = ficola
        fecha_f = ffcola

    }
    let car_q = ''
    if (car === 'T') {
        car_q = '3,4,5,6,7,8'
    } else {
        car_q = car
    }


    let sql = `select alu.legajo,concat(per.apellido,', ',per.nombres) as nameC,cer.persona,alu.alumno,
    case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta,
    round(promedio,2) as promedio,round(promedio_sin_aplazos,2) as promesa,to_char(fecha_egreso,'dd-mm-yyyy') as fecha_egreso,
    (select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)) as anio 
   ,(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,2)) as aniop
   , round((fecha_egreso - cast( (concat((select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)),'-04-01')) as DATE))/365.0, 2) as tiempo
   from negocio.sga_certificados_otorg cer 
   inner join negocio.mdp_personas per on per.persona=cer.persona
   inner join negocio.sga_alumnos alu on alu.alumno=cer.alumno
  where fecha_egreso >'${fecha_i}' and fecha_egreso <'${fecha_f}' and certificado in (${car_q})
  order by certificado,nameC,fecha_egreso
`
    try {
        const wer = await coneccionDB.query('set search_path=negocio')
        const resp = await coneccionDB.query(sql)
        res.send(resp.rows)
    } catch (error) {
        console.log(error)
    }

}

//devuelve cantidad de egresados discriminados por certificado
const cantidadEgrAnioPropuestas = async (anio, lapso) => {

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
    /*
     let sqlstr = `select case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta, count(certificado)
     from negocio.sga_certificados_otorg where fecha_egreso >='${fecha_i}' and fecha_egreso<='${fecha_f}' group by certificado
     `
 */
    let sqlstr = `select case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta, count(certificado)
    , sexo from negocio.sga_certificados_otorg cert
    inner join negocio.mdp_personas mp on mp.persona=cert.persona
    where fecha_egreso >='${fecha_i}' and fecha_egreso<='${fecha_f}' 
    group by certificado,sexo
    `

    try {
        const resp = await coneccionDB.query(sqlstr)
        return (resp.rows)
    } catch (error) {
        console.log(error)
    }

}


//lectura de egresados entre años por carrera
export const cantidadEresadosaniosPropuesta = async (req, res) => {

    const { anioI, anioF, lapso } = req.params


    const resu = []

    for (let i = Number(anioI); i < Number(anioF) + 1; i++) {

        let datos = {
            anio: 0,
            cpnm: 0,
            lam: 0,
            lem: 0,
            llom: 0,
            lnrgm: 0,
            cpm: 0,
            cpnf: 0,
            laf: 0,
            lef: 0,
            llof: 0,
            lnrgf: 0,
            cpf: 0,
        }

        let resuanio = await cantidadEgrAnioPropuestas(i, lapso)
        //console.log(resuanio)
        //console.log(resuanio.filter(anior => anior.propuesta === 'LLO'))
        //console.log(resuanio.filter(anior => anior.propuesta === 'CPN').length, Number(resuanio.filter(anior => anior.propuesta === 'CPN')[0].count))
        datos.anio = i
        datos.cpnm = resuanio.filter(anior => anior.propuesta === 'CPN' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'CPN' && anior.sexo === 'M')[0].count) : 0
        datos.lam = resuanio.filter(anior => anior.propuesta === 'LA' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LA' && anior.sexo === 'M')[0].count) : 0
        datos.lem = resuanio.filter(anior => anior.propuesta === 'LE' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LE' && anior.sexo === 'M')[0].count) : 0
        datos.lnrgm = resuanio.filter(anior => anior.propuesta === 'LNRG' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LNRG' && anior.sexo === 'M')[0].count) : 0
        datos.llom = resuanio.filter(anior => anior.propuesta === 'LLO' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LLO' && anior.sexo === 'M')[0].count) : 0
        datos.cpm = resuanio.filter(anior => anior.propuesta === 'CP' && anior.sexo === 'M').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'CP' && anior.sexo === 'M')[0].count) : 0

        datos.cpnf = resuanio.filter(anior => anior.propuesta === 'CPN' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'CPN' && anior.sexo === 'F')[0].count) : 0
        datos.laf = resuanio.filter(anior => anior.propuesta === 'LA' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LA' && anior.sexo === 'F')[0].count) : 0
        datos.lef = resuanio.filter(anior => anior.propuesta === 'LE' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LE' && anior.sexo === 'F')[0].count) : 0
        datos.lnrgf = resuanio.filter(anior => anior.propuesta === 'LNRG' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LNRG' && anior.sexo === 'F')[0].count) : 0
        datos.llof = resuanio.filter(anior => anior.propuesta === 'LLO' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'LLO' && anior.sexo === 'F')[0].count) : 0
        datos.cpf = resuanio.filter(anior => anior.propuesta === 'CP' && anior.sexo === 'F').length > 0 ? Number(resuanio.filter(anior => anior.propuesta === 'CP' && anior.sexo === 'F')[0].count) : 0

        resu.push(datos)

    }
    res.send(resu)


}







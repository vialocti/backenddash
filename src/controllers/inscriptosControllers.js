import coneccionDB from "../database";


//inscriptos total anio
export const getInscriptosTotal = async (req, res) => {
    const { anio } = req.params
    const resu = await coneccionDB.query(`SELECT COUNT(*)as catidad FROM negocio.sga_propuestas_aspira where anio_academico=${anio}`)
    res.send(resu.rows[0])
}

// total por año carrera sede
export const getInscriptosPorPropuestaSede = async (req, res) => {
    const { anio, sede, propuesta } = req.params
    const strq = `SELECT COUNT(*)as nro FROM negocio.sga_propuestas_aspira where anio_academico=${anio} AND ubicacion=${sede} AND propuesta=${propuesta}`
    const resu = await coneccionDB.query(strq)
    res.send(resu.rows[0])
}

//total propuesta por año sede y carrera agrupados 

export const getInscriptosTotalSede = async (req, res) => {
    const { anio } = req.params

    const resu = await coneccionDB.query(`SELECT CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede ,
    CASE propuesta WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera
    ,tipo_ingreso ,COUNT(*) as nro FROM negocio.sga_propuestas_aspira where anio_academico=${anio} Group by ubicacion,propuesta,tipo_ingreso order by ubicacion,propuesta`)
    res.send(resu.rows)
}

// total por sede, sexo, tipo inscripcion
export const getIscriptosTipoIngresoSedeSexo = async (req, res) => {
    const { anio, sede, tipoI, sexo } = req.params

    let tipoIngreso = ''
    if (tipoI === '1') {
        tipoIngreso = 'tipo_ingreso in (1,3)'
    } else {
        tipoIngreso = 'tipo_ingreso in (4,6)'
    }

    let cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas '
    let injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona '
    let condi = `WHERE anio_academico=${anio} AND ubicacion=${sede} AND ${tipoIngreso} AND per.sexo='${sexo}'`
    let strquery = `${cabeza}${injoin}${condi}`
    console.log(strquery)
    try {

        const resu = await coneccionDB.query(strquery)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

// total por sede, sexo, tipo inscripcion
export const getIscriptosTipoIngresoSedeSexoCarrera = async (req, res) => {
    const { anio, sede, tipoI, sexo, carrera } = req.params

    let tipoIngreso = ''
    if (tipoI === '1') {
        tipoIngreso = 'tipo_ingreso in (1,3)'
    } else {
        tipoIngreso = 'tipo_ingreso in (4,6)'
    }

    let cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas '
    let injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona '
    let condi = `WHERE anio_academico=${anio} AND ubicacion=${sede} AND ${tipoIngreso} AND per.sexo='${sexo}' and propuesta=${carrera}`
    let strquery = `${cabeza}${injoin}${condi}`
    console.log(strquery)
    try {

        const resu = await coneccionDB.query(strquery)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

} 
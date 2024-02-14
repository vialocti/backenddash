import coneccionDB from '../database.js'

//mesas examen anio
export const getMesasExamen = async (req, res) => {

    const {anio} = req.params
    

    let sqlstr = `select sa.id_acta,sp.periodo, sp.nombre as nper,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion  from negocio.sga_mesas_examen sme 
    inner join  negocio.sga_llamados_mesa slm on slm.mesa_examen=sme.mesa_examen 
    inner join negocio.sga_llamados_turno slt on slt.llamado = slm.llamado
    inner join negocio.sga_actas sa on sa.llamado_mesa = slm.llamado_mesa 
    inner join negocio.sga_turnos_examen ste on ste.turno_examen =slt.turno_examen
    inner join negocio.sga_periodos sp on sp.periodo=ste.periodo
    inner join negocio.sga_elementos se on se.elemento =sme.elemento 
    where sp.anio_academico =${anio} and sa.origen ='E' and sa.estado ='C'
    order by ubicacion, se.nombre
    `

    try {
         const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
     } catch (error) {
        console.log(error)        
      }
        
}

//mesas examenes con total R, A y U
export const getActasExamenTotalResu = async (req, res) => {

    const {anio} = req.params
    

    let sqlstr = `select sa.id_acta,sp.periodo, sp.nombre as nper,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion, sad.resultado, count(sad.resultado)  from negocio.sga_mesas_examen sme 
    inner join  negocio.sga_llamados_mesa slm on slm.mesa_examen=sme.mesa_examen 
    inner join negocio.sga_llamados_turno slt on slt.llamado = slm.llamado
    inner join negocio.sga_actas sa on sa.llamado_mesa = slm.llamado_mesa 
    inner join negocio.sga_actas_detalle sad on sad.id_acta =sa.id_acta 
    inner join negocio.sga_turnos_examen ste on ste.turno_examen =slt.turno_examen
    inner join negocio.sga_periodos sp on sp.periodo=ste.periodo
    inner join negocio.sga_elementos se on se.elemento =sme.elemento 
    where sp.anio_academico =${anio} and sa.origen ='E' and sa.estado ='C'
    group by sa.id_acta,sp.periodo, sp.nombre ,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion, sad.resultado 
    order by se.nombre
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}

//resultados por actas
export const getResultadosPorActa = async (req, res) => {

    const {idacta} = req.params
    

    let sqlstr = `select resultado, count(resultado) from negocio.sga_actas_detalle sad 
    where id_acta =${idacta}
    group by resultado
`

    try {
                
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {
        console.log(error)
    }

}
    


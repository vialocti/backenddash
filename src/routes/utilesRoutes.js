import { Router } from 'express'
import { calculoIndicesTotales, grabardatosCursadas, grabardatosCursadasExamenes } from '../controllers/utilesControllers.js'


const utilesRoutes=Router()
    utilesRoutes.get('/cursadas/:anio/:sede/:recursado', grabardatosCursadas)
    utilesRoutes.get('/examenes/:anio/:sede', grabardatosCursadasExamenes)
    utilesRoutes.get('/indices/:anio/:sede',calculoIndicesTotales )
export default utilesRoutes
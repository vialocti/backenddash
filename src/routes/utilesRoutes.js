import { Router } from 'express'
import { grabardatosCursadas } from '../controllers/utilesControllers.js'


const utilesRoutes=Router()
    utilesRoutes.get('/cursadas/:anio/:sede', grabardatosCursadas)

export default utilesRoutes
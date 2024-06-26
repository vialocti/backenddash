import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import ingresantesRoutes from './routes/ingresantesRoutes.js'
import inscriptosRoutes from './routes/inscriptosRoutes.js'
import egresadosRoutes from './routes/egresadosRoutes.js'
import alumnosRoutes from './routes/alumnosRoutes.js'
import cursadasRoutes from './routes/cursadasRoutes.js'
import examenesRoutes from './routes/examenesRoutes.js'
import rendimientoRoutes from './routes/rendimientoRoutes.js'
import utilesRoutes from './routes/utilesRoutes.js'
//

dotenv.config()
const app = express()

//

app.set('port', process.env.PORT)

//
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

//
app.use('/dbingreso', ingresantesRoutes)
app.use('/dbinscriptos', inscriptosRoutes)
app.use('/dbegresados', egresadosRoutes)
app.use('/alutivos', alumnosRoutes)
app.use('/cursadas', cursadasRoutes)
app.use('/examenes',examenesRoutes)
app.use('/rendimiento',rendimientoRoutes)
app.use('/utiles', utilesRoutes)

export default app


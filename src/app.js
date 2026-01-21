import alumnosInfoRoutes from './routes/alumnosInfoRoutes.js'
import alumnosRoutes from './routes/alumnosRoutes.js'
import cors from 'cors'
import cursadasRoutes from './routes/cursadasRoutes.js'
import dotenv from 'dotenv'
import egresadosRoutes from './routes/egresadosRoutes.js'
import examenesRoutes from './routes/examenesRoutes.js'
import express from 'express'

import ingresantesRoutes from './routes/ingresantesRoutes.js'
import inscriptosRoutes from './routes/inscriptosRoutes.js'
import morgan from 'morgan'
import opeanaiRoutes from './routes/openaiRoutes.js'
import rendimientoRoutes from './routes/rendimientoRoutes.js'
import session from 'express-session'
import utilesRoutes from './routes/utilesRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import logRoutes from './routes/logRoutes.js'

//

dotenv.config()
const app = express()

app.use(session({
  secret: 'd1sb41rfc35nc5',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Usa `true` si tienes HTTPS
}));
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
app.use('/examenes', examenesRoutes)
app.use('/rendimiento', rendimientoRoutes)
app.use('/utiles', utilesRoutes)
app.use('/aluinfo', alumnosInfoRoutes)
app.use('/datosanalisis', opeanaiRoutes)
app.use('/admin', adminRoutes)
app.use('/log', logRoutes)
//

export default app

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import ingresantesRoutes from './routes/ingresantesRoutes'
import inscriptosRoutes from './routes/inscriptosRoutes'
import egresadosRoutes from './routes/egresadosRoutes'
import alumnosRoutes from './routes/alumnosRoutes'


//
const app = express()

//

app.set('port', '5000')

//
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

//
app.use('/dbingreso', ingresantesRoutes)
app.use('/dbinscriptos', inscriptosRoutes)
app.use('/egresados', egresadosRoutes)
app.use('/alutivos', alumnosRoutes)
export default app


import  { Pool } from  'pg'
import {config} from './configdb'
const coneccionDB = new Pool(config)



export default coneccionDB


import pkg from 'pg';
const {Pool} = pkg
import {config} from './configdb.js'
const coneccionDB = new Pool(config)



export default coneccionDB


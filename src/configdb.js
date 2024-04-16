
import dotenv from 'dotenv'
dotenv.config()
console.log(process.env.HOST_L, process.env.DATABASE_L,process.env.USER_L)

export const config = {
  host: process.env.HOST_L,
  user: process.env.USER_L,
  password: process.env.PASSWORD_L,
  database: process.env.DATABASE_L,
  port: process.env.PORTDB_L
};


"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
//configuracion de base de datos postgres
//conn_string = "host='172.22.160.100' dbname='toba_3_3' user='postgres' password='Cabr-0N.2433' port='5433'"
//remota G3

/*
export const config ={
    host:'172.22.160.100',
    user:'postgres',
    password:'Cabr-0N.2433',
    database:'toba_3_3',
    port:'5433'
}
*/
//localdell
var config = {
  host: 'localhost',
  user: 'postgres',
  password: 'cabron.2433',
  database: 'guarani_3_18_1',
  port: '5432'
};
exports.config = config;
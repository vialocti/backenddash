"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListadoEgreSedeCarreraAnio = exports.getEgresadosPromedios = exports.getEgresadoSedeCarreraAnio = exports.getCantidadEgreSedesAnio = exports.getCantidadEgreSedeCarreraAnio = exports.cantidadEresadosaniosPropuesta = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//promedio por carrera anio
var getEgresadoSedeCarreraAnio = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$params, anio, lapso, fecha_i, fecha_f, aniot, sql_1, sql_I, sql_w, sql_g, sql, resu;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$params = req.params, anio = _req$params.anio, lapso = _req$params.lapso;
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (lapso === 'C') {
              fecha_i = "".concat(anio, "-01-01");
              fecha_f = "".concat(aniot, "-01-01");
            } else if (lapso === 'L') {
              fecha_i = "".concat(anio, "-04-01");
              fecha_f = "".concat(aniot, "-04-01");
            }

            sql_1 = "select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,\n     CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,\n    count(sa.propuesta) as canti,avg(promedio) as pro,avg(promedio_sin_aplazos) as prosa  from negocio.sga_certificados_otorg sco ";
            sql_I = " inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno";
            sql_w = " where sco.fecha_egreso >='".concat(fecha_i, "' and sco.fecha_egreso <'").concat(fecha_f, "'");
            sql_g = " group by sa.ubicacion ,sa.propuesta order by sa.ubicacion,sa.propuesta";
            _context.prev = 9;
            sql = "".concat(sql_1, " ").concat(sql_I, " ").concat(sql_w, " ").concat(sql_g); //console.log(sql)

            _context.next = 13;
            return _database["default"].query(sql);

          case 13:
            resu = _context.sent;
            res.send(resu.rows);
            _context.next = 19;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](9);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 17]]);
  }));

  return function getEgresadoSedeCarreraAnio(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //listado carrera sede anio


exports.getEgresadoSedeCarreraAnio = getEgresadoSedeCarreraAnio;

var getListadoEgreSedeCarreraAnio = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var _req$params2, anio, lapso, sede, car, fecha_i, fecha_f, aniot, sql, resu;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$params2 = req.params, anio = _req$params2.anio, lapso = _req$params2.lapso, sede = _req$params2.sede, car = _req$params2.car;
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (lapso === 'C') {
              fecha_i = "".concat(anio, "-01-01");
              fecha_f = "".concat(aniot, "-01-01");
            } else if (lapso === 'L') {
              fecha_i = "".concat(anio, "-04-01");
              fecha_f = "".concat(aniot, "-04-01");
            }

            sql = "select sa.legajo,mp.apellido,mp.nombres, CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,\n    sco.fecha_egreso, CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera,sco.promedio, sco.promedio_sin_aplazos \n    from negocio.sga_certificados_otorg sco\n    inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno\n    inner join negocio.mdp_personas mp on mp.persona=sco.persona \n    where sa.ubicacion=".concat(sede, " and sa.propuesta=").concat(car, " and sco.fecha_egreso >='").concat(fecha_i, "' and sco.fecha_egreso <'").concat(fecha_f, "' ");
            _context2.prev = 6;
            _context2.next = 9;
            return _database["default"].query(sql);

          case 9:
            resu = _context2.sent;
            res.send(resu.rows);
            _context2.next = 15;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](6);

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 13]]);
  }));

  return function getListadoEgreSedeCarreraAnio(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getListadoEgreSedeCarreraAnio = getListadoEgreSedeCarreraAnio;

var getCantidadEgreSedeCarreraAnio = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var _req$params3, anio, lapso, sede, fecha_i, fecha_f, aniot, sql, resu;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _req$params3 = req.params, anio = _req$params3.anio, lapso = _req$params3.lapso, sede = _req$params3.sede;
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (lapso === 'C') {
              fecha_i = "".concat(anio, "-01-01");
              fecha_f = "".concat(aniot, "-01-01");
            } else if (lapso === 'L') {
              fecha_i = "".concat(anio, "-04-01");
              fecha_f = "".concat(aniot, "-04-01");
            }

            sql = "select CASE sa.propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera, \n    count(sa.propuesta) from negocio.sga_certificados_otorg sco\n    inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno\n    inner join negocio.mdp_personas mp on mp.persona=sco.persona \n    where sa.ubicacion=".concat(sede, " and sco.fecha_egreso >='").concat(fecha_i, "' and sco.fecha_egreso <'").concat(fecha_f, "' \n    group by sa.propuesta\n    ");
            _context3.prev = 6;
            _context3.next = 9;
            return _database["default"].query(sql);

          case 9:
            resu = _context3.sent;
            res.send(resu.rows);
            _context3.next = 16;
            break;

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](6);
            console.log(_context3.t0);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 13]]);
  }));

  return function getCantidadEgreSedeCarreraAnio(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); //cantidad por sedes


exports.getCantidadEgreSedeCarreraAnio = getCantidadEgreSedeCarreraAnio;

var getCantidadEgreSedesAnio = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$params4, anio, lapso, fecha_i, fecha_f, aniot, sql, resu;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params4 = req.params, anio = _req$params4.anio, lapso = _req$params4.lapso;
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (lapso === 'C') {
              fecha_i = "".concat(anio, "-01-01");
              fecha_f = "".concat(aniot, "-01-01");
            } else if (lapso === 'L') {
              fecha_i = "".concat(anio, "-04-01");
              fecha_f = "".concat(aniot, "-04-01");
            }

            sql = "select CASE sa.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,\n    count(sa.ubicacion)\n        from negocio.sga_certificados_otorg sco\n        inner join negocio.sga_alumnos sa on sa.alumno=sco.alumno\n        inner join negocio.mdp_personas mp on mp.persona=sco.persona \n        where sco.fecha_egreso >='".concat(fecha_i, "' and sco.fecha_egreso <'").concat(fecha_f, "' \n        group by sa.ubicacion\n    ");
            _context4.prev = 6;
            _context4.next = 9;
            return _database["default"].query(sql);

          case 9:
            resu = _context4.sent;
            res.send(resu.rows);
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](6);
            console.log(_context4.t0);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[6, 13]]);
  }));

  return function getCantidadEgreSedesAnio(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getCantidadEgreSedesAnio = getCantidadEgreSedesAnio;

var getEgresadosPromedios = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var _req$params5, anio, car, lapso, ficola, ffcola, fecha_i, fecha_f, aniot, car_q, sql, wer, resp;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            console.log('aaa');
            _req$params5 = req.params, anio = _req$params5.anio, car = _req$params5.car, lapso = _req$params5.lapso, ficola = _req$params5.ficola, ffcola = _req$params5.ffcola;
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (ficola === '0' && ffcola === '0') {
              if (lapso === 'C') {
                fecha_i = "".concat(anio, "-01-01");
                fecha_f = "".concat(aniot, "-01-01");
              } else if (lapso === 'L') {
                fecha_i = "".concat(anio, "-04-01");
                fecha_f = "".concat(aniot, "-04-01");
              }
            } else {
              fecha_i = ficola;
              fecha_f = ffcola;
            }

            car_q = '';

            if (car === 'T') {
              car_q = '3,4,5,6,7,8';
            } else {
              car_q = car;
            }

            sql = "select alu.legajo,concat(per.apellido,', ',per.nombres) as nameC,cer.persona,alu.alumno,\n    case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta,\n    round(promedio,2) as promedio,round(promedio_sin_aplazos,2) as promesa,to_char(fecha_egreso,'dd-mm-yyyy') as fecha_egreso,\n    (select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)) as anio \n   ,(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,2)) as aniop\n   , round((fecha_egreso - cast( (concat((select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)),'-04-01')) as DATE))/365.0, 2) as tiempo\n   from negocio.sga_certificados_otorg cer \n   inner join negocio.mdp_personas per on per.persona=cer.persona\n   inner join negocio.sga_alumnos alu on alu.alumno=cer.alumno\n  where fecha_egreso >'".concat(fecha_i, "' and fecha_egreso <'").concat(fecha_f, "' and certificado in (").concat(car_q, ")\n  order by certificado,nameC,fecha_egreso\n");
            _context5.prev = 9;
            _context5.next = 12;
            return _database["default"].query('set search_path=negocio');

          case 12:
            wer = _context5.sent;
            _context5.next = 15;
            return _database["default"].query(sql);

          case 15:
            resp = _context5.sent;
            res.send(resp.rows);
            _context5.next = 22;
            break;

          case 19:
            _context5.prev = 19;
            _context5.t0 = _context5["catch"](9);
            console.log(_context5.t0);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[9, 19]]);
  }));

  return function getEgresadosPromedios(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); //devuelve cantidad de egresados discriminados por certificado


exports.getEgresadosPromedios = getEgresadosPromedios;

var cantidadEgrAnioPropuestas = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(anio, lapso) {
    var fecha_i, fecha_f, aniot, sqlstr, resp;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fecha_i = '';
            fecha_f = '';
            aniot = Number(anio) + 1;

            if (lapso === 'C') {
              fecha_i = "".concat(anio, "-01-01");
              fecha_f = "".concat(aniot, "-01-01");
            } else if (lapso === 'L') {
              fecha_i = "".concat(anio, "-04-01");
              fecha_f = "".concat(aniot, "-04-01");
            }
            /*
             let sqlstr = `select case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta, count(certificado)
             from negocio.sga_certificados_otorg where fecha_egreso >='${fecha_i}' and fecha_egreso<='${fecha_f}' group by certificado
             `
            */


            sqlstr = "select case certificado when 3 then 'CPN' when 4 then 'LA' when 5 then 'LE' when 6 then 'LNRG' when 7 then 'LLO' when 9 then 'CP' end as propuesta, count(certificado)\n    , sexo from negocio.sga_certificados_otorg cert\n    inner join negocio.mdp_personas mp on mp.persona=cert.persona\n    where fecha_egreso >='".concat(fecha_i, "' and fecha_egreso<='").concat(fecha_f, "' \n    group by certificado,sexo\n    ");
            _context6.prev = 5;
            _context6.next = 8;
            return _database["default"].query(sqlstr);

          case 8:
            resp = _context6.sent;
            return _context6.abrupt("return", resp.rows);

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](5);
            console.log(_context6.t0);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[5, 12]]);
  }));

  return function cantidadEgrAnioPropuestas(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}(); //lectura de egresados entre años por carrera


var cantidadEresadosaniosPropuesta = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$params6, anioI, anioF, lapso, resu, i, datos, resuanio;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$params6 = req.params, anioI = _req$params6.anioI, anioF = _req$params6.anioF, lapso = _req$params6.lapso;
            resu = [];
            i = Number(anioI);

          case 3:
            if (!(i < Number(anioF) + 1)) {
              _context7.next = 25;
              break;
            }

            datos = {
              anio: 0,
              cpnm: 0,
              lam: 0,
              lem: 0,
              llom: 0,
              lnrgm: 0,
              cpm: 0,
              cpnf: 0,
              laf: 0,
              lef: 0,
              llof: 0,
              lnrgf: 0,
              cpf: 0
            };
            _context7.next = 7;
            return cantidadEgrAnioPropuestas(i, lapso);

          case 7:
            resuanio = _context7.sent;
            //console.log(resuanio)
            //console.log(resuanio.filter(anior => anior.propuesta === 'LLO'))
            //console.log(resuanio.filter(anior => anior.propuesta === 'CPN').length, Number(resuanio.filter(anior => anior.propuesta === 'CPN')[0].count))
            datos.anio = i;
            datos.cpnm = resuanio.filter(function (anior) {
              return anior.propuesta === 'CPN' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'CPN' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.lam = resuanio.filter(function (anior) {
              return anior.propuesta === 'LA' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LA' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.lem = resuanio.filter(function (anior) {
              return anior.propuesta === 'LE' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LE' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.lnrgm = resuanio.filter(function (anior) {
              return anior.propuesta === 'LNRG' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LNRG' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.llom = resuanio.filter(function (anior) {
              return anior.propuesta === 'LLO' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LLO' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.cpm = resuanio.filter(function (anior) {
              return anior.propuesta === 'CP' && anior.sexo === 'M';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'CP' && anior.sexo === 'M';
            })[0].count) : 0;
            datos.cpnf = resuanio.filter(function (anior) {
              return anior.propuesta === 'CPN' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'CPN' && anior.sexo === 'F';
            })[0].count) : 0;
            datos.laf = resuanio.filter(function (anior) {
              return anior.propuesta === 'LA' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LA' && anior.sexo === 'F';
            })[0].count) : 0;
            datos.lef = resuanio.filter(function (anior) {
              return anior.propuesta === 'LE' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LE' && anior.sexo === 'F';
            })[0].count) : 0;
            datos.lnrgf = resuanio.filter(function (anior) {
              return anior.propuesta === 'LNRG' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LNRG' && anior.sexo === 'F';
            })[0].count) : 0;
            datos.llof = resuanio.filter(function (anior) {
              return anior.propuesta === 'LLO' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'LLO' && anior.sexo === 'F';
            })[0].count) : 0;
            datos.cpf = resuanio.filter(function (anior) {
              return anior.propuesta === 'CP' && anior.sexo === 'F';
            }).length > 0 ? Number(resuanio.filter(function (anior) {
              return anior.propuesta === 'CP' && anior.sexo === 'F';
            })[0].count) : 0;
            resu.push(datos);

          case 22:
            i++;
            _context7.next = 3;
            break;

          case 25:
            res.send(resu);

          case 26:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function cantidadEresadosaniosPropuesta(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.cantidadEresadosaniosPropuesta = cantidadEresadosaniosPropuesta;
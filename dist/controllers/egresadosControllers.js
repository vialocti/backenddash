"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListadoEgreSedeCarreraAnio = exports.getEgresadosPromedios = exports.getEgresadoSedeCarreraAnio = exports.getCantidadEgreSedesAnio = exports.getCantidadEgreSedeCarreraAnio = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

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
}();

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
    var _req$params5, anio, car, lapso, fecha_i, fecha_f, aniot, sql, wer, resp;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$params5 = req.params, anio = _req$params5.anio, car = _req$params5.car, lapso = _req$params5.lapso;
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

            sql = "select alu.legajo,concat(per.apellido,', ',per.nombres) as nameC,cer.persona,alu.alumno,certificado,promedio,promedio_sin_aplazos,fecha_egreso,\n(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)) as anio \n,(select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,2)) as aniop\n,(fecha_egreso - cast( (concat((select *  from negocio.get_anio_academico_ingreso_alumno(cer.alumno,1)),'-04-01')) as DATE))/365.0 as tiempo\n from negocio.sga_certificados_otorg cer \n  inner join negocio.mdp_personas per on per.persona=cer.persona\n  inner join negocio.sga_alumnos alu on alu.alumno=cer.alumno\n where fecha_egreso >'".concat(fecha_i, "' and fecha_egreso <'").concat(fecha_f, "' and certificado=").concat(car, "\n");
            _context5.prev = 6;
            _context5.next = 9;
            return _database["default"].query('set search_path=negocio');

          case 9:
            wer = _context5.sent;
            _context5.next = 12;
            return _database["default"].query(sql);

          case 12:
            resp = _context5.sent;
            res.send(resp.rows);
            _context5.next = 19;
            break;

          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](6);
            console.log(_context5.t0);

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 16]]);
  }));

  return function getEgresadosPromedios(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getEgresadosPromedios = getEgresadosPromedios;
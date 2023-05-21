"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListadoEgreSedeCarreraAnio = exports.getEgresadoSedeCarreraAnio = void 0;

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
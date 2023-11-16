"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResultadosPorActa = exports.getMesasExamen = exports.getActasExamenTotalResu = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//mesas examen anio
var getMesasExamen = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select sa.id_acta,sp.periodo, sp.nombre as nper,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion  from negocio.sga_mesas_examen sme \n    inner join  negocio.sga_llamados_mesa slm on slm.mesa_examen=sme.mesa_examen \n    inner join negocio.sga_llamados_turno slt on slt.llamado = slm.llamado\n    inner join negocio.sga_actas sa on sa.llamado_mesa = slm.llamado_mesa \n    inner join negocio.sga_turnos_examen ste on ste.turno_examen =slt.turno_examen\n    inner join negocio.sga_periodos sp on sp.periodo=ste.periodo\n    inner join negocio.sga_elementos se on se.elemento =sme.elemento \n    where sp.anio_academico =".concat(anio, " and sa.origen ='E' and sa.estado ='C'\n    order by ubicacion, se.nombre\n    ");
            _context.prev = 2;
            _context.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context.sent;
            res.send(resu.rows);
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            console.log(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));

  return function getMesasExamen(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //mesas examenes con total R, A y U


exports.getMesasExamen = getMesasExamen;

var getActasExamenTotalResu = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select sa.id_acta,sp.periodo, sp.nombre as nper,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion, sad.resultado, count(sad.resultado)  from negocio.sga_mesas_examen sme \n    inner join  negocio.sga_llamados_mesa slm on slm.mesa_examen=sme.mesa_examen \n    inner join negocio.sga_llamados_turno slt on slt.llamado = slm.llamado\n    inner join negocio.sga_actas sa on sa.llamado_mesa = slm.llamado_mesa \n    inner join negocio.sga_actas_detalle sad on sad.id_acta =sa.id_acta \n    inner join negocio.sga_turnos_examen ste on ste.turno_examen =slt.turno_examen\n    inner join negocio.sga_periodos sp on sp.periodo=ste.periodo\n    inner join negocio.sga_elementos se on se.elemento =sme.elemento \n    where sp.anio_academico =".concat(anio, " and sa.origen ='E' and sa.estado ='C'\n    group by sa.id_acta,sp.periodo, sp.nombre ,sme.mesa_examen ,sme.nombre, sme.elemento,se.nombre , sme.ubicacion, sad.resultado \n    order by se.nombre\n");
            _context2.prev = 2;
            _context2.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context2.sent;
            res.send(resu.rows);
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            console.log(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 9]]);
  }));

  return function getActasExamenTotalResu(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //resultados por actas


exports.getActasExamenTotalResu = getActasExamenTotalResu;

var getResultadosPorActa = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var idacta, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            idacta = req.params.idacta;
            sqlstr = "select resultado, count(resultado) from negocio.sga_actas_detalle sad \n    where id_acta =".concat(idacta, "\n    group by resultado\n");
            _context3.prev = 2;
            _context3.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context3.sent;
            res.send(resu.rows);
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](2);
            console.log(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 9]]);
  }));

  return function getResultadosPorActa(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getResultadosPorActa = getResultadosPorActa;
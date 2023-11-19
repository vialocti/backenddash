"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getplanesVersion = exports.getAlumnosInfoSedePropuestaplanversion = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//import { Connection } from 'pg'

/*
export const nameFuncion = async (req, res) => {

    const {par, par} = req.params
    

    let sqlstr = `
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}
*/
//import coneccionDB from '../database'
//alumos info por sede carrera plan version anio
var getAlumnosInfoSedePropuestaplanversion = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var _req$params, ubicacion, propuesta, plan, planversion, anioipro, sqlstr, resu;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$params = req.params, ubicacion = _req$params.ubicacion, propuesta = _req$params.propuesta, plan = _req$params.plan, planversion = _req$params.planversion, anioipro = _req$params.anioipro;
            sqlstr = "select alumno,legajo,ubicacion,propuesta,plan,plan_version ,concat(apellido,', ',nombres) as estudiante ,anio_ingreso_pro ,anio_ingreso_fac ,aprobadas,reprobadas,regularesap ,promedioca, promediosa ,completado  from fce_per.alumnos_info ai \n    where ubicacion=".concat(ubicacion, " and propuesta=").concat(propuesta, " and plan=").concat(plan, " and plan_version =").concat(planversion, " and anio_ingreso_pro =").concat(anioipro, " order by anio_ingreso_fac \n    ");
            console.warn(sqlstr);
            _context.prev = 3;
            _context.next = 6;
            return _database["default"].query(sqlstr);

          case 6:
            resu = _context.sent;
            res.send(resu.rows);
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            console.log(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 10]]);
  }));

  return function getAlumnosInfoSedePropuestaplanversion(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //planes activos en la tabla info


exports.getAlumnosInfoSedePropuestaplanversion = getAlumnosInfoSedePropuestaplanversion;

var getplanesVersion = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var sqlstr, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sqlstr = "select distinct ai.propuesta,ai.plan, ai.plan_version, spv.nombre from fce_per.alumnos_info ai\n            inner join negocio.sga_planes_versiones spv on spv.plan_version =ai.plan_version \n            order by propuesta";
            _context2.prev = 1;
            _context2.next = 4;
            return _database["default"].query(sqlstr);

          case 4:
            resu = _context2.sent;
            res.send(resu.rows);
            _context2.next = 10;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 8]]);
  }));

  return function getplanesVersion(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getplanesVersion = getplanesVersion;
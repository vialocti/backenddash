"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traerInscriptosPorPeriodos = exports.getIscriptosTipoIngresoSedeSexoCarrera = exports.getIscriptosTipoIngresoSedeSexo = exports.getInscriptosTotalSedeTI = exports.getInscriptosTotalSede = exports.getInscriptosTotal = exports.getInscriptosTanios = exports.getInscriptosSedeAnio = exports.getInscriptosPorPropuestaSede = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

//discriminado por tipo ingreso
var countInscriptosPorTI = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(anio) {
    var sqlqy, resultado;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            sqlqy = "SELECT tipo_ingreso,count(tipo_ingreso)as toti  FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " and propuesta in (1,2,3,6,7,8)\n        group by tipo_ingreso ");
            _context.next = 4;
            return _database["default"].query(sqlqy);

          case 4:
            resultado = _context.sent;
            return _context.abrupt("return", resultado);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function countInscriptosPorTI(_x) {
    return _ref.apply(this, arguments);
  };
}();

var countInscriptos = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(anio) {
    var sqlqy, resultado;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            sqlqy = "SELECT COUNT(*)as catidad FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " and propuesta in (1,2,3,6,7,8)");
            _context2.next = 4;
            return _database["default"].query(sqlqy);

          case 4:
            resultado = _context2.sent;
            return _context2.abrupt("return", resultado);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function countInscriptos(_x2) {
    return _ref2.apply(this, arguments);
  };
}(); //inscriptos total anio


var getInscriptosTotal = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            anio = req.params.anio;
            _context3.prev = 1;
            _context3.next = 4;
            return countInscriptos(anio);

          case 4:
            resu = _context3.sent;
            //console.log(resu)
            res.send(resu.rows[0]);
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function getInscriptosTotal(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}(); // total inscriptos entre años


exports.getInscriptosTotal = getInscriptosTotal;

var getInscriptosTanios = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var _req$params, anioi, aniof, aniototal, i, totalI, objti;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$params = req.params, anioi = _req$params.anioi, aniof = _req$params.aniof;
            aniototal = [];
            _context4.prev = 2;
            i = Number(anioi);

          case 4:
            if (!(i < Number(aniof) + 1)) {
              _context4.next = 13;
              break;
            }

            _context4.next = 7;
            return countInscriptos(i);

          case 7:
            totalI = _context4.sent;
            objti = {
              anio: i,
              total: totalI.rows[0]
            };
            aniototal.push(objti);

          case 10:
            i++;
            _context4.next = 4;
            break;

          case 13:
            res.send(aniototal);
            _context4.next = 19;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 16]]);
  }));

  return function getInscriptosTanios(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}(); //total inscriptos por sde anio


exports.getInscriptosTanios = getInscriptosTanios;

var getInscriptosSedeAnio = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var anio, strq, resu;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            anio = req.params.anio;
            strq = "SELECT CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede ,\n        count(*)  FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " and propuesta in (1,2,3,6,7,8) Group by ubicacion order by ubicacion");
            _context5.prev = 2;
            _context5.next = 5;
            return _database["default"].query(strq);

          case 5:
            resu = _context5.sent;
            res.send(resu.rows);
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](2);
            console.log(_context5.t0);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 9]]);
  }));

  return function getInscriptosSedeAnio(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}(); // total por año carrera sede


exports.getInscriptosSedeAnio = getInscriptosSedeAnio;

var getInscriptosPorPropuestaSede = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var _req$params2, anio, sede, propuesta, strq, resu;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$params2 = req.params, anio = _req$params2.anio, sede = _req$params2.sede, propuesta = _req$params2.propuesta;
            strq = "SELECT COUNT(*)as nro FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND propuesta=").concat(propuesta);
            _context6.prev = 2;
            _context6.next = 5;
            return _database["default"].query(strq);

          case 5:
            resu = _context6.sent;
            res.send(resu.rows[0]);
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](2);
            console.log(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 9]]);
  }));

  return function getInscriptosPorPropuestaSede(_x9, _x10) {
    return _ref6.apply(this, arguments);
  };
}(); //total propuesta por año sede y carrera agrupados discrimina tipo ingreso


exports.getInscriptosPorPropuestaSede = getInscriptosPorPropuestaSede;

var getInscriptosTotalSedeTI = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            anio = req.params.anio;
            _context7.prev = 1;
            _context7.next = 4;
            return _database["default"].query("SELECT CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede ,\n    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera\n    ,tipo_ingreso ,COUNT(*) as nro FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " and propuesta in (1,2,3,6,7,8) Group by ubicacion,propuesta,tipo_ingreso order by ubicacion,propuesta"));

          case 4:
            resu = _context7.sent;
            res.send(resu.rows);
            _context7.next = 11;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](1);
            console.log(_context7.t0);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 8]]);
  }));

  return function getInscriptosTotalSedeTI(_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}(); //solo sede carrera


exports.getInscriptosTotalSedeTI = getInscriptosTotalSedeTI;

var getInscriptosTotalSede = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var anio, resu;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            anio = req.params.anio;
            _context8.next = 3;
            return _database["default"].query("SELECT CASE ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede ,\n    CASE propuesta WHEN 1 THEN 'CPN' WHEN 8 THEN 'CP' WHEN 2 THEN 'LA' WHEN 3 THEN 'LE' WHEN 6 THEN 'LNRG' WHEN 7 THEN 'LLO' END as carrera\n     ,COUNT(*) as nro FROM negocio.sga_propuestas_aspira where anio_academico=".concat(anio, " and propuesta in (1,2,3,6,7,8) Group by ubicacion,propuesta order by ubicacion,propuesta"));

          case 3:
            resu = _context8.sent;
            res.send(resu.rows);

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function getInscriptosTotalSede(_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}(); // total por sede, sexo, tipo inscripcion


exports.getInscriptosTotalSede = getInscriptosTotalSede;

var getIscriptosTipoIngresoSedeSexo = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    var _req$params3, anio, sede, tipoI, sexo, tipoIngreso, cabeza, injoin, condi, strquery, resu;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _req$params3 = req.params, anio = _req$params3.anio, sede = _req$params3.sede, tipoI = _req$params3.tipoI, sexo = _req$params3.sexo;
            tipoIngreso = '';

            if (tipoI === '1') {
              tipoIngreso = 'tipo_ingreso in (1,3)';
            } else {
              tipoIngreso = 'tipo_ingreso in (4,6)';
            }

            cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas ';
            injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona ';
            condi = "WHERE anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND ").concat(tipoIngreso, " AND per.sexo='").concat(sexo, "'");
            strquery = "".concat(cabeza).concat(injoin).concat(condi);
            console.log(strquery);
            _context9.prev = 8;
            _context9.next = 11;
            return _database["default"].query(strquery);

          case 11:
            resu = _context9.sent;
            res.send(resu.rows);
            _context9.next = 18;
            break;

          case 15:
            _context9.prev = 15;
            _context9.t0 = _context9["catch"](8);
            console.log(_context9.t0);

          case 18:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[8, 15]]);
  }));

  return function getIscriptosTipoIngresoSedeSexo(_x15, _x16) {
    return _ref9.apply(this, arguments);
  };
}(); // total por sede, sexo, tipo inscripcion


exports.getIscriptosTipoIngresoSedeSexo = getIscriptosTipoIngresoSedeSexo;

var getIscriptosTipoIngresoSedeSexoCarrera = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var _req$params4, anio, sede, tipoI, sexo, carrera, tipoIngreso, cabeza, injoin, condi, strquery, resu;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _req$params4 = req.params, anio = _req$params4.anio, sede = _req$params4.sede, tipoI = _req$params4.tipoI, sexo = _req$params4.sexo, carrera = _req$params4.carrera;
            tipoIngreso = '';

            if (tipoI === '1') {
              tipoIngreso = 'tipo_ingreso in (1,3)';
            } else {
              tipoIngreso = 'tipo_ingreso in (4,6)';
            }

            cabeza = 'SELECT COUNT(*) as tot FROM negocio.sga_propuestas_aspira as pas ';
            injoin = 'INNER JOIN negocio.mdp_personas as per on per.persona=pas.persona ';
            condi = "WHERE anio_academico=".concat(anio, " AND ubicacion=").concat(sede, " AND ").concat(tipoIngreso, " AND per.sexo='").concat(sexo, "' and propuesta=").concat(carrera);
            strquery = "".concat(cabeza).concat(injoin).concat(condi);
            console.log(strquery);
            _context10.prev = 8;
            _context10.next = 11;
            return _database["default"].query(strquery);

          case 11:
            resu = _context10.sent;
            res.send(resu.rows);
            _context10.next = 18;
            break;

          case 15:
            _context10.prev = 15;
            _context10.t0 = _context10["catch"](8);
            console.log(_context10.t0);

          case 18:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[8, 15]]);
  }));

  return function getIscriptosTipoIngresoSedeSexoCarrera(_x17, _x18) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getIscriptosTipoIngresoSedeSexoCarrera = getIscriptosTipoIngresoSedeSexoCarrera;

var traerMinFechaI = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(anio_a) {
    var sqlstr, resu;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            sqlstr = "SELECT MIN(fecha_inscripcion) FROM negocio.sga_propuestas_aspira spa \n    WHERE anio_academico=".concat(anio_a);
            _context11.prev = 1;
            _context11.next = 4;
            return _database["default"].query(sqlstr);

          case 4:
            resu = _context11.sent;
            return _context11.abrupt("return", resu);

          case 8:
            _context11.prev = 8;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0);

          case 11:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 8]]);
  }));

  return function traerMinFechaI(_x19) {
    return _ref11.apply(this, arguments);
  };
}();

var traerInscriptosPorPeriodos = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var _req$params5, anioI, anioF, dias, f_Inicio, f_Fin, sqlstr, resu;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _req$params5 = req.params, anioI = _req$params5.anioI, anioF = _req$params5.anioF, dias = _req$params5.dias;
            f_Inicio = traerMinFechaI(anioI);
            f_Fin = '';
            sqlstr = '';
            _context12.prev = 4;
            _context12.next = 7;
            return _database["default"].query(sqlstr);

          case 7:
            resu = _context12.sent;
            _context12.next = 13;
            break;

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](4);
            console.log(_context12.t0);

          case 13:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[4, 10]]);
  }));

  return function traerInscriptosPorPeriodos(_x20, _x21) {
    return _ref12.apply(this, arguments);
  };
}();

exports.traerInscriptosPorPeriodos = traerInscriptosPorPeriodos;
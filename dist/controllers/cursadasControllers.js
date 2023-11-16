"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultadoActaDetallesporPeriodo = exports.resultadoActaDetallesporComision = exports.getPeriodosLectivosAnio = exports.getListComisionesAnio = exports.getComisionesSedePL = exports.getComisionesCantiInscriptosPlan = exports.getComisionesCantiInscriptos = exports.getComisionesAnio = void 0;

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
///traelos periodos lectivos en un año academico
var getPeriodosLectivosAnio = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select spl.periodo_lectivo,spl.periodo,spg.nombre, spg.periodo_generico  from negocio.sga_periodos_lectivos spl\n    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo\n    inner join negocio.sga_periodos_genericos spg on spg.periodo_generico =sp.periodo_generico \n    where sp.anio_academico =".concat(anio);
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

  return function getPeriodosLectivosAnio(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //listado de comisiones


exports.getPeriodosLectivosAnio = getPeriodosLectivosAnio;

var getListComisionesAnio = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select sc.ubicacion, se.nombre as mater,sc.comision, sc.nombre,sc.periodo_lectivo,sc.elemento,sc.nombre as nmat,se.codigo,se.nombre, spl.periodo,sp.anio_academico, sp.periodo_generico, sp.nombre , spgt.periodo_generico_tipo,sc.estado  from negocio.sga_comisiones sc \n    inner join negocio.sga_elementos se on se.elemento = sc.elemento \n    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo\n    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo\n    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico \n    where sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' order by sc.ubicacion, sc.periodo_lectivo ");
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

  return function getListComisionesAnio(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //comisiones por anio sede cantidad


exports.getListComisionesAnio = getListComisionesAnio;

var getComisionesAnio = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,count(sc.ubicacion) from negocio.sga_comisiones sc\ninner join negocio.sga_elementos se on se.elemento = sc.elemento \ninner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo\ninner join negocio.sga_periodos sp on sp.periodo=spl.periodo \n \nwhere sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' \ngroup by sc.ubicacion\norder by sc.ubicacion\n");
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

  return function getComisionesAnio(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}(); //comisiones sede plan


exports.getComisionesAnio = getComisionesAnio;

var getComisionesSedePL = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,sp.nombre ,count(sp.nombre) from negocio.sga_comisiones sc\ninner join negocio.sga_elementos se on se.elemento = sc.elemento \ninner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo\ninner join negocio.sga_periodos sp on sp.periodo=spl.periodo \n \nwhere sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' \ngroup by sc.ubicacion,sp.nombre\norder by sc.ubicacion,sp.nombre  \n");
            _context4.prev = 2;
            _context4.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context4.sent;
            res.send(resu.rows);
            _context4.next = 12;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            console.log(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[2, 9]]);
  }));

  return function getComisionesSedePL(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}(); //--------//cantidad de inscriptos comision


exports.getComisionesSedePL = getComisionesSedePL;

var getComisionesCantiInscriptos = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select sc.ubicacion,sc.nombre as ncomi,se.nombre,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic \n    inner join negocio.sga_comisiones sc on sc.comision=sic.comision\n    inner join negocio.sga_elementos se on se.elemento = sc.elemento \n    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo\n    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo\n    inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico \n    where sp.anio_academico =".concat(anio, " and not sc.nombre like'V%'\n    \n    group by sc.ubicacion, sc.nombre,se.nombre,sic.comision\n    order by sc.ubicacion, sc.nombre  \n");
            _context5.prev = 2;
            _context5.next = 5;
            return _database["default"].query(sqlstr);

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

  return function getComisionesCantiInscriptos(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}(); //cantidad de inscriptos por plan - comision
//--------


exports.getComisionesCantiInscriptos = getComisionesCantiInscriptos;

var getComisionesCantiInscriptosPlan = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select distinct sc.ubicacion,spv.nombre as names ,sc.nombre as namec, se.nombre,sic.comision, count(sic.comision) as tot from negocio.sga_insc_cursada sic \n        inner join negocio.sga_comisiones sc on sc.comision=sic.comision\n        inner join negocio.sga_elementos se on se.elemento = sc.elemento \n        inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo\n        inner join negocio.sga_periodos sp on sp.periodo =spl.periodo\n        inner join negocio.sga_periodos_genericos spgt on spgt.periodo_generico  = sp.periodo_generico \n        inner join negocio.sga_planes_versiones spv on spv.plan_version =sic.plan_version \n        where sp.anio_academico =".concat(anio, " and not sc.nombre like'V%'\n        \n        group by sic.comision,spv.nombre,sc.ubicacion, sc.nombre,se.nombre\n        order by sc.ubicacion, sc.nombre\n    ");
            _context6.prev = 2;
            _context6.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context6.sent;
            res.send(resu.rows);
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

  return function getComisionesCantiInscriptosPlan(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}(); //detalle de actas por periodo


exports.getComisionesCantiInscriptosPlan = getComisionesCantiInscriptosPlan;

var resultadoActaDetallesporPeriodo = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var _req$params, anio, periodo, origen, sqlstr, resu;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$params = req.params, anio = _req$params.anio, periodo = _req$params.periodo, origen = _req$params.origen;
            sqlstr = " select sc.comision, sc.nombre  as namec,sp.nombre  ,sa.origen ,resultado,count(resultado)  from negocio.sga_actas_detalle sad \n    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta\n    inner join negocio.sga_comisiones sc on sc.comision=sa.comision \n    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo \n    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo \n    where sa.estado='C' and rectificado='N' and sp.anio_academico =".concat(anio, " and sa.origen='").concat(origen, "' and sp.periodo_generico =").concat(periodo, "\n    group by sc.comision,sc.nombre,sp.nombre,sa.origen,sad.resultado order by sc.comision\n"); //console.log(sqlstr)

            _context7.prev = 2;
            _context7.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context7.sent;
            res.send(resu.rows);
            _context7.next = 11;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](2);

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 9]]);
  }));

  return function resultadoActaDetallesporPeriodo(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}(); //detalle de actas regular, promocion por comision(nombre de la comision)


exports.resultadoActaDetallesporPeriodo = resultadoActaDetallesporPeriodo;

var resultadoActaDetallesporComision = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var _req$params2, anio, ncomision, sqlstr, resu;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$params2 = req.params, anio = _req$params2.anio, ncomision = _req$params2.ncomision;
            sqlstr = "select sc.comision,sc.nombre,sp.nombre  ,sa.origen ,resultado,count(resultado)  from negocio.sga_actas_detalle sad \n    inner join negocio.sga_actas sa on sa.id_acta =sad.id_acta\n    inner join negocio.sga_comisiones sc on sc.comision=sa.comision \n    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo =sc.periodo_lectivo \n    inner join negocio.sga_periodos sp on sp.periodo =spl.periodo \n    where sa.estado='C' and sp.anio_academico =".concat(anio, " and sa.origen in('P','R') \n     and sc.comision='").concat(ncomision, "' and rectificado='N'\n    group by  sc.comision,sc.nombre,sp.nombre,sa.origen,sad.resultado\n");
            _context8.prev = 2;
            _context8.next = 5;
            return _database["default"].query(sqlstr);

          case 5:
            resu = _context8.sent;
            res.send(resu.rows);
            _context8.next = 11;
            break;

          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](2);

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[2, 9]]);
  }));

  return function resultadoActaDetallesporComision(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.resultadoActaDetallesporComision = resultadoActaDetallesporComision;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListComisionesAnio = exports.getComisionesSedePL = exports.getComisionesAnio = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _database = _interopRequireDefault(require("../database"));

/*
export const nameFuncion = async (req, res) => {

    const {} = req.params
    

    let sqlstr = `select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,count(sc.ubicacion) from negocio.sga_comisiones sc
inner join negocio.sga_elementos se on se.elemento = sc.elemento 
inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo
inner join negocio.sga_periodos sp on sp.periodo=spl.periodo 
 
where sp.anio_academico =2023 and not sc.nombre like'V%' 
group by sc.ubicacion
order by sc.ubicacion
`

    try {
        
        
        const resu = await coneccionDB.query(sqlstr)
        res.send(resu.rows)
    } catch (error) {

    }

}
*/
var getListComisionesAnio = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select sc.comision,sc.periodo_lectivo,sp.nombre ,sc.ubicacion,sc.nombre,sc.elemento,se.codigo,se.nombre,sc.estado  from negocio.sga_comisiones sc\n    inner join negocio.sga_elementos se on se.elemento = sc.elemento \n    inner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo\n    inner join negocio.sga_periodos sp on sp.periodo=spl.periodo \n     where sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' order by sc.ubicacion,sc.periodo_lectivo ");
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

  return function getListComisionesAnio(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); //


exports.getListComisionesAnio = getListComisionesAnio;

var getComisionesAnio = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,count(sc.ubicacion) from negocio.sga_comisiones sc\ninner join negocio.sga_elementos se on se.elemento = sc.elemento \ninner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo\ninner join negocio.sga_periodos sp on sp.periodo=spl.periodo \n \nwhere sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' \ngroup by sc.ubicacion\norder by sc.ubicacion\n");
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

  return function getComisionesAnio(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //


exports.getComisionesAnio = getComisionesAnio;

var getComisionesSedePL = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var anio, sqlstr, resu;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            anio = req.params.anio;
            sqlstr = "select case sc.ubicacion WHEN 1 THEN 'MZA' WHEN 2 THEN 'SRF' WHEN 3 THEN 'GALV' WHEN 4 THEN 'ESTE' END as sede,sp.nombre ,count(sp.nombre) from negocio.sga_comisiones sc\ninner join negocio.sga_elementos se on se.elemento = sc.elemento \ninner join negocio.sga_periodos_lectivos spl on spl.periodo_lectivo = sc.periodo_lectivo\ninner join negocio.sga_periodos sp on sp.periodo=spl.periodo \n \nwhere sp.anio_academico =".concat(anio, " and not sc.nombre like'V%' \ngroup by sc.ubicacion,sp.nombre\norder by sc.ubicacion,sp.nombre  \n");
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

  return function getComisionesSedePL(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getComisionesSedePL = getComisionesSedePL;
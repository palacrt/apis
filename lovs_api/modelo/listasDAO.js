const { conexion } = require('./database');

let listas = {};
listas['ciudades'] = `select concat(nombre,' (',codigo,')') d, BIN_TO_UUID(id) r from municipios order by d`;
  
function seleccionarTabla(lista, callback) {

  sql = listas[lista];

    conexion.query(sql,(err, rows) => { 
      if (!err) {
        const datos = rows.map(x => Object.assign({},x));
        callback(datos);        
      } else {
        console.log(err);
      }
    });
}

function seleccionarRegistro(lista, id, callback) {

  sql = 
   `select *
    from ( ${listas[lista]} ) x
    where x.id = UUID_TO_BIN(?)`;

    conexion.query(sql,[id],(err, rows) => { 
      if (!err) {
        const dato = Object.assign({},rows[0]);
        callback(dato);
      } else {
        console.log(err);
      }
    });
}

module.exports.seleccionarTabla = seleccionarTabla;
module.exports.seleccionarRegistro = seleccionarRegistro;
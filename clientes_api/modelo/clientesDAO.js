const  { conexion }  = require('./database.js');

function seleccionarTabla(callback) {

  sql = 
   `select
      BIN_TO_UUID(id) as id,
      cedula,
      direccion,
      email,
      nombre,
      telefono,
      BIN_TO_UUID(municipio_id) municipio_id
    from clientes
    order by cedula`;

    conexion.query(sql,(err, rows) => { 
      
      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      } 

      // devuelve la informacion
      const datos = rows.map(x => Object.assign({},x));
      callback(null,datos);

    });

}

function seleccionarRegistro(id, callback) {

  sql = 
   `select
      BIN_TO_UUID(id) as id,
      cedula,
      direccion,
      email,
      nombre,
      telefono,
      BIN_TO_UUID(municipio_id) municipio_id
    from clientes
    where id = UUID_TO_BIN(?)`;

    conexion.query(sql,[id],(err, rows) => { 
      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      }
      
      if (! rows.length) {
        // Error: no se encontro informacion
        callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
        return;
      }

      // devuelve la informacion
      const dato = Object.assign({},rows[0]);     
      callback(null,dato);

    });

}

function insertarRegistro(dato, callback) {

  sql = 
   `insert into clientes(id,cedula,direccion,email,nombre,telefono,municipio_id) 
    values (UUID_TO_BIN(?),?,?,?,?,?,UUID_TO_BIN(?));`;

    conexion.query(sql,[dato.id,dato.cedula,dato.direccion,dato.email,dato.nombre,dato.telefono,dato.municipio_id],(err, result) => { 

      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      }     

      // Devuelve mensaje exitoso  
      callback(null,{dato: dato, status: 'Registro insertado.'});

    });

}

function actualizarRegistro(dato, callback) {

  sql = 
   `update clientes set
      cedula = ?,
      direccion = ?,
      email = ?,
      nombre = ?,
      telefono = ?,
      municipio_id = UUID_TO_BIN(?)
    where id = UUID_TO_BIN(?)`;

    conexion.query(sql,[dato.cedula,dato.direccion,dato.email,dato.nombre,dato.telefono,dato.municipio_id,dato.id],(err, result) => { 

      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      }

      if (! result.affectedRows == 0) {
        // Error: no se encontro informacion
        callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
        return;
      }

      // Devuelve mensjae exitoso
      callback({dato: dato, status: 'Registro actualizado.'});

    });

}

function eliminarRegistro(id, callback) {

  sql = 'delete from clientes where id = UUID_TO_BIN(?)';

    conexion.query(sql,[id],(err, result) => { 
      
      if (err) {
        // envia el objeto de error
        console.log(err);
        callback(err,null);
        return;
      }

      if (! result.affectedRows == 0) {
        // Error: no se encontro informacion
        callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
        return;
      }   

      callback({id: id, status: 'Registro eliminado.'});

    });
}

module.exports.seleccionarTabla = seleccionarTabla;
module.exports.seleccionarRegistro = seleccionarRegistro;
module.exports.insertarRegistro = insertarRegistro;
module.exports.actualizarRegistro = actualizarRegistro;
module.exports.eliminarRegistro = eliminarRegistro;
const fs = require('fs');
const camposDAO = require('../modelo/camposDAO')

function generaCamposSeleccionar(campos) {

  let ultimoElemento = campos.at(-1);
  let lista = ' ';

  campos.forEach((elemento) => {

    let esUltimoElemento = (elemento === ultimoElemento);

    if (elemento.tipo_dato == 'binary') {
      lista += `BIN_TO_UUID(${elemento.campo}) as ${elemento.campo}`
    }
    else {
      lista += elemento.campo
    }
    if (! esUltimoElemento) {
      lista += ',';
    }
    else {
      lista += ' ';
    }
  })

  return lista;

}

function generaCamposInsertar(campos) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);
    lista += elemento.campo;

    if (! esUltimoElemento) {
      lista += ',';
    }
    else {
      lista += ' ';
    }
  })

  return lista;
}

function generaValoresInsertar(campos) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);

    if (elemento.tipo_dato == 'binary') {
      lista += `UUID_TO_BIN(?)`
    }
    else {
      lista += '?'
    }
    if (! esUltimoElemento) {
      lista += ',';
    }
    else {
      lista += ' ';
    }
  })

  return lista;
}

function generaParametrosInsertar(campos) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);

    lista += 'dato.' + elemento.campo;

    if (! esUltimoElemento) {
      lista += ',';
    }
    else {
      lista += ' ';
    }
  })

  return lista;

}

function generaCamposActualizar(campos) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);

    if (elemento.codigo_llave != 'PRI') {

      if (elemento.tipo_dato == 'binary') {
        lista += `${elemento.campo} = UUID_TO_BIN(?)`;
      }
      else {
        lista += `${elemento.campo} = ?`;
      }


      if (! esUltimoElemento) {
        lista += ',';
      }
      else {
        lista += ' ';
      }
    }
  });

  return lista;

}

function generaParametrosActualizar(campos) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  let elementoPri;

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);

    if (elemento.codigo_llave == 'PRI') {
      elementoPri = elemento;
    }
    else {

      lista += 'dato.' + elemento.campo + ',';

    }

  });

  lista += 'dato.' + elementoPri.campo;

  return lista;

}


function generaDAO(directorio,esquema,tabla) {

  let campos = camposDAO.seleccionar(esquema,tabla);

  console.log(campos);

  let nombreArchivo = directorio+'/modelo/'+ tabla + 'DAO.js';

  console.log('Genera: ' + nombreArchivo);

  let codigo =
  `
  const  { conexion }  = require('./database.js');

  function seleccionarTabla(callback) {

    sql =
     \`select ${generaCamposSeleccionar(campos)}
      from ${tabla}
      order by id\`;

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
     \`select ${generaCamposSeleccionar(campos)}
      from ${tabla}
      where id = UUID_TO_BIN(?)\`;

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
     \`insert into ${tabla}(${generaCamposInsertar(campos)})
      values (${generaValoresInsertar(campos)});\`;

      conexion.query(sql,[${generaParametrosInsertar(campos)}],(err, result) => {

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
     \`update ${tabla} set ${generaCamposActualizar(campos)}
      where id = UUID_TO_BIN(?)\`;

      conexion.query(sql,[${generaParametrosActualizar(campos)}],(err, result) => {

        if (err) {
          // envia el objeto de error
          console.log(err);
          callback(err,null);
          return;
        }

        if (result.affectedRows == 0) {
          // Error: no se encontro informacion
          callback({code: 'NOT_FOUND', message: 'No se encontraron registros.'}, null);
          return;
        }

        // Devuelve mensjae exitoso
        callback(null,{dato: dato, status: 'Registro actualizado.'});

      });

  }

  function eliminarRegistro(id, callback) {

    sql = 'delete from ${tabla} where id = UUID_TO_BIN(?)';

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

        callback(null,{id: id, status: 'Registro eliminado.'});

      });
  }

  module.exports.seleccionarTabla = seleccionarTabla;
  module.exports.seleccionarRegistro = seleccionarRegistro;
  module.exports.insertarRegistro = insertarRegistro;
  module.exports.actualizarRegistro = actualizarRegistro;
  module.exports.eliminarRegistro = eliminarRegistro;`

  fs.writeFileSync(nombreArchivo,codigo);

}

function generar(directorio,tablas) {

    if (!fs.existsSync(directorio+'/modelo')) {
        fs.mkdirSync(directorio+'/modelo');
    }

    tablas.forEach(element => {
      generaDAO(directorio,element.esquema,element.tabla);
    });

}

module.exports.generar = generar;
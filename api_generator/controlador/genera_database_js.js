const fs = require('fs');

function generar(directorio,db_config) {

    if (!fs.existsSync(directorio+'/modelo')) {
        fs.mkdirSync(directorio+'/modelo');
    }
    
    let nombreArchivo = directorio+'/modelo/database.js';

    console.log('Genera: ' + nombreArchivo);

    let codigo = 
    `
    const mysql = require('mysql');

    // Define una nueva conexion
    const conexion = mysql.createConnection({
      host: '${db_config.host}',
      user: '${db_config.user}',
      password: '${db_config.password}',
      database: '${db_config.database}'
    });
    
    // verifica errores
    conexion.connect(function(err) {
      if (err) {
          console.error('Error connecting: ' + err.stack);
          return;
      }
    
      console.log('Connected as id ' + conexion.threadId);
    });
    
    exports.conexion = conexion;
    `

    fs.writeFileSync(nombreArchivo,codigo);

}

module.exports.generar = generar;

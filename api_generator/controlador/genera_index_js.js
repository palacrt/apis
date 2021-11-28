const fs = require('fs');

function routers(tablas) {
    let bloque = '';

    tablas.forEach(element => {
        bloque += `   app.use(require('./controlador/${element.tabla}Router'));\n`
    });

    return bloque;

}

function generar(directorio,puerto,tablas) {

    let nombreArchivo = directorio+'/index.js';

    console.log('Genera: ' + nombreArchivo);

    let codigo = 
    `
    const express = require('express');
    const app = express();

    const cors = require('cors');
    app.use(cors());

    // Settings
    app.set('port', ${puerto});

    // Middlewares
    app.use(express.json());

    // Routes
    ${routers(tablas)}

    // Starting the server
    app.listen(app.get('port'), () => {
      console.log('Server on port ' + app.get('port'));
    });`

    fs.writeFileSync(nombreArchivo,codigo);

}

module.exports.generar = generar;
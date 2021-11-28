const fs = require('fs');

function generar(directorio) {

    let nombreArchivo = directorio+'/package.json';

    console.log('Genera: ' + nombreArchivo);

    let codigo =
    `
    {
      "dependencies": {
        "cors": "^2.8.5",
        "express": "^4.17.1",
        "express-myconnection": "^1.0.4",
        "mysql": "^2.18.1",
        "uuid": "^8.3.2"
      }
    }

    `

    fs.writeFileSync(nombreArchivo,codigo);

}

module.exports.generar = generar;

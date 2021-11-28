const fs = require('fs');
const prompt = require('prompt-sync')();

const gen_pkg = require('./controlador/genera_package_json');
const gen_index = require('./controlador/genera_index_js');
const gen_database = require('./controlador/genera_database_js');
const gen_dao = require('./controlador/genera_dao_js');
const gen_router = require('./controlador/genera_router_js');

let directorio = __dirname + '/api';
let puerto = '4000';

let db_config = {
    host: 'DESKTOP-O4G12LB.local',
    user: 'root',
    password: 'root',
    database: 'tiendagenericav2'
}

let tablas = []  

function agregarTabla() {

    let esquema = prompt(`Digite el esquema ( ${db_config.database} ): `).toLowerCase().trim() || db_config.database;
    let tabla = prompt('Digite el nombre de la tabla: ').toLowerCase().trim();

    tablas.push({esquema,tabla});

    console.log(tablas);

}

function configurar() {

    directorio =  prompt(`Digite el directorio de generacion ( ${directorio} ): `).toLowerCase().trim() || directorio;
    puerto =  prompt(`Digite el puerto de la API ( ${puerto} ): `).toLowerCase().trim() || puerto;
    db_config.host = prompt(`Digite el host ( ${db_config.host} ): `).toLowerCase().trim() || db_config.host;
    db_config.user = prompt(`Digite el usuario ( ${db_config.user} ): `).toLowerCase().trim() || db_config.user;
    db_config.password = prompt(`Digite el password ( ${db_config.password} ): `).toLowerCase().trim() || db_config.password;
    db_config.database = prompt(`Digite el nombre de la BD ( ${db_config.database} ): `).toLowerCase().trim() || db_config.database;

    console.log(db_config);

}

function generar () {

    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio);
    }

    gen_pkg.generar(directorio);
    gen_index.generar(directorio,puerto,tablas);
    gen_database.generar(directorio,db_config);
    gen_dao.generar(directorio,tablas);
    gen_router.generar(directorio,tablas);
}

let opcion = '';

do {

    let mensaje_opciones =
    `
    1. Configuracion Proyecto y BD
    2. Agregar tabla
    3. Generar API
    4. Salir
    `;

    console.log(mensaje_opciones);
    opcion = prompt('Digite opcion: ');

    switch (opcion) {
        case '1':
            configurar();
            break;
        case '2':
            agregarTabla();
            break;
        case '3':
            generar();
            break;    
        case '4':
            console.log('Adiós!')
            break;                
    }

} while (opcion != '4');
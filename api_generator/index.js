const prompt = require('prompt-sync')();

let esquema = prompt('Digite el esquema').toLowerCase().trim();
let tabla = prompt('Digite el nombre de la tabla: ').toLowerCase().trim();

console.log(`El nombre de la tabla es: ${tabla}`);
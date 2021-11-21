const { createConnection } = require ('mysql');

// Define una nueva conexion
const conexion = createConnection({
  host: 'DESKTOP-O4G12LB.local',
  user: 'root',
  password: 'root',
  database: 'tiendagenericav2'
});

// verifica errores
conexion.connect(function(err) {
  if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
  }

  console.log('Connected as id ' + conexion.threadId);
});

module.exports.conexion = conexion;
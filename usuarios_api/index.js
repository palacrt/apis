
    const express = require('express');
    const app = express();

    const cors = require('cors');
    app.use(cors());

    // Settings
    app.set('port', 4040);

    // Middlewares
    app.use(express.json());

    // Routes
       app.use(require('./controlador/usuariosRouter'));


    // Starting the server
    app.listen(app.get('port'), () => {
      console.log('Server on port ' + app.get('port'));
    });
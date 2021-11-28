const fs = require('fs');
const camposDAO = require('../modelo/camposDAO')

function generaListaCampos(campos,usa_id = true) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);
    if (elemento.codigo_llave != 'PRI' || usa_id) {
      lista += elemento.campo;
      if (! esUltimoElemento) {
        lista += ',';
      }
      else {
        lista += ' ';
      }
    }


  })

  return lista;
}

function generaListaCamposObjeto(campos,genera_uuid = false) {

  let ultimoElemento = campos.at(-1);

  let lista = ' ';

  campos.forEach((elemento) => {
    let esUltimoElemento = (elemento === ultimoElemento);

    if (elemento.codigo_llave == 'PRI' && genera_uuid) {
      lista += `${elemento.campo}: uuid()`;
    }
    else {
      lista += `${elemento.campo}: ${elemento.campo}`;
    }

    if (! esUltimoElemento) {
      lista += ', ';
    }
    else {
      lista += ' ';
    }
  })

  return lista;

}




function generaRouter(directorio,esquema,tabla) {

  let campos = camposDAO.seleccionar(esquema,tabla);

  console.log(campos);

  let nombreArchivo = directorio+'/controlador/'+ tabla + 'Router.js';

  console.log('Genera: ' + nombreArchivo);

  let codigo =
  `
  const express = require('express');
  const router = express.Router();
  const {v1: uuid} = require('uuid');
  const ${tabla}DAO = require('../modelo/${tabla}DAO');

  const STATUS_OK = 200;
  const STATUS_NOT_FOUND = 404;
  const STATUS_INTERNAL_ERROR = 500;

  // GET: Seleccionar Datos
  router.get('/', (req, res) => {
    ${tabla}DAO.seleccionarTabla((err,datos) => {

      if (err) {
        // Devuelve mensaje de error
        res.status(STATUS_INTERNAL_ERROR).json({message: err.message || 'Error al seleccionar datos'});
        return;
      }

      // Devuelve informacion
      console.log(datos);
      res.status(STATUS_OK).json(datos);

    });

  });

  // GET: Seleccionar un solo Dato por Id
  router.get('/:id', (req, res) => {
      const { id } = req.params;
      ${tabla}DAO.seleccionarRegistro(id,(err,dato) => {

        if (err) {
          if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
            // Error del usuario
            res.status(STATUS_NOT_FOUND);
          } else {
            // Error de sistema
            res.status(STATUS_INTERNAL_ERROR);
          }
          res.json({message: err.message || 'Error al seleccionar dato'});
          return;
        }

        // Devuelve informacion
        res.status(STATUS_OK).json(dato);

      });
    });

  // DELETE: Eliminar un Dato por Id
  router.delete('/:id', (req, res) => {

    if (!req.params.id) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'Se debe enviar el parametro id'});
      return;
    }

    const { id } = req.params;
    ${tabla}DAO.eliminarRegistro(id,(err,resultado) => {
      if (err) {
        if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
          // Error del usuario
          res.status(STATUS_NOT_FOUND);
        } else {
          // Error de sistema
          res.status(STATUS_INTERNAL_ERROR);
        }
        res.json({message: err.message || 'Error al eliminar dato'});
        return;
      }

      // Devuelve resultado
      res.status(STATUS_OK).json(resultado);
    });
  });

  // POST: Insertar un dato
  router.post('/', (req, res) => {

    if (!req.body) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'El cuerpo de la petición no puede estar vacía!'});
      return;
    }

    const {${generaListaCampos(campos)}} = req.body;

    const dato = { ${generaListaCamposObjeto(campos)} };

    console.log(dato);

    ${tabla}DAO.insertarRegistro(dato,(err,resultado) => {

      if (err) {
        res.status(STATUS_INTERNAL_ERROR);
        res.json({message: err.message || 'Error al insertar dato.'});
      }

      // Devuelve Resultado
      res.status(STATUS_OK);
      res.json(resultado);

    }); 

  });

  // PUT: Actualizar un dato
  router.put('/:id', (req, res) => {

    if (!req.params.id) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'Se debe enviar el parametro id'});
      return;
    }

    if (!req.body) {
      // verifica que llegue el cuerpo de la petición
      res.status(STATUS_NOT_FOUND);
      res.json({message: 'El cuerpo de la petición no puede estar vacía!'});
      return;
    }

    const {${generaListaCampos(campos,false)}} = req.body;
    const { id } = req.params;

    const dato = { ${generaListaCamposObjeto(campos)} };

    console.log(dato);
    ${tabla}DAO.actualizarRegistro(dato,(err,resultado) => {

      if (err) {
        if (err.code == 'ER_WRONG_VALUE_FOR_TYPE' || err.code == 'NOT_FOUND') {
          // Error del usuario
          res.status(STATUS_NOT_FOUND);
        } else {
          // Error de sistema
          res.status(STATUS_INTERNAL_ERROR);
        }

        res.json({message: err.message || 'Error al eliminar dato'});
        return;

      }

      res.status(STATUS_OK).json(resultado);

    });

  });

  module.exports = router;`

  fs.writeFileSync(nombreArchivo,codigo);

}

function generar(directorio,tablas) {

    if (!fs.existsSync(directorio+'/controlador')) {
        fs.mkdirSync(directorio+'/controlador');
    }

    tablas.forEach(element => {
      generaRouter(directorio,element.esquema,element.tabla);
    });

}

module.exports.generar = generar;
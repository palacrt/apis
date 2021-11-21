const express = require('express');
const router = express.Router();
const { seleccionarTabla, seleccionarRegistro } = require ('../modelo/listasDAO');

// GET: Seleccionar Datos 
router.get('/:lista', (req, res) => {
  const { lista } = req.params;
  seleccionarTabla(lista,(datos) => {
    //console.log(datos);
    res.status(200);
    res.json(datos);
  });

});

// GET: Seleccionar un solo Dato por Id
router.get('/:lista/:id', (req, res) => {
    const { lista, id } = req.params;
    seleccionarRegistro(lista,id,(dato) => {
        res.json(dato);
    });
  });

module.exports = router;
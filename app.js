const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const app = express();
const db = new Datastore({ filename: 'database.db', autoload: true });

// Utilizamos el middleware de bodyParser para parsear JSON
app.use(bodyParser.json());

// Ruta para recibir JSON genérico
app.post('/receive-json', (req, res) => {
  // Tu objeto JSON se encuentra ahora en req.body
  const receivedJSON = req.body;

  console.log("JSON recibido:", receivedJSON);

  // Insertar el JSON recibido en la base de datos NeDB
  db.insert(receivedJSON, (err, newDoc) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      res.status(500).json({ message: 'Error al insertar en la base de datos' });
    } else {
      console.log('Insertado en la base de datos:', newDoc);
      res.json({ message: 'JSON recibido y almacenado correctamente' });
    }
  });
});

// Iniciar el servidor en el puerto 3000
app.listen(5000, () => {
  console.log('Servidor iniciado en http://localhost:5000');
});
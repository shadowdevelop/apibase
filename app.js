const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('nedb');

const app = express();
const db = new Datastore({ filename: 'reporteador.db', autoload: true });
// Utilizamos el middleware de bodyParser para parsear JSON
app.use(bodyParser.json());

app.get('/tipo-sensor/reporte/:tipoId', (req, res) => {
  const tipoId = req.params.tipoId;

  db.find({TipoSensor:tipoId}, (err, records) => {
    if (err) {
      console.error('Error al obtener los datos por tipo de sensor:', err);
      res.status(500).json({ message: 'Error al obtener los datos por tipo de sensor' });
    } else {
      console.log('datos recuperados:', records);
      res.json(records);
    }
  });
});


app.get('/tipo-sensor/reporte-fecha/:fechaInicio/:fechaFin', (req, res) => {
  const fechaIni = req.params.fechaInicio;
  const fechaFin = req.params.fechaFin;

  db.find({ $where: function () { return this.Fecha >= fechaIni && this.Fecha <= fechaFin; } }, (err, records) => {
    if (err) {
      console.error('Error al obtener los datos por fecha:', err);
      res.status(500).json({ message: 'Error al obtener los datos por fecha' });
    } else {
      console.log('datos recuperados:', records);
      res.json(records);
    }
  });
});


app.post('/tipo-sensor', (req, res) => {
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
const port=process.env.PORT ||  5000;
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
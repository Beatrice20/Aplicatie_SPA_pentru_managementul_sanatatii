// Permite incarcarea variabilelor de mediu din fisierul .env
const dotenv = require('dotenv');
dotenv.config();

// Importuri pentru crearea serverului Express
const express = require("express");
const app = express();

// Permite frontend-ului sa faca request-uri catre server, chiar daca se afla pe un domeniu diferit
const cors = require('cors');
// Aplica middleware-ul CORS la toate rutele Express
app.use(cors());

// Initializarea si configurarea Firebase Admin SDK
const admin = require('firebase-admin');
// Datele de autentificare pentru Firebase
const serviceAccount = require("./proiect-tic-96c8f-firebase-adminsdk.json");
// Initializarea Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Pentru a accesa functionalitatile Firestore direct
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

// Middleware pentru analiza cererilor JSON și URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurarea portului și pornirea serverului
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server a pornit pe portul ${PORT}...`);
});

// Middleware pentru verificare autentificarii
const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "Acces neautorizat. Autentificare necesara." });
    }
    await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
    next(); // transmite controlul urmatoarei functii middelware; altfel cererea ramane suspendata
  } catch (error) {
      if (error.code === 'auth/id-token-revoked') {
        return res.status(403).send({ message: "Token invalid sau revocat." });
    } else if (error.code === 'auth/id-token-expired') {
        return res.status(403).send({ message: "Token expirat." });
    } else {
        console.error("Eroare de server:", error);
        return res.status(500).send({ message: "Eroare de server." });
    }
  }
};

//Medici
// Ruta pentru crearea unui medic
const createMedic = require('./medici/createMedic');
app.post('/createMedic', checkAuth, createMedic);

// Ruta pentru citirea informatiilor generale despre medici (nume si program lucru)
const readMediciGeneral = require('./medici/readMediciGeneral');
app.get('/read/mediciFamilieGeneral', readMediciGeneral);

// Ruta pentru citirea unui medic specific
const readMedicById = require('./medici/readMedicById');
app.get('/read/mediciFamilie/:medicId', checkAuth, readMedicById);

// Ruta pentru actualizarea datelor unui medic
const updateMedic = require('./medici/updateMedic');
app.put('/update/mediciFamilie/:medicId', checkAuth, updateMedic);

// Ruta pentru ștergerea unui medic și a pacienților săi
const deleteMedic = require('./medici/deleteMedic');
app.delete('/delete/mediciFamilie/:medicId', checkAuth, deleteMedic);

// Pacienti
// Ruta pentru adăugarea unui pacient
const createPacient = require('./pacienti/createPacient');
app.post('/createPacient/mediciFamilie/:medicId/pacienti', checkAuth, createPacient);

// Ruta pentru citirea informatiilor generale despre pacientiu unui medic (nume si telefon)
const readPacientiGeneral = require('./pacienti/readPacientiGeneral');
app.get('/readPacientiGeneral/mediciFamilie/:medicId/pacienti', readPacientiGeneral);

// Ruta pentru citirea datelor unui pacient al unui medic
const readPacientById = require('./pacienti/readPacientById');
app.get('/readPacientById/mediciFamilie/:medicId/pacienti/:pacientId', checkAuth, readPacientById);

// Ruta pentru actualizarea unui pacient
const updatePacient = require('./pacienti/updatePacient');
app.put('/updatePacient/mediciFamilie/:medicId/pacienti/:pacientId', checkAuth, updatePacient);

// Ruta pentru ștergerea unui pacient
const deletePacient = require('./pacienti/deletePacient');
app.delete('/deletePacient/mediciFamilie/:medicId/pacienti/:pacientId', checkAuth, deletePacient);
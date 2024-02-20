const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const { validateName, validateAddress, validatePhoneNumber, validateMedicalHistory, validateBirthDate } = require('../data/validateData.js');

const createPacient = async (req, res) => {
    try {
        const medicId = req.params.medicId;

        if (!req.body.nume || !req.body.adresa || !req.body.gen || !req.body.dataNasterii || 
                                        !req.body.telefon || !req.body.istoricMedical) {
            return res.status(400).send({ message: "Toate campurile sunt obligatoriu de completat!" });
        }

         // Validare nume - contine caractere (litere si spatii)
         let validationResult = validateName(req.body.nume);
         if (validationResult !== true) {
             return res.status(400).send({ message: validationResult });
         }
         // Validare adresa
         validationResult = validateAddress(req.body.adresa);
         if (validationResult !== true) {
             return res.status(400).send({ message: validationResult });
         }
         // Validare telefon
        validationResult = validatePhoneNumber(req.body.telefon);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }
        // Validare istoric medical
        validationResult = validateMedicalHistory(req.body.istoricMedical);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }
        // Validare data nasterii
        validationResult = validateBirthDate(req.body.dataNasterii);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        const pacientJson = {
            nume: req.body.nume,
            adresa: req.body.adresa,
            gen: req.body.gen,
            dataNasterii: req.body.dataNasterii,
            telefon: req.body.telefon,
            istoricMedical: req.body.istoricMedical
        };
        // Verific daca medicul exista 
        const medicRef = db.collection("mediciFamilie").doc(medicId);
        const medicDoc = await medicRef.get();

        if (!medicDoc.exists) {
            return res.status(404).send({
                message: "Medicul nu a fost gasit"
            });
        }

        // Adaug pacientul in subcolectia de pacienti a medicului 
        const pacientRef = await medicRef.collection("pacienti").add(pacientJson);
        const pacientId = pacientRef.id;

        res.status(201).json({
            message: "Pacient adaugat cu succes",
            pacientId: pacientId
        });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la adaugarea pacientului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = createPacient;
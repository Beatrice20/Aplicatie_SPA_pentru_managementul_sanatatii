const { getFirestore } = require('firebase-admin/firestore');
// Obținerea referinței Firestore
const db = getFirestore();

const { validateName, validateAddress, validateWorkingHours, validateEmail, validatePhoneNumber } =
    require('../data/validateData.js');

const createMedic = async (req, res) => {
    try {
        // Verific existenta datelor obligatorii
        if (!req.body.nume || !req.body.adresaCabinet || !req.body.programLucru || !req.body.email || !req.body.telefon) {
            return res.status(400).send({ message: "Datele obligatorii pentru crearea unui medic lipsesc." });
        }

        // Validare nume - contine caractere (litere si spatii)
        let validationResult = validateName(req.body.nume);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        // Validare adresa
        validationResult = validateAddress(req.body.adresaCabinet);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        // Validare program lucru
        validationResult = validateWorkingHours(req.body.programLucru);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        // Validare email
        validationResult = validateEmail(req.body.email);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        // Validare telefon
        validationResult = validatePhoneNumber(req.body.telefon);
        if (validationResult !== true) {
            return res.status(400).send({ message: validationResult });
        }

        const medicJson = {
            nume: req.body.nume,
            adresaCabinet: req.body.adresaCabinet,
            programLucru: req.body.programLucru,
            email: req.body.email,
            telefon: req.body.telefon
        };
        const response = await db.collection("mediciFamilie").add(medicJson);
        res.status(201).json({
            message: "Medic creat cu succes",
            medicId: response.id,
            medicData: medicJson 
        });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la crearea medicului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = createMedic;
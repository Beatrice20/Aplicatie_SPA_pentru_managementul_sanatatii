const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const { validateAddress, validateEmail, validateWorkingHours, validatePhoneNumber } = require('../data/validateData.js');

const updateMedic = async (req, res) => {
    try {
        const medicId = req.params.medicId;
        const updateData = {};
        let validationResponse;

        // Verific ce campuri sunt furnizate pentru actualizare si le adaug in obiectul updateData
        // Validez programul de lucru
        if (req.body.programLucru) {
            validationResponse = validateWorkingHours(req.body.programLucru);
            if (validationResponse !== true) {
                return res.status(400).send({ message: validationResponse });
            }
            updateData.programLucru = req.body.programLucru;
        }
        // Validez adresa cabinetului
        if (req.body.adresaCabinet) {
            validationResponse = validateAddress(req.body.adresaCabinet);
            if (validationResponse !== true) {
                return res.status(400).send({ message: validationResponse });
            }
            updateData.adresaCabinet = req.body.adresaCabinet;
        }
        // Validez telefonul
        if (req.body.telefon) {
            validationResponse = validatePhoneNumber(req.body.telefon);
            if (validationResponse !== true) {
                return res.status(400).send({ message: validationResponse });
            }
            updateData.telefon = req.body.telefon;
        }
        // Validez emailul
        if (req.body.email) {
            validationResponse = validateEmail(req.body.email);
            if (validationResponse !== true) {
                return res.status(400).send({ message: validationResponse });
            }
            updateData.email = req.body.email;
        }

        // Actualizez documentul in Firestore
        await db.collection("mediciFamilie").doc(medicId).update(updateData);

        res.status(200).send({
            message: "Datele medicului au fost actualizate cu succes"
        });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la actualizarea datelor medicului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = updateMedic;
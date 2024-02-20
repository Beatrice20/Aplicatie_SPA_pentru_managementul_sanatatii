const { getFirestore } = require('firebase-admin/firestore');
// Obtin referințta Firestore
const db = getFirestore();

const { validateAddress, validatePhoneNumber, validateMedicalHistory } = require('../data/validateData.js');

const updatePacient = async (req, res) => {
    try {
        const { medicId, pacientId } = req.params;

        // Verific daca medicul si pacientul exista
        const medicRef = db.collection("mediciFamilie").doc(medicId);
        const medicDoc = await medicRef.get();
        if (!medicDoc.exists) {
            return res.status(404).send({ message: "Medicul nu a fost gasit" });
        }

        const pacientRef = medicRef.collection("pacienti").doc(pacientId);
        const pacientDoc = await pacientRef.get();
        if (!pacientDoc.exists) {
            return res.status(404).send({ message: "Pacientul nu a fost găsit" });
        }

        const updateData = {};
        // Validez datele care pot fi actualizate
        if (req.body.telefon) {
            let validationResult = validatePhoneNumber(req.body.telefon);
            if (validationResult !== true) {
                return res.status(400).send({ message: validationResult });
            }
            updateData.telefon = req.body.telefon;
        }
        if (req.body.adresa) {
            let validationResult = validateAddress(req.body.adresa);
            if (validationResult !== true) {
                return res.status(400).send({ message: validationResult });
            }
            updateData.adresa = req.body.adresa;
        }
        if (req.body.istoricMedical) {
            let validationResult = validateMedicalHistory(req.body.istoricMedical);
            if (validationResult !== true) {
                return res.status(400).send({ message: validationResult });
            }
            updateData.istoricMedical = req.body.istoricMedical;
        }

        // Actualizez datele pacientului
        await pacientRef.update(updateData);
        res.status(200).send({ message: "Datele pacientului au fost actualizate cu succes" });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la actualizarea datelor pacientului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = updatePacient;
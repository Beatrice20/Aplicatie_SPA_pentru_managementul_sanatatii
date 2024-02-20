const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const readPacientById = async (req, res) => {
    try {
        const medicId = req.params.medicId;
        const pacientId = req.params.pacientId;

        // Verific daca medicul exista
        const medicRef = db.collection("mediciFamilie").doc(medicId);
        const medicDoc = await medicRef.get();
        if (!medicDoc.exists) {
            return res.status(404).send({
                message: "Medicul nu a fost găsit"
            });
        }

        // Obtin detaliile pacientului
        const pacientRef = medicRef.collection("pacienti").doc(pacientId);
        const pacientDoc = await pacientRef.get();
        if (!pacientDoc.exists) {
            return res.status(404).send({
                message: "Pacientul nu a fost găsit"
            });
        }
        res.json(pacientDoc.data());
    } catch (error) {
        res.status(500).send({
            message: "Eroare la extragerea detaliilor pacientului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = readPacientById;

const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const readMedicById = async (req, res) => {
    try {
        const medicId = req.params.medicId;
        const doc = await db.collection("mediciFamilie").doc(medicId).get();

        if (!doc.exists) {
            res.status(404).send({
                message: "Medicul nu a fost găsit"
            });
        } else {
            res.json(doc.data());
        }
    } catch (error) {
        res.status(500).send({
            message: "Eroare la extragerea datelor pentru medicul specificat",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = readMedicById;
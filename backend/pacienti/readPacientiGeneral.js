const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const readPacientiGeneral = async (req, res) => {
    try {
        const medicId = req.params.medicId;

        // Verific daca medicul exista
        const medicRef = db.collection("mediciFamilie").doc(medicId);
        const medicDoc = await medicRef.get();
        if (!medicDoc.exists) {
            return res.status(404).send({
                message: "Medicul nu a fost găsit"
            });
        }

        // Obtin pentru pacientii medicului numele si telefonul
        const pacienti = [];
        const pacientiSnapshot = await medicRef.collection("pacienti").get();
        pacientiSnapshot.forEach(doc => {
            const pacientData = doc.data();
            pacienti.push({
                id: doc.id,
                nume: pacientData.nume, 
                telefon: pacientData.telefon 
            });
        });

        res.json(pacienti);
    } catch (error) {
        res.status(500).send({
            message: "Eroare la extragerea datelor pacientilor",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = readPacientiGeneral;

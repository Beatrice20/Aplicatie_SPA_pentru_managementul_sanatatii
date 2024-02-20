const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const deletePacient = async (req, res) => {
    try {
        const { medicId, pacientId } = req.params;

        // Verific daca medicul exista
        const medicRef = db.collection("mediciFamilie").doc(medicId);
        const medicDoc = await medicRef.get();
        if (!medicDoc.exists) {
            return res.status(404).send({ message: "Medicul nu a fost gasit" });
        }

        // Verific daca pacientul exista in sub-colectia de pacienti a medicului
        const pacientRef = medicRef.collection("pacienti").doc(pacientId);
        const pacientDoc = await pacientRef.get();
        if (!pacientDoc.exists) {
            return res.status(404).send({ message: "Pacientul nu a fost găsit" });
        }

        // Sterg pacientul
        await pacientRef.delete();

        res.send({ message: "Pacientul a fost sters cu succes" });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la stergerea pacientului",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = deletePacient;
const { getFirestore } = require('firebase-admin/firestore');
// Obtin referinta Firestore
const db = getFirestore();

const deleteMedic = async (req, res) => {
    try {
        const medicId = req.params.medicId;

        // Obtin referinta sub-colectiei de pacienti
        const pacientiRef = db.collection("mediciFamilie").doc(medicId).collection("pacienti");

        // Sterg fiecare pacient din sub-colectie
        const pacientiSnapshot = await pacientiRef.get();
        const deletePromises = pacientiSnapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        // Dupa ce toti pacientii au fost stersi, sterg medicul
        await db.collection("mediciFamilie").doc(medicId).delete();

        res.send({
            message: "Medicul si pacientii sai au fost stersi cu succes"
        });
    } catch (error) {
        res.status(500).send({
            message: "Eroare la stergerea medicului si a pacientilor sai.",
            error: error.message
        });
    }
};

// Export functia pentru a o folosi in fisierul index.js
module.exports = deleteMedic;
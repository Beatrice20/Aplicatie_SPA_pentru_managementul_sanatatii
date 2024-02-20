const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const readMediciGeneral = async (req, res) => {
    try {
        const mediciGeneral = [];
        const response = await db.collection("mediciFamilie").get();
        
        response.forEach(doc => {
            const data = doc.data();
            const medicGeneral = {
                id: doc.id,
                nume: data.nume,
                programLucru: data.programLucru
            };
            mediciGeneral.push(medicGeneral);
        });

        res.json(mediciGeneral);
    } catch (error) {
        res.status(500).send({
            message: "Eroare la extragerea datelor generale despre medici.",
            error: error.message
        });
    }
};

module.exports = readMediciGeneral;

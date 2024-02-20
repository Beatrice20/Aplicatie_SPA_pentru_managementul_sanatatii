const { faker } = require('@faker-js/faker');
const admin = require('firebase-admin');
const serviceAccount = require('../proiect-tic-96c8f-firebase-adminsdk.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

function generatePhoneNumber() {
    let phoneNumber = '07';
    for (let i = 0; i < 8; i++) {
        phoneNumber += faker.number.int(9).toString();
    }
    return phoneNumber;
  }

function generateWorkingHours() {
    // Generez o ora de incepere intre 07:00 si 16:00 
    const startHour = faker.number.int({ min: 7, max: 16 });
    // Generez o durata de lucru astfel incat ora de sfarsit <= 20:00
    const latestEndHour = 20;
    const maxDuration = latestEndHour - startHour;
    const duration = faker.number.int({ min: 4, max: maxDuration });
    // Calculez ora de sfarsit
    const endHour = startHour + duration;
    // Formatează orele hh:mm
    const formattedStartHour = startHour.toString().padStart(2, '0') + ":00";
    const formattedEndHour = endHour.toString().padStart(2, '0') + ":00";
    return `${formattedStartHour} - ${formattedEndHour}`;
}

function generateBirthDate() {
    // Generez o dată de nastere cu cel mult 70 de ani in urma de la data curenta
    const birthDate = faker.date.past({years:70});
    // Formatez data YYYY-MM-DD
    return birthDate.toISOString().split('T')[0];
}

function generateDiseaseName() {
    const diseases = [
        "Hipertensiune arteriala",
        "Diabet zaharat",
        "Astm bronsic",
        "Bronsita cronica",
        "Artrita reumatoida",
        "Osteoporoza",
        "Anemie",
        "Ulcer gastric",
        "Hipotiroidism",
        "Hipertiroidism",
        "Glaucom",
        "Insuficienta cardiaca",
        "Pneumonie",
        "Fibromialgie",
        "Dermatita",
        "Migrena",
        "Epilepsie",
        "Hepatita",
        "Cancer",
        "Tuberculoza",
        "Gastrita",
        "Pancreatita",
        "Colita ulcerativa",
        "Psoriazis",
        "Lupus",
        "Boala Parkinson",
        "Alzheimer",
        "Angina pectorala",
        "Aritmie",
        "Nu este in evidenta cu vreo boala"
    ];
    return faker.helpers.arrayElement(diseases);
}

async function generateAndInsertData() {
    for (let i = 0; i < 10; i++) {
        // Generez un medic
        const fullName = faker.person.fullName().replace(/[^a-zA-Z ]/g, '')
        const medic = {
            nume: fullName, 
            programLucru: generateWorkingHours(),
            telefon: generatePhoneNumber(), 
            email: (() => {
                const [firstName, lastName] = fullName.split(' ');
                const emailDomain = faker.helpers.arrayElement(['yahoo.com', 'gmail.com']);
                const separators = ['.', '-', '_']; 
                const randomSeparator = faker.helpers.arrayElement(separators); 
                return `${firstName.toLowerCase()}${randomSeparator}${lastName.toLowerCase()}@${emailDomain}`;
            })(),  //perechea de paranteze pentru a executa imediat functia definita
            adresaCabinet: `${faker.location.streetAddress()}, ${faker.location.city()}`
        };
        // Inserez medicul in baza de date
        const medicRef = await db.collection("mediciFamilie").add(medic);
        // Generez pacienți pentru fiecare medic
        for (let j = 0; j < 7; j++) {
            const pacient = {
                nume: faker.person.fullName(),
                telefon: generatePhoneNumber(),
                gen: faker.helpers.arrayElement(["masculin", "feminin"]),
                dataNasterii: generateBirthDate(),
                istoricMedical: generateDiseaseName(),
                adresa: `${faker.location.streetAddress()}, ${faker.location.city()}`
            };
            // Inserez pacientul in sub-colectia de pacienti a medicului
            await medicRef.collection("pacienti").add(pacient);
        }
    }
}
generateAndInsertData().then(() => console.log("Datele au fost generate și inserate cu succes."));

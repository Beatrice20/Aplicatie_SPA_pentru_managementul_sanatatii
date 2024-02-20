function validateName(fullName) {
    // Verific daca numele este nevid
    if (!fullName) {
        return "Numele nu poate fi gol.";
    }
    // Verific daca numele contine doar litere si spatii
    if (!/^[A-Za-z\s]+$/.test(fullName)) {
        return "Numele poate contine doar litere si spatii.";
    }
    // Verific daca fiecare cuvant incepe cu litera mare
    const names = fullName.split(" ");
    for (let name of names) {
        if (!/^[A-Z][a-z]+$/.test(name)) {
            return "Fiecare cuvant din numele complet trebuie sa inceapa cu o litera mare si sa fie urmat doar de litere mici.";
        }
    }
    return true;
}

function validateAddress(address) {
    if (!address) {
        return "Adresa nu poate fi goală.";
    }
    // Validarea adresei - accepta litere mari/mici, cifre, spatii si virgule
    if (!/^[A-Za-z0-9\s,]+$/.test(address)) {
        return "Adresa poate conține doar litere, cifre, spații și virgule.";
    }
    return true;
}

function validateWorkingHours(workingHours) {
    if (!workingHours) {
        return "Programul de lucru nu poate fi gol.";
    }
    // Verific formatul programului hh:mm - hh:mm
    const formatPattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9]) - ([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!formatPattern.test(workingHours)) {
        return "Programul de lucru trebuie sa fie in formatul hh:mm - hh:mm.";
    }
    // Extrag orele si minutele
    const [startTime, endTime] = workingHours.split(" - ");
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    // Verific daca programul de lucru este in intervalul 07:00 - 20:00
    if (startHours < 7 || (endHours > 20 || (endHours === 20 && endMinutes > 0))) {
        return "Programul de lucru trebuie sa fie intre 07:00 si 20:00.";
    }
    // Verific daca ora de incepere < ora de incheiere
    if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
        return "Ora de inceput trebuie sa fie mai mica decat ora de sfarsit.";
    }
    return true;
}

function validateEmail(email) {
    if (!email) {
        return "Adresa de email nu poate fi vida.";
    }
    // Verific formatul general al adresei de email
    const formatPattern = /^[a-zA-Z0-9._-]+@/;
    if (!formatPattern.test(email)) {
        return "Adresa de email accepta doar litere, cifre, si caracterele '-', '.', '_'.";
    }
    // Verific domeniul adresei de email
    const domainPattern = /@(yahoo\.com|gmail\.com)$/;
    if (!domainPattern.test(email)) {
        return "Adresa de email trebuie să aiba domeniul @yahoo.com sau @gmail.com.";
    }
    return true;
}

function validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return "Numarul de telefon nu poate fi vid.";
    }
    // Verific daca numarul de telefon incepe cu caracterele "07"
    if (!phoneNumber.startsWith('07')) {
        return "Numarul de telefon trebuie sa inceapa cu caracterele '07'.";
    }
    // Verific daca numarul de telefon are 10 caractere
    if (phoneNumber.length !== 10) {
        return "Numarul de telefon trebuie sa aiba exact 10 cifre.";
    }
    // Verific daca toate caracterele sunt cifre
    if (!/^\d+$/.test(phoneNumber)) {
        return "Numarul de telefon poate contine doar cifre.";
    }
    return true;
}

function validateMedicalHistory(medicalHistory) {
    if (!medicalHistory) {
        return "Istoricul medical nu poate fi gol.";
    }
    const pattern = /^[A-Za-z ,.-]+$/;
    if (!pattern.test(medicalHistory)) {
        return "Istoricul medical poate contine doar litere si caractere de punctuatie de baza (spatiu, virgula, punct etc.).";
    }
    return true;
}

function validateBirthDate(birthDate) {
    const formatPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!formatPattern.test(birthDate)) {
        return "Data nasterii trebuie sa fie in formatul yyyy-mm-dd.";
    }
    const [year, month, day] = birthDate.split("-").map(Number);

    const date = new Date(year, month - 1, day); // luna in JavaScript este indexata de la 0
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        return "Data nasterii nu este valida.";
    }
    const today = new Date();
    const earliestYear = 1900;
    if (date > today || year < earliestYear) {
        return `Data nasterii trebuie sa fie intre ${earliestYear}-01-01 si ${today.toISOString().split('T')[0]}.`;
    }
    return true; 
}


module.exports = {
    validateName, validateAddress, validateWorkingHours, validateEmail,
    validatePhoneNumber, validateMedicalHistory, validateBirthDate
};

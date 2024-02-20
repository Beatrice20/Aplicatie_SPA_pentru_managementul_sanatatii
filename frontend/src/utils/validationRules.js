export const reguliValidare = {
    nume: [
        (value) => !!value || 'Numele nu poate fi gol.',
        (value) => /^[A-Za-z\s]+$/.test(value) || 'Numele poate conține doar litere și spații.',
        (value) => {
            const words = value.split(" ");
            for (let word of words) {
                if (word !== '' && !/^[A-Z][a-z]*$/.test(word)) {
                    return "Fiecare cuvânt din numele complet trebuie să înceapă cu o literă mare și să fie urmat doar de litere mici.";
                }
            }
            return true;
        },
    ],
    telefon: [
        (value) => !!value || 'Numarul de telefon nu poate fi gol.',
        (value) => value.startsWith('07') || "Numarul de telefon trebuie să înceapă cu caracterele '07'.",
        (value) => value.length === 10 || 'Numarul de telefon trebuie să aibă exact 10 cifre.',
        (value) => /^\d+$/.test(value) || 'Numarul de telefon poate conține doar cifre.',
    ],
    email: [
        (value) => !!value || 'Adresa de email nu poate fi vidă.',
        (value) => /^[a-zA-Z0-9._-]+@/.test(value) || "Adresa de email acceptă doar litere mici, cifre, și caracterele '-', '.', '_'.",
        (value) => /@(yahoo\.com|gmail\.com)$/.test(value) || "Adresa de email trebuie să aibă domeniul @yahoo.com sau @gmail.com.",
    ],
    adresaCabinet: [
        (value) => !!value || 'Adresa nu poate fi goală.',
        (value) => /^[A-Za-z0-9\s,.]+$/.test(value) || "Adresa poate conține doar litere, cifre, spații și virgule.",
    ],
    programLucru: [
        (value) => !!value || 'Programul de lucru nu poate fi gol.',
        (value) => /^([0-1][0-9]|2[0-3]):([0-5][0-9]) - ([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(value) || "Programul de lucru trebuie să fie în formatul hh:mm - hh:mm.",
        (value) => {
            const [startTime, endTime] = value.split(' - ');
            if (!startTime || !endTime) {
                return false;
            }
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            const [endHours, endMinutes] = endTime.split(':').map(Number);

            if (startHours < 7 || (endHours > 20 || (endHours === 20 && endMinutes > 0))) {
                return "Programul de lucru trebuie sa fie intre 07:00 si 20:00.";
            }
            if (startHours > endHours || (startHours === endHours && startMinutes >= endMinutes)) {
                return "Ora de inceput trebuie sa fie mai mica decat ora de sfarsit.";
            }
            return true;
        },
    ],
    data: [
        value => !!value || 'Data este necesara.',
        value => /^\d{4}-\d{2}-\d{2}$/.test(value) || 'Formatul datei trebuie sa fie YYYY-MM-DD.'
    ],
    istoricMedical: [
        value => !!value || 'Istoricul medical nu poate fi gol.',
        value => /^[A-Za-z ,.-]+$/.test(value) || 'Istoricul medical poate contine doar litere, spatii, virgule, puncte si cratime.',
    ],
};
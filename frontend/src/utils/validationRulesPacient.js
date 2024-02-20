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
    adresa: [
        (value) => !!value || 'Adresa nu poate fi goală.',
        (value) => /^[A-Za-z0-9\s,.]+$/.test(value) || "Adresa poate conține doar litere, cifre, spații și virgule.",
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
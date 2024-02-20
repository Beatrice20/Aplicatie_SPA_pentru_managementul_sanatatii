export const validationRules = {
    username: [
        value => !!value || 'Numele nu poate fi gol.',
        value => /^[A-Za-z0-9\s]+$/.test(value) || 'Numele poate conține doar litere,cifre, spații.',
        value => {
            const words = value.split(" ")
            for (let word of words) {
                if (word !== '' && !/^[A-Z][a-z]*$/.test(word)) {
                    return "Fiecare cuvânt din numele complet trebuie să înceapă cu o literă mare și să fie urmat doar de litere mici."
                }
            }
            return true
        }
    ],
    email: [
        value => !!value || 'Adresa de email nu poate fi vida.',
        value => /^[a-z0-9._-]+@/.test(value) || "Adresa de email accepta doar litere mici, cifre, și caracterele '-', '.', '_'.",
        value => /@(yahoo\.com|gmail\.com)$/.test(value) || "Adresa de email trebuie să aibă domeniul @yahoo.com sau @gmail.com."
    ],
    password: [
        value => !!value || 'Parola nu poate fi goală.',
        value => value.length >= 6 || 'Parola trebuie să aibă minim 6 caractere.',
        value => /[A-Z]/.test(value) || 'Parola trebuie să conțină cel puțin o literă mare.',
        value => /[0-9]/.test(value) || 'Parola trebuie să conțină cel puțin o cifră.'
    ]
};
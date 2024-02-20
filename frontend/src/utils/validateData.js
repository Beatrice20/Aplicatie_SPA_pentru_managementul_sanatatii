export function validateData(medic, reguliValidare) {
    let esteValid = true
    for (let i in reguliValidare) {
        const reguli = reguliValidare[i]
        for (let r of reguli) {
            if (r(medic[i]) !== true) {
                esteValid = false
            }
        }
    }
    return { esteValid }
}
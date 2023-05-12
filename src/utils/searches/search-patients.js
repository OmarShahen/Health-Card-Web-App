export const searchPatients = (patient, value) => {

    const name = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const phone = `${patient.countryCode}${patient.phone}`
    const cardId = `${patient.cardId}`

    if(name.includes(value.toLowerCase())) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(cardId.includes(value)) {
        return true
    }

    return false
}

export const searchDoctors = (doctor, value) => {

    value = value.toLowerCase()
    const name = `${doctor.firstName} ${doctor.lastName}`.toLowerCase()
    const phone = `${doctor.countryCode}${doctor.phone}`
    const email = `${doctor.email}`

    if(name.includes(value)) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(email.includes(value)) {
        return true
    }

    return false
}
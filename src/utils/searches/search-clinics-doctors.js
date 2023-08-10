
export const searchClinicsDoctors = (clinicDoctor, value) => {

    value = value.toLowerCase()
    const name = `${clinicDoctor?.doctor?.firstName} ${clinicDoctor?.doctor?.lastName}`.toLowerCase()
    const email = `${clinicDoctor?.doctor?.email}`

    if(name.includes(value)) {
        return true
    } else if(email.includes(value)) {
        return true
    }

    return false
}
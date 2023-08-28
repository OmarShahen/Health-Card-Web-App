
export const searchInvitations = (invitation, value) => {

    value = value.toLowerCase()
    const email = invitation?.user?.email
    const clinicName = `${invitation?.clinic?.name}`.toLowerCase()
    const doctorName = `${invitation?.user?.firstName} ${invitation?.user?.lastName}`.toLowerCase()

    if(email.includes(value)) {
        return true
    } else if(doctorName.includes(value)) {
        return true
    } else if(clinicName.includes(value)) {
        return true
    }

    return false
}
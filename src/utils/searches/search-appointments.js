export const searchAppointments = (appointment, value) => {

    value = value.toLowerCase()
    
    const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`.toLowerCase()
    const patientPhone = `${appointment.patient.countryCode}${appointment.patient.phone}`
    const doctorName = `${appointment.doctor.firstName} ${appointment.doctor.lastName}`.toLowerCase()
    const doctorPhone = `${appointment.doctor.countryCode}${appointment.doctor.phone}`

    if(patientName.includes(value)) {
        return true
    } else if(patientPhone.includes(value)) {
        return true
    } else if(doctorName.includes(value)) {
        return true
    } else if(doctorPhone.includes(value)) {
        return true
    }

    return false
}
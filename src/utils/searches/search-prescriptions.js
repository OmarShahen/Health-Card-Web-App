export const searchPrescriptions = (prescription, value) => {

    value = value.toLowerCase()
    const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`.toLowerCase()
    const doctorName = `${prescription.doctor.firstName} ${prescription.doctor.lastName}`.toLowerCase()
    const { medicines } = prescription

    if(patientName.includes(value)) {
        return true
    } else if(doctorName.includes(value)) {
        return true
    }

    for(let i=0;i<medicines.length;i++) {
        const drug = medicines[i]
        if(drug.name.toLowerCase().includes(value)) {
            return true
        }
    }

    return false
}
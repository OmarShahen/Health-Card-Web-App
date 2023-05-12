
export const searchSymptoms = (symptom, value) => {

    value = value.toLowerCase()
    const symptomName = `${symptom.symptom}`.toLowerCase()
    const doctorName = `${symptom.doctor.firstName} ${symptom.doctor.lastName}`.toLowerCase()

    if(symptomName.includes(value)) {
        return true
    } else if(doctorName.includes(value)) {
        return true
    }

    return false
}
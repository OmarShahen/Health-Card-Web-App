export const searchEncounters = (encounter, value) => {

    value = value.toLowerCase()
    const doctorName = `${encounter.patient.firstName} ${encounter.patient.lastName}`.toLowerCase()
    const patientName = `${encounter.doctor.firstName} ${encounter.doctor.lastName}`.toLowerCase()
    const { symptoms, diagnosis, notes } = encounter

    if(doctorName.includes(value)) {
        return true
    } else if(patientName.includes(value)) {
        return true
    }

    for(let i=0;i<symptoms.length;i++) {
        const symptom = symptoms[i].toLowerCase()
        if(symptom.includes(value)) {
            return true
        }
    }

    for(let i=0;i<diagnosis.length;i++) {
        const diagnose = diagnosis[i].toLowerCase()
        if(diagnose.includes(value)) {
            return true
        }
    }

    for(let i=0;i<notes.length;i++) {
        const note = notes[i].toLowerCase()
        if(note.includes(value)) {
            return true
        }
    }

    return false
}
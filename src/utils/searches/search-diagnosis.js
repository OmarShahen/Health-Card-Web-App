
export const searchDiagnosis = (diagnose, value) => {

    value = value.toLowerCase()
    const diagnoseName = `${diagnose.diagnose}`.toLowerCase()
    const doctorName = `${diagnose.doctor.firstName} ${diagnose.doctor.lastName}`.toLowerCase()

    if(diagnoseName.includes(value)) {
        return true
    } else if(doctorName.includes(value)) {
        return true
    }

    return false
}
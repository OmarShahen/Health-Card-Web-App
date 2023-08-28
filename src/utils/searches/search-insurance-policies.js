export const searchInsurancePolicies = (insurancePolicy, value) => {

    value = value.toLowerCase()

    const patientName = `${insurancePolicy.patient.firstName} ${insurancePolicy.patient.lastName}`.toLowerCase()
    const insuranceCompanyName = insurancePolicy.insuranceCompany.name.toLowerCase()

    if(insuranceCompanyName.includes(value)) {
        return true
    } else if(patientName.includes(value)) {
        return true
    }

    return false
}
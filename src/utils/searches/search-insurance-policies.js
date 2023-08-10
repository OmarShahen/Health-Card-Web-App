export const searchInsurancePolicies = (insurancePolicy, value) => {

    if(insurancePolicy?.insuranceCompany?.name.toLowerCase().includes(value.toLowerCase())) {
        return true
    }

    return false
}
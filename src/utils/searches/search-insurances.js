export const searchInsurances = (insurance, value) => {

    if(insurance.name.toLowerCase().includes(value.toLowerCase())) {
        return true
    }

    return false
}
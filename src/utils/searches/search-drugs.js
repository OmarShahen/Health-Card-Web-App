export const searchDrugs = (drug, value) => {

    value = value.toLowerCase()
    const name = drug.name.toLowerCase()

    if(name.includes(value)) {
        return true
    }

    return false
}
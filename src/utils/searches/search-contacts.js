export const searchContacts = (contact, value) => {

    value = value.toLowerCase()
    const name = `${contact.name}`.toLowerCase()
    const phone = `${contact.countryCode}${contact.phone}`
    const relation = `${contact.relation}`.toLowerCase()

    if(name.includes(value)) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(relation.includes(value)) {
        return true
    }

    return false
}
export const searchInvoices = (invoice, value) => {

    const currentPatient = invoice.patient

    const name = `${currentPatient.firstName} ${currentPatient.lastName}`.toLowerCase()
    const phone = `${currentPatient.countryCode}${currentPatient.phone}`
    const invoiceId = `${invoice.invoiceId}`

    if(name.includes(value.toLowerCase())) {
        return true
    } else if(phone.includes(value)) {
        return true
    } else if(invoiceId.includes(value)) {
        return true
    }

    return false
}
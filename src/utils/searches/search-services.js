
export const searchServices = (service, value) => {

    value = value.toLowerCase()

    if(service.name.toLowerCase().includes(value)) {
        return true
    } 

    return false
}
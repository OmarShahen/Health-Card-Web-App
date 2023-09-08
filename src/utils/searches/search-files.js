export const searchFiles = (file, value) => {

    value = value.toLowerCase()
    const name = file.name.toLowerCase()

    if(name.includes(value)) {
        return true
    }

    return false
}
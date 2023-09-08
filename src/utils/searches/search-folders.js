export const searchFolders = (folder, value) => {

    value = value.toLowerCase()
    const name = folder.name.toLowerCase()

    if(name.includes(value)) {
        return true
    }

    return false
}
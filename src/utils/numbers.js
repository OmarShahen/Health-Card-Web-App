export const formatNumber = (number) => {
    return new Intl.NumberFormat('ar').format(number)
}

export const toIndiaDigits = (number) => {
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return number.replace(/[0-9]/g, (w) => {
     return id[+w]
    })
}
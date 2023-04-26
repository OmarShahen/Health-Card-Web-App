import moment from 'moment'

export const getAge = (dateOfBirth) => {
    return new Date().getFullYear() - new Date(dateOfBirth).getFullYear()
}

export const getBirthYearByAge = (age) => {
    return new Date(moment().subtract(age, 'years')).getFullYear()
}
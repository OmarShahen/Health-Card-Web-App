import { useState, useEffect } from 'react'
import './patients.css'
import { serverRequest } from '../components/API/request'
import { getAge } from '../utils/age-calculator'
import translations from '../i18n'
import { useDispatch } from 'react-redux'
import { setPatientUUID } from '../redux/slices/patientSlice'
import PatientProfileSection from '../components/sections/patient-profile'

const PatientProfile = () => {

    const pagePath = window.location.pathname
    const cardUUID = pagePath.split('/')[2]

    const dispatch = useDispatch()
    dispatch(setPatientUUID({ patientUUID: cardUUID }))

    const [patient, setPatient] = useState({})
    

    useEffect(() => {

        window.scrollTo(0, 0)

        serverRequest.get(`/v1/patients/cards/${cardUUID}`)
        .then(response => {
            const data = response.data
            setPatient(data.patient)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    

    return <div className="page-container">
        <PatientProfileSection patient={patient} />
    </div>
}

export default PatientProfile
import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import PatientProfileSection from '../../components/sections/patient-profile'
import CircularLoading from '../../components/loadings/circular'

const PatientMedicalPage = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [patient, setPatient] = useState({})

    useEffect(() => scroll(0,0), [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatient(data.patient)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div>
        <div>
            <div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    <PatientProfileSection patient={patient} />
                }
            </div>
        </div>
    </div>
}

export default PatientMedicalPage
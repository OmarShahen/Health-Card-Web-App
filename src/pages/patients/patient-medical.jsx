import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import PatientProfileSection from '../../components/sections/patient-profile'
import CircularLoading from '../../components/loadings/circular'
import './patient-profile.css'

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
                    <div className="patient-profile-grid-container"> 
                        <div className="patient-profile-page-navigator-container">
                            <ul>
                                <li>
                                    <a href="#demographic-section">
                                        Demographic
                                    </a>
                                </li>
                                <li>
                                    <a href="#bad-habits-section">
                                        Bad Habits
                                    </a>
                                </li>
                                <li>
                                    <a href="#chronic-section">
                                        Chronic Diseases
                                    </a>
                                </li>
                                <li>
                                    <a href="#genetic-section">
                                        Genetic Issues
                                    </a>
                                </li>
                                <li>
                                    <a href="#blood-section">
                                        Blood
                                    </a>
                                </li>
                                <li>
                                    <a href="#allergies-section">
                                        Allergies
                                    </a>
                                </li>
                                <li>
                                    <a href="#immune-section">
                                        Immune Diseases
                                    </a>
                                </li>
                                <li>
                                    <a href="#surgery-section">
                                        Past Surgeries
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <PatientProfileSection patient={patient} />
                    </div>
                }
            </div>
        </div>
    </div>
}

export default PatientMedicalPage
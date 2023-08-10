import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from '../../components/API/request'
import PrescriptionCard from '../../components/cards/patient-prescriptions'
import { TailSpin } from 'react-loader-spinner'
import PatientTabBar from '../../components/navigation/tab-bar'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'

const PrescriptionPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const prescriptionId = pagePath.split('/')[3]

    const [prescription, setPrescription] = useState({})
    const [doctor, setDoctor] = useState({})

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        window.scrollTo(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')

        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/${prescriptionId}`)
        .then(response => {
            setIsLoading(false)
            setPrescription(response.data.prescription)
            setDoctor(response.data.doctor)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])

    return <div>
        <PatientTabBar />
        <div className="page-container">
        {
            !isLoading ?
            <div className="cards-list-wrapper">
                <div className="padding-top-bottom"> 
                    <PrescriptionCard 
                    prescription={prescription} 
                    setPrescription={setPrescription} 
                    doctor={doctor} 
                    />  
                </div>            
            </div>     
            :
            <div className="loading-page-container">
                <TailSpin
                height="60"
                width="60"
                color="#2193B0"
                />
        </div>
        }
    </div>
    </div>
}

export default PrescriptionPage
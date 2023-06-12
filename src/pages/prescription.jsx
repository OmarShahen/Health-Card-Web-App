import { useState, useEffect } from 'react'
import './prescriptions.css'
import { useNavigate } from "react-router-dom"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import NavigationBar from '../components/navigation/navigation-bar'
import { toast } from 'react-hot-toast'
import PrescriptionCard from '../components/cards/prescription'
import PrintPrescription from '../components/prints/prescriptions/print-prescription'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


const PrescriptionPage = ({ roles }) => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const prescriptionId = pagePath.split('/')[2]

    const [reload, setReload] = useState(1)
    const [prescription, setPrescription] = useState()

    const user = useSelector(state => state.user.user)

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/prescriptions/${prescriptionId}`)
        .then(response => {
            const data = response.data
            setPrescription(data.prescription)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [reload])

 
    return <div className="page-container page-white-background">
        <NavigationBar pageName={"Prescription"} />
        <div className="padded-container">
            <div className="page-header-wrapper">
            <div className="back-button-container">
                    <ArrowBackIcon />
                    <span onClick={e => navigate(-1)}>Back</span>
                </div>
                <div className="page-header-container">
                    <div>
                        <h1>
                            Prescription
                        </h1>
                    </div>
                    <div className="btns-container subheader-text">
                    { prescription ? <PrintPrescription prescription={prescription} /> : null }                </div>
                </div>
            </div>
           { prescription ?
           <div className="grey-bg-container">
                <PrescriptionCard prescription={prescription} /> 
           </div>
           : 
           null 
           }
        </div>
    </div>
}

export default PrescriptionPage
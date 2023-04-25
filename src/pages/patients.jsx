import { useState, useEffect } from 'react'
import PrescriptionCard from "../components/cards/patient-prescriptions"
import './prescriptions.css'
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { useNavigate } from "react-router-dom"
import ScanButton from "../components/buttons/scan-button"
import DoctorsBottomBar from "../components/navigation/doctors-bottom-bar"
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import QRCodeScanner from '../components/scanners/QR-code'
import TableFilters from '../components/tables/filters';
import PageHeader from '../components/sections/page-header'
import PatientsTable from '../components/tables/patients';
import Card from '../components/cards/card'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import PatientFormModal from '../components/modals/patient-form'
import PatientCardJoinFormModal from '../components/modals/patient-card-join-form';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'


const PatientsPage = () => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(0)
    const [showPatientIdForm, setShowPatientIdForm] = useState(false)
    const [showPatientDataForm, setShowPatientDataForm] = useState(false)
    const [patients, setPatients] = useState([])
    const [searchedPatients, setSearchedPatients] = useState([])
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        serverRequest.get(`/v1/patients/doctors/${'63efbbe147537b9ccb47e9d6'}`)
        .then(response => {
            setPatients(response.data.patients)
            setSearchedPatients(response.data.patients)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    const searchPatient = (patient, value) => {

        const name = `${patient.firstName} ${patient.lastName}`.toLowerCase()
        const phone = `${patient.countryCode}${patient.phone}`

        if(name.includes(value)) {
            return true
        } else if(phone.includes(value)) {
            return true
        }

        return false
    }

    return <div className="page-container page-white-background">
        {
            showPatientIdForm ?
            <PatientCardJoinFormModal
            setShowModalForm={setShowPatientIdForm} 
            reload={reload}
            setReload={setReload}
            />
            :
            null
        }

        {
            showPatientDataForm ?
            <PatientFormModal
            setShowModalForm={setShowPatientDataForm}
            reload={reload}
            setReload={setReload}
            />
            :
            null
        }
        <div className="padded-container">
            <div className="page-header-container">
                <div>
                    <h1>
                        Patients
                    </h1>
                </div>
                <div 
                className="btns-container subheader-text">
                    <button onClick={e => setShowPatientDataForm(true)}><AddOutlinedIcon /><strong>Register patient with card</strong></button>
                    <button onClick={e => setShowPatientIdForm(true)}><AddOutlinedIcon /><strong>Register patient by ID</strong></button>
                </div>
            </div>
            <PatientsTable 
            rows={patients}
            reload={reload}
            setReload={setReload}
            />  
        </div>
        
    </div>
}

export default PatientsPage
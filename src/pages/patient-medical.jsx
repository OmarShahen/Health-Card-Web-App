import { useState, useEffect } from 'react'
import './patient-medical.css'
import { useNavigate } from "react-router-dom"
import EncounterCard from "../components/cards/encounter"
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import { serverRequest } from '../components/API/request'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import PageHeader from '../components/sections/page-header'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import DoctorCard from '../components/cards/doctor-card'
import PrescriptionCard from '../components/cards/patient-prescriptions'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import PrescriptionsTable from '../components/tables/prescriptions'
import DrugsTable from '../components/tables/drugs'
import DoctorsTable from '../components/tables/doctors'
import SymptomsTable from '../components/tables/symptoms'
import DiagnosisTable from '../components/tables/diagnosis'
import EncountersTable from '../components/tables/encounters'
import PatientProfile from '../components/sections/profile'
import PatientProfileSection from '../components/sections/patient-profile'
import EmergencyContactsTable from '../components/tables/emergency-contacts'

const PatientMedicalPage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const [patient, setPatient] = useState({})
    const [emergencyContacts, setEmergencyContacts] = useState([])
    const [doctors, setDoctors] = useState([])
    const [encounters, setEncounters] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [drugs, setDrugs] = useState([])
    const [symptoms, setSymptoms] = useState([])
    const [diagnosis, setDiagnosis] = useState([])
    const [tab, setTab] = useState('PROFILE')  
    
    const doctorId = '63efbbe147537b9ccb47e9d6'

    const actionNavStyle = { color: '#5c60f5', borderBottom: '2px solid #5c60f5' } 

    const getEncountersSymptoms = (encounters) => {
        let symptoms = []
        for(let i=0;i<encounters.length;i++) {
            let encounter = encounters[i]
            for(let j=0;j<encounter.symptoms.length;j++) {
                symptoms.push({ doctor: encounter.doctor, symptom: encounter.symptoms[j], createdAt: encounter.createdAt })
            }
        }

        return symptoms
    }

    const getEncountersDiagnosis = (encounters) => {
        let diagnosis = []
        for(let i=0;i<encounters.length;i++) {
            let encounter = encounters[i]
            for(let j=0;j<encounter.diagnosis.length;j++) {
                diagnosis.push({ doctor: encounter.doctor, diagnose: encounter.diagnosis[j], createdAt: encounter.createdAt })
            }
        }

        return diagnosis
    }

    useEffect(() => {

        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            const data = response.data
            setPatient(data.patient)
            setEmergencyContacts(data.patient.emergencyContacts)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/prescriptions/patients/${patientId}/drugs`)
        .then(response => {
            const data = response.data
            setDrugs(data.drugs)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/patients/${patientId}/doctors`)
        .then(response => {
            const data = response.data
            setDoctors(data.doctors)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/encounters/patients/${patientId}`)
        .then(response => {
            setEncounters(response.data.encounters)
            setSymptoms(getEncountersSymptoms(response.data.encounters))
            setDiagnosis(getEncountersDiagnosis(response.data.encounters))
        })
        .catch(error => {
            console.log('encounters error')
            console.error(error)
        })
    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/encounters/patients/${patientId}`)
        .then(response => {
            setEncounters(response.data.encounters)
        })
        .catch(error => {
            console.error(error)
        })

    }, [])

    useEffect(() => {

        serverRequest.get(`/v1/prescriptions/patients/${patientId}`)
        .then(response => {
            setPrescriptions(response.data.prescriptions)
        })
        .catch(error => {
            console.error(error)
        })

    }, [])


    return <div className="page-container">
        <div className="padded-container">
            <div className="page-header-container">
                    <div>
                        <h1>
                            Medical Profile
                        </h1>
                    </div>
                    <div className="btns-container subheader-text">
                        <button onClick={e => navigate(`/encounters/patients/${patientId}/form`)}><AddOutlinedIcon /><strong>Create Encounter</strong></button>
                    </div>
            </div>
            <div className="mini-page-navigator-container">
                <ul>
                    <li onClick={e => setTab('PROFILE')} style={tab === 'PROFILE' ? actionNavStyle : null }>Profile</li>
                    <li onClick={e => setTab('EMERGENCY-CONTACT')} style={tab === 'EMERGENCY-CONTACT' ? actionNavStyle : null }>Emergency Contacts</li>
                    <li onClick={e => setTab('DOCTORS')} style={tab === 'DOCTORS' ? actionNavStyle : null }>Doctors</li>
                    <li onClick={e => setTab('ENCOUNTERS')} style={tab === 'ENCOUNTERS' ? actionNavStyle : null }>Encounters</li>
                    <li onClick={e => setTab('SYMPTOMS')} style={tab === 'SYMPTOMS' ? actionNavStyle : null }>Symptoms</li>
                    <li onClick={e => setTab('DIAGNOSIS')} style={tab === 'DIAGNOSIS' ? actionNavStyle : null }>Diagnosis</li>
                    <li onClick={e => setTab('PRESCRIPTIONS')} style={tab === 'PRESCRIPTIONS' ? actionNavStyle : null }>Prescriptions</li>
                    <li onClick={e => setTab('DRUGS')} style={tab === 'DRUGS' ? actionNavStyle : null }>Drugs</li>
                </ul>
            </div>
            <br />
            <div>
                { tab === 'PRESCRIPTIONS' ? <PrescriptionsTable prescriptions={prescriptions} /> : null }
                { tab === 'DRUGS' ? <DrugsTable drugs={drugs} isShowFilters={true} /> : null }
                { tab === 'DOCTORS' ? <DoctorsTable doctors={doctors} /> : null }
                { tab === 'SYMPTOMS' ? <SymptomsTable symptoms={symptoms} /> : null }
                { tab === 'DIAGNOSIS' ? <DiagnosisTable diagnosis={diagnosis} /> : null }
                { tab === 'ENCOUNTERS' ? <EncountersTable encounters={encounters} /> : null }
                { tab === 'PROFILE' ? <PatientProfileSection patient={patient}/> : null }
                { tab === 'EMERGENCY-CONTACT' ? <EmergencyContactsTable contacts={emergencyContacts} /> : null }
            </div>
        </div>
    </div>
}

export default PatientMedicalPage
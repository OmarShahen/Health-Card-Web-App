import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SymptomsDiagnosisForm from '../components/forms/prescriptions/symptoms-diagnosis';
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar'
import DrugCard from '../components/cards/drug'
import format from 'date-fns/format'

const EncountersFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [isSubmit, setIsSubmit] = useState(false)

    const [showFormModal, setShowFormModal] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const cardId = searchParams.get('cardId')

    const [patientCardId, setPatientCardId] = useState(cardId ? cardId : '')
    const [clinics, setClinics] = useState([])
    const [symptoms, setSymptoms] = useState([])
    const [diagnosis, setDiagnosis] = useState([])
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])
    const [clinic, setClinic] = useState()
    const [registrationDate, setRegistrationDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [registrationTime, setRegistrationTime] = useState(format(new Date(), 'HH:MM'))


    const [patientCardIdError, setPatientCardIdError] = useState()
    const [symptomsError, setSymptomsError] = useState()
    const [diagnosisError, setDiagnosisError] = useState()
    const [notesError, setNotesError] = useState()
    const [registrationDateError, setRegistrationDateError] = useState()
    const [registrationTimeError, setRegistrationTimeError] = useState()
    const [clinicError, setClinicError] = useState()

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    const handleNotesKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setNotes([...notes, value])

        e.target.value = ''
    }

    const handleEncounter = () => {
        
        if(!patientCardId) return setPatientCardIdError('patient card ID is required')

        if(!clinic) return setClinicError('clinic is required')

        if(!registrationDate) return setRegistrationDateError('registration date is required')

        if(!registrationTime) return setRegistrationTimeError('registration time is required')

        if(symptoms.length === 0) return setSymptomsError('patient symptoms is required') 

        if(diagnosis.length === 0) return setDiagnosisError('patient diagnose is required')

        const medicalData = {
            doctorId: user._id,
            clinicId: clinic,
            symptoms,
            diagnosis,
            medicines: drugs,
            registrationDate: format(new Date(`${registrationDate} ${registrationTime}`), 'yyyy-MM-dd HH:MM:ss')
        }

        if(notes.length != 0) {
            medicalData.notes = notes
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/encounters/cardsId/${patientCardId}`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            const patientId = data.encounter.patientId
            toast.success(data.message, { duration: 5000, position: 'top-right' })
            navigate(`/patients/${patientId}/encounters`)
        })
        .catch(error => {
            setIsSubmit(false)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
        
    }

    const resetForm = () => {

        setPatientCardId('')
        setSymptoms([])
        setDiagnosis([])
        setDrugs([])
        setNotes([])
        setRegistrationDate(format(new Date(), 'yyyy-MM-dd HH:MM:ss'))
        setRegistrationTime(format(new Date(), 'HH:MM'))
        setClinic('')

        setPatientCardIdError()
        setSymptomsError()
        setDiagnosisError()
        setNotesError()
        setRegistrationDateError()
        setRegistrationTimeError()
        setClinicError()
    }

    return <div className="page-container">
        <NavigationBar pageName={"Encounter Form"} />

        {
            showFormModal ?
            <DrugFormModal 
            drugs={drugs} 
            setDrugs={setDrugs}
            setShowFormModal={setShowFormModal}
            />
            :
            null
        }

        <div className="padded-container">
            <PageHeader 
            pageName={'Create Encounter'} 
            isHideRefresh={true} 
            />
            <div className="prescription-form-wrapper left">
                <div className="cards-2-list-wrapper box-shadow margin-top-1">
                    <div className="prescription-form-notes-container">
                        <strong>Card ID</strong>
                        <div className="form-input-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder="patient card ID"
                            onClick={e => setPatientCardIdError()}
                            onChange={e => setPatientCardId(e.target.value)}
                            value={cardId}
                            />
                        </div>
                        <span className="red">{patientCardIdError}</span>
                    </div>
                    <div className="prescription-form-notes-container">
                        <div className="form-input-container">
                            <label>Clinic</label>
                            <select
                            onChange={e => setClinic(e.target.value)}
                            onClick={e => setClinicError()}
                            >
                                <option selected disabled>Select Clinic</option>
                                {clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                            </select>
                        </div>
                        <span className="red">{clinicError}</span>
                    </div>
                </div>
                <div className="cards-2-list-wrapper box-shadow margin-top-1">          
                    <div className="prescription-form-notes-container">
                        <strong>Encounter Date</strong>
                        <div className="form-input-container">
                            <input 
                            type="date" 
                            className="form-input" 
                            onClick={e => setRegistrationDateError()}
                            onChange={e => setRegistrationDate(format(new Date(e.target.value), 'yyyy-MM-dd'))}
                            value={registrationDate}
                            />
                            <span className="red">{registrationDateError}</span>
                        </div>                        
                    </div>  
                    <div className="prescription-form-notes-container">
                        <strong>Encounter Time</strong>
                        <div className="form-input-container">
                            <input 
                            type="time" 
                            className="form-input" 
                            onClick={e => setRegistrationTimeError()}
                            onChange={e => setRegistrationTime(e.target.value)}
                            value={registrationTime}
                            />
                            <span className="red">{registrationTimeError}</span>
                        </div>
                    </div>                  
                </div>
                <SymptomsDiagnosisForm
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                diagnosis={diagnosis}
                setDiagnosis={setDiagnosis} 
                symptomsError={symptomsError}
                setSymptomsError={setSymptomsError}
                diagnosisError={diagnosisError}
                setDiagnosisError={setDiagnosisError}
                />
                <div className="cards-2-list-wrapper box-shadow margin-top-1">
                    <div className="prescription-form-notes-container">
                        <strong>Notes</strong>
                        <div className="form-input-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder="notes"
                            onKeyDown={handleNotesKeyDown} 
                            />
                        </div>
                        <span className="red">{notesError}</span>
                        <div className="symptoms-diagnosis-tags-container">
                            <div className="drug-instruction-list-container">
                                {notes.map((note, index) =>                 
                                <span 
                                className="status-btn pending"
                                >
                                    {note}
                                    <span onClick={e => setNotes(notes.filter((savedNote, savedIndex) => savedIndex !== index))}>
                                        <CancelIcon />
                                    </span>
                                </span>) 
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="prescription-form-notes-container box-shadow margin-top-1">
                    <div className="prescription-header-container">
                        <h3>Medications</h3>
                        <button 
                        className="normal-button white-text action-color-bg" 
                        onClick={e => setShowFormModal(true)}
                        >
                        Add Drug
                        </button>
                    </div>
                    <div className="cards-grey-container cards-3-list-wrapper">
                            {drugs.map(drug => <DrugCard drug={drug} />)}
                    </div>
                </div>
                
                <div className="margin-top-1">
                    
                        {
                            isSubmit ?
                            <button className="send-btn center full-width-button">
                                <TailSpin
                                height="30"
                                width="40"
                                color="#FFF"
                                />
                            </button>
                            :
                            <button className="full-width-button action-color-bg white-text" onClick={e => handleEncounter()}>
                                Register Encounter
                            </button>
                        }
                        <div className="margin-top-1"></div>
                            <button 
                            className="full-width-button grey-bg black box-shadow" 
                            onClick={e => resetForm()}>
                                Reset
                            </button>
                </div>
            </div>
        </div>
        
    </div>
}

export default EncountersFormPage
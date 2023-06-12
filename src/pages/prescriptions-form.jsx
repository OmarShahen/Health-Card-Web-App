import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom';
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar'
import DrugCard from '../components/cards/drug'
import { format } from 'date-fns'


const PrescriptionsFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [isSubmit, setIsSubmit] = useState(false)

    const [showFormModal, setShowFormModal] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const cardId = searchParams.get('cardId')

    const [clinics, setClinics] = useState([])
    const [patientCardId, setPatientCardId] = useState(cardId ? cardId : '')
    const [clinic, setClinic] = useState()
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])
    const [registrationDate, setRegistrationDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [registrationTime, setRegistrationTime] = useState(format(new Date(), 'HH:MM'))

    const [patientCardIdError, setPatientCardIdError] = useState()
    const [clinicError, setClinicError] = useState()
    const [notesError, setNotesError] = useState()
    const [drugsError, setDrugsError] = useState()
    const [registrationDateError, setRegistrationDateError] = useState()
    const [registrationTimeError, setRegistrationTimeError] = useState()

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

    const handlePrescription = () => {
        
        if(!patientCardId) return setPatientCardIdError('patient card ID is required') 

        if(!clinic) return setClinicError('clinic is required')

        if(!registrationDate) return setRegistrationDateError('prescription date is required')

        if(!registrationTime) return setRegistrationTimeError('prescription time is required')

        if(drugs.length === 0) return setDrugsError('No drug is registered in the prescription')

        const medicalData = {
            doctorId: user._id,
            clinicId: clinic,
            notes,
            medicines: drugs,
            registrationDate: format(new Date(`${registrationDate} ${registrationTime}`), 'yyyy-MM-dd HH:MM:ss')
        }

        setIsSubmit(true)
        serverRequest.post(`v1/prescriptions/cardsId/${patientCardId}`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            const patientId = data.prescription.patientId
            toast.success(data.message, { duration: 5000, position: 'top-center' })
            navigate(`/patients/${patientId}/prescriptions`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
        })
        
    }

    const resetForm = () => {
        setPatientCardId('')
        setDrugs([])
        setNotes([])
        setRegistrationDate(format(new Date(), 'yyyy-MM-dd'))
        setClinic('')

        setPatientCardIdError()
        setDrugsError()
        setNotesError()
        setRegistrationDateError()
        setClinicError()
    }

    return <div className="page-container">
        <NavigationBar pageName="Prescription Form" />
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
            <PageHeader pageName={'Create Prescription'} isHideRefresh={true} />
            <div className="prescription-form-wrapper left">
                <div className="cards-2-list-wrapper box-shadow margin-top-1">
                    <div className="prescription-form-notes-container">
                        <strong>Patient Card ID</strong>
                        <div className="form-input-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder="patient card ID"
                            onClick={e => setPatientCardIdError()}
                            onChange={e => setPatientCardId(e.target.value)}
                            value={cardId}
                            />
                            <span className="red">{patientCardIdError}</span>
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
                        <strong>Prescription Date</strong>
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
                    <div className="prescription-form-notes-container">
                        <strong>Prescription Time</strong>
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
                        <div>
                            <h3>Medications</h3>
                            <span className="red">{drugsError}</span>
                        </div>
                        <button 
                        className="normal-button white-text action-color-bg" 
                        onClick={e => {
                            setDrugsError()
                            setShowFormModal(true)
                        }}
                        >
                        Add Drug
                        </button>
                    </div>
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {drugs.map((drug, index) =>
                            <DrugCard 
                            drug={drug} 
                            isShowDelete={true} 
                            drugs={drugs} 
                            setDrugs={setDrugs} 
                            drugIndex={index}
                            />)}
                    </div>
                </div>
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
                
                <div className="margin-top-1">
                    
                        {
                            isSubmit ?
                            <button className="send-btn center full-width-button action-color-bg">
                                <TailSpin
                                height="30"
                                width="40"
                                color="#FFF"
                                />
                            </button>
                            :
                            <button className="full-width-button action-color-bg white-text" onClick={e => handlePrescription()}>
                                Register Prescription
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

export default PrescriptionsFormPage
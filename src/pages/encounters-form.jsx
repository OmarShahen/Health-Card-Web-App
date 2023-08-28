import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector, useDispatch } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SymptomsDiagnosisForm from '../components/forms/prescriptions/symptoms-diagnosis';
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar'
import DrugCard from '../components/cards/drug'
import { isRolesValid } from '../utils/roles'
import { setIsShowModal, setIsShowRenewModal } from '../redux/slices/modalSlice'
import translations from '../i18n';

const EncountersFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

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

    const [newNote, setNewNote] = useState()

    const [patientCardIdError, setPatientCardIdError] = useState()
    const [symptomsError, setSymptomsError] = useState()
    const [diagnosisError, setDiagnosisError] = useState()
    const [notesError, setNotesError] = useState()
    const [clinicError, setClinicError] = useState()

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
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

        if(!newNote) return setNotesError('no note is added')

        const value = newNote

        if(!value.trim()) return

        setNotes([...notes, value])

        setNewNote('')
    }

    const handleEncounter = () => {
      
        if(!clinic) {
            toast.error(translations[lang]['clinic is required'], { duration: 3000, position: 'top-right' })
            setClinicError(translations[lang]['clinic is required'])
            return
        }

        if(symptoms.length === 0) {
            toast.error(translations[lang]['patient symptoms is required'], { duration: 3000, position: 'top-right' })
            setSymptomsError(translations[lang]['patient symptoms is required']) 
            return
        }

        if(diagnosis.length === 0) {
            toast.error(translations[lang]['patient diagnose is required'], { duration: 3000, position: 'top-right' })
            setDiagnosisError(translations[lang]['patient diagnose is required'])
            return
        }

        const medicalData = {
            doctorId: user._id,
            patientId,
            clinicId: clinic,
            symptoms,
            diagnosis,
            medicines: drugs,
        }

        if(notes.length != 0) {
            medicalData.notes = notes
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/encounters`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-right' })
            drugs.length === 0 ? navigate(`/patients/${patientId}/encounters`) : navigate(`/prescriptions/${data.prescription._id}/view`)
        })
        .catch(error => {
            setIsSubmit(false)

            if(error.response.data.field === 'mode') return dispatch(setIsShowModal(true))

            if(error.response.data.field === 'activeUntilDate') return dispatch(setIsShowRenewModal(true))

            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
        
    }

    const resetForm = () => {

        setPatientCardId('')
        setSymptoms([])
        setDiagnosis([])
        setDrugs([])
        setNotes([])
        setClinic('')

        setPatientCardIdError()
        setSymptomsError()
        setDiagnosisError()
        setNotesError()
        setClinicError()
    }

    return <div className="page-container">
        <NavigationBar pageName={translations[lang]["Encounter"]} />

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
            pageName={translations[lang]['Create Encounter']} 
            isHideRefresh={true} 
            />
            <div className="cards-grey-container body-text">
                <div className="prescription-form-wrapper box-shadow-line left">
                    <div className="cards-2-list-wrapper">
                        <div className="prescription-form-notes-container">
                            <div className="form-input-container">
                                <strong>{translations[lang]['Clinic']}</strong>
                                <select
                                className="form-input"
                                onChange={e => setClinic(e.target.value)}
                                onClick={e => setClinicError()}
                                >
                                    <option selected disabled>{translations[lang]['Select Clinic']}</option>
                                    {clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                                </select>
                            </div>
                            <span className="red">{clinicError}</span>
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
                    <div className="cards-2-list-wrapper margin-top-1">
                        <div className="prescription-form-notes-container">
                            <strong>{translations[lang]['Notes']} <span className="grey-text span-text">{translations[lang]["(press enter to register note)"]}</span></strong>
                            <div className="form-input-container">
                                <input 
                                type="text" 
                                className="form-input" 
                                placeholder={translations[lang]["notes"]}
                                onKeyDown={handleNotesKeyDown} 
                                onClick={e => setNotesError()}
                                onChange={e => setNewNote(e.target.value)}
                                value={newNote}
                                />
                            </div>
                            <span className="red">{notesError}</span>
                            <div className="padding-top-bottom right">
                                <button 
                                className="normal-button action-color-bg white-text show-mobile"
                                onClick={e => {
                                    if(!newNote) return setNotesError('no note is added')
                                    if(!newNote.trim()) return
                                    setNotes([...notes, newNote])
                                    setNewNote('')
                                }}
                                >
                                    Add
                                </button>
                            </div>
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
                    <div className="prescription-form-notes-container margin-top-1">
                        <div className="prescription-header-container">
                            <h3>{translations[lang]['Medications']}</h3>
                            <button 
                            className="normal-button white-text action-color-bg" 
                            onClick={e => setShowFormModal(true)}
                            >
                            {translations[lang]['Add Drug']}
                            </button>
                        </div>
                        <div className="cards-grey-container cards-3-list-wrapper">
                                {drugs.map((drug, index) => <DrugCard 
                                drug={drug} 
                                isShowDelete={true}
                                drugs={drugs}
                                setDrugs={setDrugs}
                                drugIndex={index}
                                />)}
                        </div>
                    </div>
                </div>
            </div>
            <div className="margin-top-1 form-buttons-container">       
                {
                    isSubmit ?
                        <TailSpin
                        height="30"
                        width="40"
                        color="dodgerblue"
                        />
                    :
                    <button 
                    className="normal-button action-color-bg white-text" 
                    onClick={e => handleEncounter()}>
                        {translations[lang]['Create']}
                    </button>
                }
                    <button 
                    className="normal-button cancel-button" 
                    onClick={e => resetForm()}>
                        {translations[lang]['Reset']}
                    </button>
            </div>
        </div>
        
    </div>
}

export default EncountersFormPage
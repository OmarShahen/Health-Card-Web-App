import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SymptomsDiagnosisForm from '../components/forms/prescriptions/symptoms-diagnosis';
import DrugsTable from '../components/tables/drugs'
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar';
import DrugCard from '../components/cards/drug';


const EncountersFormPage = () => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [isSubmit, setIsSubmit] = useState(false)

    const [showFormModal, setShowFormModal] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const cardId = searchParams.get('cardId')

    const [patientCardId, setPatientCardId] = useState(cardId ? cardId : '')
    const [symptoms, setSymptoms] = useState([])
    const [diagnosis, setDiagnosis] = useState([])
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])

    const [patientCardIdError, setPatientCardIdError] = useState()
    const [symptomsError, setSymptomsError] = useState()
    const [diagnosisError, setDiagnosisError] = useState()
    const [notesError, setNotesError] = useState()

    useEffect(() => scroll(0,0), [])

    const handleNotesKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setNotes([...notes, value])

        e.target.value = ''
    }

    const handleEncounter = () => {
        
        if(!patientCardId) return setPatientCardIdError('patient card ID is required')

        if(symptoms.length === 0) return setSymptomsError('patient symptoms is required') 

        if(diagnosis.length === 0) return setDiagnosisError('patient diagnose is required')

        const medicalData = {
            doctorId: user._id,
            symptoms,
            diagnosis,
            notes,
            medicines: drugs
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
            console.error(error)
        })
        
    }

    const resetForm = () => {

        setPatientCardId('')
        setSymptoms([])
        setDiagnosis([])
        setDrugs([])
        setNotes([])

        setPatientCardIdError()
        setSymptomsError()
        setDiagnosisError()
        setNotesError()
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
                    <div>
                        <div className="page-list-container">
                                {drugs.map(drug => <div className="cards-view-container">
                                    <DrugCard drug={drug} />
                                </div>)}
                        </div>
                        <div className="page-table-container">
                            <DrugsTable 
                            drugs={drugs} 
                            setDrugs={setDrugs} 
                            isRemoveAction={true}
                            isShowFilters={false}
                            />  
                        </div>
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
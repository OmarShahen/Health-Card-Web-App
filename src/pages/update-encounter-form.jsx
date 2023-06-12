import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header"
import { serverRequest } from '../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SymptomsDiagnosisForm from '../components/forms/prescriptions/symptoms-diagnosis';
import DrugFormModal from '../components/modals/drug-form'
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar'
import EmptySection from '../components/sections/empty/empty'
import CircularLoading from '../components/loadings/circular'
import { useSelector } from 'react-redux'

const UpdateEncountersFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

    const pagePath = window.location.pathname
    const encounterId = pagePath.split('/')[2]

    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [encounter, setEncounter] = useState()
    const [showFormModal, setShowFormModal] = useState(false)

    const [symptoms, setSymptoms] = useState([])
    const [diagnosis, setDiagnosis] = useState([])
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])

    const [symptomsError, setSymptomsError] = useState()
    const [diagnosisError, setDiagnosisError] = useState()
    const [notesError, setNotesError] = useState()

    useEffect(() => {
        scroll(0,0)

        if(!roles.includes(user.role)) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/encounters/${encounterId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setEncounter(data.encounter)
            setSymptoms(data.encounter.symptoms)
            setDiagnosis(data.encounter.diagnosis)
            setNotes(data.encounter.notes)
        })
        .catch(error => {
            setIsLoading(false)
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
        
        if(symptoms.length === 0) return setSymptomsError('patient symptoms is required') 

        if(diagnosis.length === 0) return setDiagnosisError('patient diagnose is required')

        const encounterData = { 
            symptoms, 
            diagnosis,
            notes,
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/encounters/${encounterId}`, encounterData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-right' })
            navigate(`/encounters/${encounterId}/view`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
        })
        
    }

    const resetForm = () => {

        setSymptoms([])
        setDiagnosis([])
        setNotes([])

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
            <PageHeader pageName={'Update Encounter'} />
            {
                !isLoading ?
                    encounter ?
                    <div className="prescription-form-wrapper left">
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
                                Update Encounter
                            </button>
                        }
                        <br />
                        <button 
                        className="full-width-button grey-bg black box-shadow" 
                        onClick={e => resetForm()}>
                            Reset
                        </button>
                    </div>
                    </div>
                    :
                    <EmptySection />
                :
                <CircularLoading />

            }
            
        </div>
        
    </div>
}

export default UpdateEncountersFormPage
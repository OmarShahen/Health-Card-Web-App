import { useState } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import SymptomsDiagnosisForm from '../components/forms/prescriptions/symptoms-diagnosis';
import DrugsTable from '../components/tables/drugs'
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'


const PrescriptionsFormPage = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[3]

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [isSubmit, setIsSubmit] = useState(false)

    const [showFormModal, setShowFormModal] = useState(false)

    const [symptoms, setSymptoms] = useState([])
    const [diagnosis, setDiagnosis] = useState([])
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])

    const [symptomsError, setSymptomsError] = useState()
    const [diagnosisError, setDiagnosisError] = useState()
    const [notesError, setNotesError] = useState()


    const handleNotesKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setNotes([...notes, value])

        e.target.value = ''
    }

    const handlePrescription = () => {
        
        if(symptoms.length === 0) return setSymptomsError('patient symptoms is required') 

        if(diagnosis.length === 0) return setDiagnosisError('patient diagnose is required')

        const medicalData = {
            doctorId: '63efbbe147537b9ccb47e9d6',
            patientId,
            symptoms,
            diagnosis,
            notes,
            medicines: drugs
        }

        setIsSubmit(true)
        serverRequest.post('/v1/encounters', medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-center' })
            navigate('/encounters')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
        })
        
    }

    const resetForm = () => {
        setSymptoms([])
        setDiagnosis([])
        setDrugs([])
        setNotes([])

        setSymptomsError()
        setDiagnosisError()
        setNotesError()
    }

    return <div className="page-container">

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

        {/*<div className="prescriptions-patient-container">
            <div className="form-input-container">
                <strong>اسم الحالة</strong>
                <input 
                type="text" 
                value={patientName}
                placeholder='اسم الحالة'
                className="form-input" 
                onChange={e => setPatientName(e.target.value)}
                onClick={e => setPatientNameError()}
                />
                <div className="form-error-message">{patientNameError}</div>
            </div>
            <div className="form-input-container">
                <strong>هاتف الحالة</strong>
                <input 
                type="tel" 
                className="form-input" 
                value={patientPhone}
                placeholder='هاتف الحالة'
                onChange={e => setPatientPhone(Number.parseInt(e.target.value))}
                onClick={e => setPatientPhoneError()}
                />
                <div className="form-error-message">{patientPhoneError}</div>
            </div>
        </div>*/}
        <div className="padded-container">
            <PageHeader pageName={'Encounter Form'} />
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
                

                <div className="prescription-form-notes-container box-shadow margin-top-1">
                    <div className="prescription-header-container">
                        <h3>Medications</h3>
                        <button 
                        className="normal-button white-text purple-bg" 
                        onClick={e => setShowFormModal(true)}
                        >
                        Add Drug
                        </button>
                    </div>
                    <DrugsTable 
                    drugs={drugs} 
                    setDrugs={setDrugs} 
                    isRemoveAction={true}
                    isShowFilters={false}
                    />
                
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
                            <button className="full-width-button" onClick={e => handlePrescription()}>
                                Register Encounter
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
        </div>
        
    </div>
}

export default PrescriptionsFormPage
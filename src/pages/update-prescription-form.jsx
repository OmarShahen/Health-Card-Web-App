import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import DrugFormModal from '../components/modals/drug-form'
import NavigationBar from '../components/navigation/navigation-bar'
import DrugCard from '../components/cards/drug'
import CircularLoading from '../components/loadings/circular'
import EmptySection from '../components/sections/empty/empty'
import { useSelector } from 'react-redux'
import { isRolesValid } from '../utils/roles'
import CancelIcon from '@mui/icons-material/Cancel'
import translations from '../i18n';

const UpdatePrescriptionsFormPage = ({ roles }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const prescriptionId = pagePath.split('/')[2]

    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [targetDrug, setTargetDrug] = useState()
    const [targetIndex, setTargetIndex] = useState()
    const [showFormModal, setShowFormModal] = useState(false)

    const [prescription, setPrescription] = useState()
    const [drugs, setDrugs] = useState([])
    const [notes, setNotes] = useState([])

    const [drugsError, setDrugsError] = useState()
    const [notesError, setNotesError] = useState()

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/prescriptions/${prescriptionId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPrescription(data.prescription)
            setDrugs(data.prescription.medicines)
            setNotes(data.prescription.notes)
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

    const handlePrescription = () => {
        
        if(drugs.length === 0) return setDrugsError(translations[lang]['no drug is registered in the prescription'])

        const medicalData = {
            medicines: drugs,
            notes
        }

        setIsSubmit(true)
        serverRequest.put(`v1/prescriptions/${prescriptionId}`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-right' })
            navigate(`/prescriptions/${prescriptionId}/view`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
        
    }


    return <div className="page-container">
        {
            showFormModal ?
            <DrugFormModal 
            drugs={drugs} 
            setDrugs={setDrugs}
            setShowFormModal={setShowFormModal}
            targetDrug={targetDrug}
            targetIndex={targetIndex}
            />
            :
            null
        }
        <div className="padded-container">
            <PageHeader pageName={translations[lang]['Update Prescription']} />
            {
                !isLoading ?
                prescription ?  
                <div>
                <div className="cards-grey-container">
                    <div className="prescription-form-wrapper left box-shadow">
                        <div className="prescription-form-notes-container">
                            <div className="prescription-header-container">
                                <div>
                                    <h3>{translations[lang]['Medications']}</h3>
                                    <span className="red">{drugsError}</span>
                                </div>
                                <button 
                                className="normal-button white-text action-color-bg" 
                                onClick={e => {
                                    setDrugsError()
                                    setShowFormModal(true)
                                }}
                                >
                                {translations[lang]['Add Drug']}
                                </button>
                            </div>
                    
                            {
                                prescription ?
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
                                :
                                null
                            }
                            <div className="cards-2-list-wrapper margin-top-1">
                                <div className="prescription-form-notes-container">
                                    <strong>{translations[lang]['Notes']} <span className="grey-text span-text">{translations[lang]['(press enter to register note)']}</span></strong>
                                    <div className="form-input-container">
                                        <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder={translations[lang]["notes"]}
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
                
                        </div>
                        
                    </div>
                </div>
                    <div className="margin-top-1">
                    {
                        isSubmit ?
                        <div className="flex-right">
                            <TailSpin
                            height="30"
                            width="40"
                            color="dodgerblue"
                            />
                        </div>
                        :
                        <div className="flex-right">
                            <button className="normal-button action-color-bg white-text" onClick={e => handlePrescription()}>
                                {translations[lang]['Update']}
                            </button>
                        </div>
                    }
                        
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

export default UpdatePrescriptionsFormPage
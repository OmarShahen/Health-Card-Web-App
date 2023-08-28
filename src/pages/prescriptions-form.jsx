import { useState, useEffect } from 'react'
import './prescriptions.css'
import PageHeader from "../components/sections/page-header";
import { useSelector, useDispatch } from 'react-redux';
import { serverRequest } from '../components/API/request';
import { TailSpin } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom';
import DrugFormModal from '../components/modals/drug-form';
import CancelIcon from '@mui/icons-material/Cancel'
import NavigationBar from '../components/navigation/navigation-bar'
import DrugCard from '../components/cards/drug'
import { isRolesValid } from '../utils/roles'
import { setIsShowModal, setIsShowRenewModal } from '../redux/slices/modalSlice'
import translations from '../i18n';

const PrescriptionsFormPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [showFormModal, setShowFormModal] = useState(false)

    const [clinics, setClinics] = useState([])
    const [clinic, setClinic] = useState()
    const [notes, setNotes] = useState([])
    const [drugs, setDrugs] = useState([])

    const [newNote, setNewNote] = useState()

    const [clinicError, setClinicError] = useState()
    const [notesError, setNotesError] = useState()
    const [drugsError, setDrugsError] = useState()

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

    const handlePrescription = () => {
        
        if(!clinic) return setClinicError(translations[lang]['clinic is required'])

        if(drugs.length === 0) return setDrugsError(translations[lang]['no drug is registered in the prescription'])

        const medicalData = {
            patientId,
            doctorId: user._id,
            clinicId: clinic,
            notes,
            medicines: drugs,
        }

        setIsSubmit(true)
        serverRequest.post(`v1/prescriptions`, medicalData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { duration: 5000, position: 'top-right' })
            navigate(`/prescriptions/${data.prescription._id}/view`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error.response.data.field === 'mode') return dispatch(setIsShowModal(true))

            if(error.response.data.field === 'activeUntilDate') return dispatch(setIsShowRenewModal(true))

            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
        
    }

    const resetForm = () => {
        setPatientCardId('')
        setDrugs([])
        setNotes([])
        setClinic('')

        setPatientCardIdError()
        setDrugsError()
        setNotesError()
        setClinicError()
    }

    return <div className="page-container">
        <NavigationBar pageName={translations[lang]["Prescription"]} />
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
            <PageHeader pageName={translations[lang]['Create Prescription']} isHideRefresh={true} />
            <div className="cards-grey-container body-text">
                <div className="prescription-form-wrapper left box-shadow-line">
                    <div className="cards-2-list-wrapper margin-top-1">
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
                    <div className="prescription-form-notes-container margin-top-1">
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
                    <div className="cards-2-list-wrapper margin-top-1">
                        <div className="prescription-form-notes-container">
                            <strong>{translations[lang]['Notes']} <span className="grey-text span-text">{translations[lang]['(press enter to register note)']}</span></strong>
                            <div className="form-input-container">
                                <input 
                                type="text" 
                                className="form-input" 
                                placeholder={translations[lang]["notes"]}
                                onKeyDown={handleNotesKeyDown} 
                                value={newNote}
                                onClick={e => setNotesError()}
                                onChange={e => setNewNote(e.target.value)}
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
                        <button className="normal-button action-color-bg white-text" onClick={e => handlePrescription()}>
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

export default PrescriptionsFormPage
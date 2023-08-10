import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import translations from '../../i18n'

const PatientCardJoinFormModal = ({ reload, setReload, setShowModalForm }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isClinicsLoading, setIsClinicsLoading] = useState(false)
    const [cardId, setCardId] = useState()
    const [cvc, setCvc] = useState()
    const [clinic, setClinic] = useState()
    const [clinics, setClinics] = useState([])

    const [cardIdError, setCardIdError] = useState()
    const [cvcError, setCvcError] = useState()
    const [clinicError, setClinicError] = useState()

    useEffect(() => {

        if(user.roles.includes('STAFF') && !user.roles.includes('DOCTOR')) {
            return
        }
        
        setIsClinicsLoading(true)
        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            setIsClinicsLoading(false)
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(erorr => {
            setIsClinicsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!cardId) return setCardIdError(translations[lang]['card number is required'])

        if(!cvc) return setCvcError(translations[lang]['CVC is required'])

        if(user.roles.includes('DOCTOR') && !clinic) return setClinicError(translations[lang]['clinic is required'])

        let endpointURL
        const clinicPatientData = { cardId: Number.parseInt(cardId), cvc: Number.parseInt(cvc) }

        if(user.roles.includes('DOCTOR')) {
            clinicPatientData.clinicId = clinic
            clinicPatientData.doctorId = user._id
            endpointURL = `/v1/clinics-patients-doctors/card-ID`
        }

        if(user.roles.includes('STAFF')) {
            clinicPatientData.clinicId = user.clinicId
            endpointURL = `/v1/clinics-patients/card-ID`
        }

        setIsSubmit(true)
        serverRequest.post(endpointURL, clinicPatientData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload+1) : navigate('/patients')
            setShowModalForm(false)

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'cardId') return setCardIdError(errorResponse.message)
                
                if(errorResponse.field === 'cvc') return setCvcError(errorResponse.message)

                if(errorResponse.field === 'clinicId') return setCardIdError(errorResponse.message)

                if(errorResponse.field === 'doctorId') return setCardIdError(errorResponse.message)

                if(errorResponse.field === 'mode') {
                    dispatch(setIsShowModal(true))
                    setShowModalForm(false)
                    return
                }

                if(errorResponse.field === 'activeUntilDate') {
                    setShowFormModal(false)
                    dispatch(setIsShowRenewModal(true))
                    return
                }

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{translations[lang]['Add Patient With Card']}</h2>
            </div>
            <div className="modal-body-container">
                <form id="patient-card-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>{translations[lang]['Card Number']}</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={cardId}
                        onChange={e => setCardId(e.target.value)}
                        onClick={e => setCardIdError()}
                        />
                        <span className="red">{cardIdError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>{translations[lang]['CVC']}</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={cvc}
                        onChange={e => setCvc(e.target.value)}
                        onClick={e => setCvcError()}
                        />
                        <span className="red">{cvcError}</span>
                    </div>
                    {
                            user.roles.includes('STAFF') ?
                            null
                            :
                            <div className="form-input-container">
                                <label>{translations[lang]['Select Clinic']}</label>
                                <select
                                onChange={e => setClinic(e.target.value)}
                                onClick={e => setClinicError()}
                                className="form-input"
                                >
                                    <option selected disabled>{translations[lang]['Select Clinic']}</option>
                                    {clinics.map(clinic => <option value={clinic.clinic._id}>
                                        {clinic.clinic.name}
                                    </option>)}
                                </select>
                                <span className="red">{clinicError}</span>
                            </div>
                        }
                </form>
            </div>
            <div className="modal-form-btn-container">
                        <div>
                            {
                                !isSubmit ?
                                <button
                                form="patient-card-form"
                                className="normal-button white-text action-color-bg"
                                >
                                    {translations[lang]['Add']}
                                </button>
                                :
                                <TailSpin width="25" height="25" color="#4c83ee" />
                            }
                        </div>
                        <div>
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                e.preventDefault()
                                setShowModalForm(false)
                            }}
                            >{translations[lang]['Close']}</button>
                        </div>
                    </div>
        </div>
    </div>
}

export default PatientCardJoinFormModal
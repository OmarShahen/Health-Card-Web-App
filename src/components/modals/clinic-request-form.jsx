import { useState, useEffect } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import CloseIcon from '@mui/icons-material/Close'
import translations from '../../i18n'

const ClinicRequestFormModal = ({ reload, setReload, setShowModalForm, role, clinicId }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)
    const [isClinicsLoading, setIsClinicsLoading] = useState(false)
    const [email, setEmail] = useState()
    const [clinic, setClinic] = useState(clinicId ? clinicId : null)
    const [clinics, setClinics] = useState([])

    const [emailError, setEmailError] = useState()
    const [clinicError, setClinicError] = useState()

    useEffect(() => {

        if(clinicId) {
            return
        }

        setIsClinicsLoading(true)
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
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

        if(!email) return setEmailError(translations[lang]['email is required'])

        if(!clinic) return setClinicError(translations[lang]['clinic is required'])

        const requestData = { 
            email,
            clinicId: clinic,
        }

        let endpointURL = ''

        if(role === 'DOCTOR') {
            endpointURL = `/v1/clinics-requests/doctors/email`
        } else if(role === 'OWNER') {
            endpointURL = `/v1/clinics-requests/owners/email`
        }

        setIsSubmit(true)
        serverRequest.post(endpointURL, requestData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            clinicId ? null : setReload(reload + 1)
            clinicId ? setEmail('') : null
            toast.success(data.message, { duration: 3000, position: 'top-right' })
            clinicId ? null : setShowModalForm(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'email') return setEmailError(errorResponse.message)

                if(errorResponse.field === 'userId') return setEmailError(errorResponse.message)

                if(errorResponse.field === 'clinicId' && clinicId) return setEmailError(errorResponse.message)

                if(errorResponse.field === 'clinicId') return setClinicError(errorResponse.message)

                if(errorResponse.field === 'mode') {
                    setShowModalForm(false)
                    dispatch(setIsShowModal(true))
                    return
                }

                if(errorResponse.field === 'activeUntilDate') {
                    setShowModalForm(false)
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
                <h2>{ role === 'DOCTOR' ? clinicId ? translations[lang]['Invite Doctors'] : translations[lang]['Invite Doctor'] : translations[lang]['Invite Owner']}</h2>
                <span className="hover" onClick={e => setShowModalForm(false)}>
                    <CloseIcon />
                </span>
            </div>
            <div className="modal-body-container">
                <form id="patient-card-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>{translations[lang]['Email']}</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onClick={e => setEmailError()}
                        />
                        <span className="red">{emailError}</span>
                    </div>
                    {
                        clinicId ?
                        null
                        :
                        <div className="form-input-container">
                            <label>{translations[lang]['Select Clinic']}</label>
                            <select
                            className="form-input"
                            onChange={e => setClinic(e.target.value)}
                            onClick={e => setClinicError()}
                            >
                                <option selected disabled>{translations[lang]['Select Clinic']}</option>
                                {clinics.map(clinic => <option value={clinic?.clinic?._id}>
                                    {clinic?.clinic?.name}
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
                            {translations[lang]['Invite']}
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
                    >{ clinicId ? translations[lang]['Done'] : translations[lang]['Close'] }</button>
                </div>
            </div>
        </div>
    </div>
}

export default ClinicRequestFormModal
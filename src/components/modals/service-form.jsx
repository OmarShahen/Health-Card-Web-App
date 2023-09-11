import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import CircularLoading from '../loadings/circular'
import { setIsShowModal, setIsShowRenewModal } from '../../redux/slices/modalSlice'
import CloseIcon from '@mui/icons-material/Close'
import translations from '../../i18n'

const ServiceFormModal = ({ 
    setShowFormModal, 
    reload, 
    setReload, 
    service, 
    setService, 
    clinicId,
    isClinicService,
    setIsShowRequestModel,
    isShowCloseButton
}) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)
    const [isClinicsLoading, setIsClinicsLoading] = useState(false)

    const [clinics, setClinics] = useState([])

    const [name, setName] = useState(service ? service.name : '')
    const [cost, setCost] = useState(service ? service.cost : '')
    const [clinic, setClinic] = useState(clinicId ? clinicId : '')


    const [nameError, setNameError] = useState()
    const [costError, setCostError] = useState()
    const [clinicError, setClinicError] = useState()


    useEffect(() => {

        if(service || clinicId) {
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

    const resetForm = () => {
        setName('')
        setCost('')

        setNameError()
        setCostError()
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!clinic) return setClinicError(translations[lang]['clinic is required'])

        if(!cost) return setCostError(translations[lang]['cost is required'])
        

        const service = {
            name,
            clinicId: clinic,
            cost: Number.parseFloat(cost)
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/services`, service)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            isClinicService ? setReload(reload + 1) : null
            isClinicService ? setShowFormModal(false) : null
            clinicId ? null : setReload(reload + 1)
            !clinicId ? setShowFormModal(false) : null
            clinicId ? resetForm() : null
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'cost') return setCostError(errorResponse.message)

                if(errorResponse.field === 'mode') {
                    setShowFormModal(false)
                    dispatch(setIsShowModal(true))
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

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!cost) return setCostError(translations[lang]['cost is required'])
        

        const serviceData = {
            name,
            cost: Number.parseFloat(cost)
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/services/${service._id}`, serviceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setService()
            setReload(reload + 1)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'cost') return setCostError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }


    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{ service ? translations[lang]['Update Service'] : translations[lang]['Create Service']}</h2>
                <span className="hover" onClick={e => { 
                    setService ? setService() : null
                    setShowFormModal(false)
                }}>
                    <CloseIcon />
                </span>
            </div>
            {
                isClinicsLoading ?
                <CircularLoading />
                :
                <div>
                <div className="modal-body-container">
                    <form 
                    id="service-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={service ? handleUpdate : handleSubmit}
                    >
                        <div className="form-input-container">
                            <label>{translations[lang]['Name']}</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onClick={e => setNameError()}
                            />
                            <span className="red">{nameError}</span>
                        </div>
                        {
                            service || clinicId ?
                            null
                            :
                            <div className="form-input-container">
                                <label>{translations[lang]['Clinic']}</label>
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
                        <div className="form-input-container">
                            <label>{translations[lang]['Cost']}</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder=""
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            onClick={e => setCostError()}
                            />
                            <span className="red">{costError}</span>
                        </div>                       
                    </form>
                </div>
                <div className="modal-form-btn-container">
                            <div>   
                                { 
                                    isSubmit ?
                                    <TailSpin
                                    height="25"
                                    width="25"
                                    color="#4c83ee"
                                    />
                                    :
                                    <button
                                    form="service-form"
                                    className="normal-button white-text action-color-bg"
                                    >{service ? translations[lang]['Update'] : clinicId ? translations[lang]['Create Service'] : translations[lang]['Create'] }</button>
                                } 
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setService ? setService() : null
                                    setShowFormModal(false)
                                }}
                                >{translations[lang]['Close']}</button>
                            </div>
                    </div>
                </div>
            }
            
        </div>
    </div>
}

export default ServiceFormModal
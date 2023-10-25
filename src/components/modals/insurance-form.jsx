import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const InsuranceFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, insurance, clinicId }) => {

    const lang = useSelector(state => state.lang.lang)
    const user = useSelector(state => state.user.user)
    const clinics = useSelector(state => state.clinics.clinics)

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(isUpdate ? insurance.name : '')
    const [clinic, setClinic] = useState()
    const [startDate, setStartDate] = useState(isUpdate ? insurance.startDate && format(new Date(insurance.startDate), 'yyyy-MM-dd') : '')
    const [endDate, setEndDate] = useState(isUpdate ? insurance.endDate && format(new Date(insurance.endDate), 'yyyy-MM-dd') : '')

    const [nameError, setNameError] = useState()
    const [clinicError, setClinicError] = useState()
    const [startDateError, setStartDateError] = useState()
    const [endDateError, setEndDateError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(user.roles.includes('OWNER') && !clinic) return setClinicError(translations[lang]['clinic is required']) 
        
        if(!startDate) return setStartDateError(translations[lang]['start date is required'])

        if(!endDate) return setEndDateError(translations[lang]['end date is required'])

        const insuranceData = { name, clinicId: clinicId ? clinicId : clinic, startDate, endDate }

        setIsSubmit(true)
        serverRequest.post(`/v1/insurances`, insuranceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'startDate') return setStartDateError(errorResponse.message)

                if(errorResponse.field === 'endDate') return setEndDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])  
        
        if(!startDate) return setStartDateError(translations[lang]['start date is required'])

        if(!endDate) return setEndDateError(translations[lang]['end date is required'])

        const insuranceData = { name, startDate, endDate }

        setIsSubmit(true)
        serverRequest.put(`/v1/insurances/${insurance._id}`, insuranceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setIsUpdate(false)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'startDate') return setStartDateError(errorResponse.message)

                if(errorResponse.field === 'endDate') return setEndDateError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? translations[lang]['Update Insurance Company'] : translations[lang]['Add Insurance Company']}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <form 
                    id="insurance-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}
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
                            isUpdate || clinicId ?
                            null
                            :
                            <div className="form-input-container">
                                <label>{translations[lang]['Select Clinic']}</label>
                                <select
                                className="form-input"
                                onClick={e => setClinicError()}
                                onChange={e => setClinic(e.target.value)}
                                >
                                    <option disabled selected>{translations[lang]['Select Clinic']}</option>
                                    {clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                                </select>
                                <span className="red">{clinicError}</span>
                            </div> 
                        }
                        <div className="form-input-container">
                            <label>{translations[lang]['Start Date']}</label>
                            <input 
                            type="date" 
                            className="form-input" 
                            placeholder=""
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            onClick={e => setStartDateError()}
                            />
                            <span className="red">{startDateError}</span>
                        </div> 
                        <div className="form-input-container">
                            <label>{translations[lang]['End Date']}</label>
                            <input 
                            type="date"
                            className="form-input" 
                            placeholder=""
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            onClick={e => setEndDateError()}
                            />
                            <span className="red">{endDateError}</span>
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
                                    form="insurance-form"
                                    className="normal-button white-text action-color-bg"
                                    >{isUpdate ? translations[lang]['Update'] : translations[lang]['Add']}</button>
                                } 
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowFormModal(false)
                                    setIsUpdate(false)
                                }}
                                >{translations[lang]['Close']}</button>
                            </div>
                </div>
                </div>            
        </div>
    </div>
}

export default InsuranceFormModal
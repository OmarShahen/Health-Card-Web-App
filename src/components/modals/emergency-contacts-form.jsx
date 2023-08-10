import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { capitalizeFirstLetter } from '../../utils/formatString'

const EmergencyContactFormModal = ({ reload, setReload, setShowModalForm, mode, setMode, contact }) => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)
    const [name, setName] = useState(mode === 'EDITE' ? contact.name : '')
    const [relative, setRelative] = useState(mode === 'EDITE' ? contact.relation : 'friend')
    const [countryCode, setCountryCode] = useState(mode === 'EDITE' ? contact.countryCode : 20)
    const [phone, setPhone] = useState(mode === 'EDITE' ? contact.phone : '')

    const [nameError, setNameError] = useState()
    const [relativeError, setRelativeError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()

    const relativity = [
        'friend', 'brother', 'husband', 'son',
        'father', 'mother', 'sister', 'daughter',
        'wife', 'partner', 'boss', 'assistant',
        'doctor', 'family member', 'neighbour', 'others'
    ]


    const handleAddSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!relative) return setRelativeError(translations[lang]['relation is required'])
        
        if(!countryCode) return setCountryCodeError(translations[lang]['country code is required'])

        if(!phone) return setPhoneError(translations[lang]['phone is required'])

        const contactData = { 
            name, 
            countryCode: 20, 
            phone: Number.parseInt(phone), 
            relation: relative 
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/patients/${patientId}/emergency-contacts`, contactData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            resetForm()
            setReload(reload+1)
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'countryCode') return setCountryCodeError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'relation') return setRelativeError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!relative) return setRelativeError(translations[lang]['relation is required'])
        
        if(!countryCode) return setCountryCodeError(translations[lang]['country code is required'])

        if(!phone) return setPhoneError(translations[lang]['phone is required'])

        const contactData = { 
            name, 
            countryCode: Number.parseInt(countryCode), 
            phone: Number.parseInt(phone), 
            relation: relative.toUpperCase()
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/patients/${patientId}/emergency-contacts/${contact._id}`, contactData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            resetForm()
            setReload(reload+1)
            setShowModalForm(false)
            setMode('')
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }

    const resetForm  = () => {

        setName('')
        setRelative('friend')
        setCountryCode(20)
        setPhone('')

        setNameError('')
        setRelativeError('')
        setCountryCodeError(20)
        setPhoneError('')
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                {
                    mode === 'EDITE' ?
                    <h2>{translations[lang]['Update Emergency Contact']}</h2>
                    :
                    <h2>{translations[lang]['Add Emergency Contact']}</h2>
                }
            </div>
            <div className="modal-body-container">
                <form 
                id="contact-form" 
                className="modal-form-container responsive-form body-text" 
                onSubmit={mode === 'EDITE' ? handleUpdateSubmit : handleAddSubmit}
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
                    <div className="form-input-container">
                        <label>{translations[lang]['Relation']}</label>
                        <select 
                        name="relative" 
                        id="relative"
                        className="form-input"
                        onChange={e => {
                            setRelative(e.target.value)
                            setRelativeError()
                        }}
                        >
                            { 
                            mode === 'EDITE' ? 
                            relativity.map(relativeDegree => {
                                if(contact.relation === relativeDegree) {
                                    return <option value={relativeDegree} selected>{translations[lang][capitalizeFirstLetter(relativeDegree)]}</option>
                                }

                                return <option value={relativeDegree}>{translations[lang][capitalizeFirstLetter(relativeDegree)]}</option>
                            })
                            :
                            relativity.map(relativeDegree => <option value={relativeDegree}>{translations[lang][capitalizeFirstLetter(relativeDegree)]}</option>)  
                            }
                        </select>
                        <span className="red">{relativeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>{translations[lang]['Phone']}</label>
                        <input 
                        type="tel"
                        className="form-input" 
                        placeholder=""
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        onClick={e => setPhoneError()}
                        />
                        <span className="red">{phoneError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="contact-form"
                        className="normal-button white-text action-color-bg"
                        >{ mode === 'EDITE' ? translations[lang]['Update'] : translations[lang]['Add'] }</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setMode('')
                        setShowModalForm(false)
                    }}
                    >{translations[lang]['Close']}</button>
                </div>
            </div>
        </div>
    </div>
}

export default EmergencyContactFormModal
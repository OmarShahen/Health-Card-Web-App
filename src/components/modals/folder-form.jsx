import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const FolderFormModal = ({ 
    setShowFormModal, 
    reload, 
    setReload, 
    isUpdate, 
    setIsUpdate, 
    folder, 
    parentFolderId,
    patientId,
    clinicId
}) => {

    const lang = useSelector(state => state.lang.lang)
    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [clinics, setClinics] = useState([])

    const [name, setName] = useState(isUpdate ? folder.name : '')
    const [clinic, setClinic] = useState()

    const [nameError, setNameError] = useState()
    const [clinicError, setClinicError] = useState()


    useEffect(() => {

        if(isUpdate || (!user.roles.includes('OWNER') && !user.roles.includes('DOCTOR'))) {
            return
        }

        let endpointURL = `/v1/clinics-owners/owners/${user._id}`

        if(user.roles.includes('DOCTOR')) {
            endpointURL = `/v1/clinics/doctors/${user._id}`
        }

        serverRequest.get(endpointURL)
        .then(response => {
            const clinics = response.data.clinics
            setClinics(clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if((!parentFolderId && !patientId) && !clinic) return setClinicError(translations[lang]['clinic is required']) 

        const folderData = {
            name,
            clinicId: clinicId ? clinicId : clinic,
            creatorId: user._id,
            parentFolderId,
            patientId
        }

        setIsSubmit(true)
        let endpointURL = patientId ? `/v1/folders/patients` : '/v1/folders'
        serverRequest.post(endpointURL, folderData)
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

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])  
        
        const folderData = { name }

        setIsSubmit(true)
        serverRequest.patch(`/v1/folders/${folder._id}/name`, folderData)
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

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>{isUpdate ? translations[lang]['Update Folder'] : translations[lang]['Add Folder']}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <form 
                    id="folder-form" 
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
                            isUpdate || parentFolderId || patientId ?
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
                                    form="folder-form"
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

export default FolderFormModal
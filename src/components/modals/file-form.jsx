import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import translations from '../../i18n'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const FileFormModal = ({ setShowFormModal, reload, setReload, setIsUpdate, file }) => {

    const lang = useSelector(state => state.lang.lang)
    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState(file.name)

    const [nameError, setNameError] = useState()

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])  
        
        const fileData = { name }

        setIsSubmit(true)
        serverRequest.patch(`/v1/files/${file._id}/name`, fileData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
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
                <h2>{translations[lang]['Update File']}</h2>
            </div>  
                <div>
                <div className="modal-body-container">
                    <form 
                    id="folder-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={handleUpdate}
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
                                    >{translations[lang]['Update']}</button>
                                } 
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowFormModal(false)
                                }}
                                >{translations[lang]['Close']}</button>
                            </div>
                </div>
                </div>            
        </div>
    </div>
}

export default FileFormModal
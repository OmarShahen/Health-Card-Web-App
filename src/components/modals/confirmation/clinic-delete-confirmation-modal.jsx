import { useState } from 'react'
import '../modals.css'
import { serverRequest } from '../../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const ClinicDeleteConfirmationModal = ({ ownership, reload, setReload, setIsShowModal }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(false)

    const deleteClinic = () => {
        setIsLoading(true)
        serverRequest.delete(`/v1/clinics-owners/${ownership._id}`)
        .then(response => {
            setIsLoading(false)
            setReload(reload + 1)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
            setIsShowModal(false)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }
   

    return <div className="modal">
        <div className="confirmation-modal-container body-text">
             <div className="confirmation-modal-header">
                <h3>
                    <ErrorIcon />
                    {translations[lang]['Delete']}
                </h3>
            </div>   
            <div className="body-text confirmation-modal-body">
                <p>
                    { lang === 'en' ? "You're about to permanently delete this clinic ownership and all it's attachments." : null }
                </p>
                <p>
                    {translations[lang]["If you're not sure, you can resolve or close it instead"]}
                </p>
            </div>    
            <div className="confirmation-modal-buttons-container">
                {
                    isLoading ?
                    <TailSpin width="25" height="25" color="#DE350B" />
                    :
                    <button 
                    className="button delete-button" 
                    onClick={e => {
                        deleteClinic()
                    }}
                    >{translations[lang]['Delete']}</button>
                }
                <button 
                className="button abort-button"
                onClick={e => setIsShowModal(false)}
                >{translations[lang]['Cancel']}</button>
            </div>        
        </div>
    </div>
}

export default ClinicDeleteConfirmationModal
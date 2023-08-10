import { useState } from 'react'
import '../modals.css'
import { serverRequest } from '../../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import './confirmation-modal.css'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const InsurancePolicyStatusConfirmationModal = ({ insurancePolicy, reload, setReload, setIsShowModal, setViewStatus, status }) => {

    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(false)

    const updateInsurancePolicyStatus = () => {
        setIsLoading(true)
        serverRequest.patch(`/v1/insurance-policies/${insurancePolicy._id}/status`, { status })
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setReload(reload + 1)
            setViewStatus('ALL')
            setIsShowModal(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
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
                    <CalendarMonthOutlinedIcon style={{ color: '#5c60f5'}} />
                    {translations[lang]['Update']}
                </h3>
            </div>   
            <div className="body-text confirmation-modal-body">
                <p>
                    {"You're about to update this insurance policy status"}
                </p>
                <p>
                    {translations[lang]["If you're not sure, you can resolve or close it instead"]}
                </p>
            </div>    
            <div className="confirmation-modal-buttons-container">
                {
                    isLoading ?
                    <TailSpin width="25" height="25" color="#5c60f5" />
                    :
                    <button 
                    className="button" 
                    onClick={e => {
                        updateInsurancePolicyStatus()
                    }}
                    >{translations[lang]['Update']}</button>
                }
                <button 
                className="button abort-button"
                onClick={e => setIsShowModal(false)}
                >{translations[lang]['Cancel']}</button>
            </div>        
        </div>
    </div>
}

export default InsurancePolicyStatusConfirmationModal
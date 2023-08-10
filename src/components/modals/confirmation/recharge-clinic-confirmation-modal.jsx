import '../modals.css'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../../transitions/card-transitions'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowRenewModal } from '../../../redux/slices/modalSlice'
import translations from '../../../i18n'

const RechargeClinicConfirmationModal = () => {

    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    const dispatch = useDispatch()
   

    return <div className="modal">
        <CardTransition>
            <div className="confirmation-modal-container body-text">
                <div className="confirmation-modal-header">
                    <h3>
                        <ErrorIcon style={{ color: '#5c60f5'}} />
                        {translations[lang]['Recharge Clinic']}
                    </h3>
                </div>   
                <div className="body-text confirmation-modal-body">
                    {
                        lang === 'en' ?
                        <p>
                        We're sorry to inform you that your subscription to our system has expired.<br />
                        To continue using our services, please renew your subscription.
                        </p>
                        :
                        <p>
                            للاسف لقد تم انتهاء الاشتراك الخاص بك. من اجل متابعة الاستخدام يجب تجديد الاشتراك
                        </p>
                    }
                </div>    
                <div className="confirmation-modal-buttons-container">
                    <button 
                    className="button"
                    onClick={e => {
                        dispatch(setIsShowRenewModal(false))
                        navigate('/billing/packages')
                    }}
                    >{translations[lang]['Renew']}</button>
                    <button 
                    className="button abort-button"
                    onClick={e => dispatch(setIsShowRenewModal(false))}
                    >{translations[lang]['Cancel']}</button>
                </div>        
            </div>
        </CardTransition>
    </div>
}

export default RechargeClinicConfirmationModal
import '../modals.css'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../../transitions/card-transitions'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowModal } from '../../../redux/slices/modalSlice'
import translations from '../../../i18n'

const UpgradeAccountConfirmationModal = () => {

    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    const dispatch = useDispatch()
   

    return <div className="modal">
        <CardTransition>
            <div className="confirmation-modal-container body-text">
                <div className="confirmation-modal-header">
                    <h3>
                        <ErrorIcon style={{ color: '#5c60f5'}} />
                        {translations[lang]['Upgrade Account']}
                    </h3>
                </div>   
                <div className="body-text confirmation-modal-body">
                    <p>
                        { 
                        lang === 'en' ? 
                        `Uh-oh! It looks like you've exceeded the limits of our free tier.
                        Upgrade
                        to our premium plan and unlock all of our features and use 
                        the service without any restrictions. 
                        `
                        :
                        `يبدو انك وصلت الي الحد الاقصي في الاستخدام المجاني للتطبيق. للاستمتاع بكل المزاية في التطبيق قم بترقية حسابك`
                        }
                    </p>
                </div>    
                <div className="confirmation-modal-buttons-container">
                    <button 
                    className="button"
                    onClick={e => {
                        dispatch(setIsShowModal(false))
                        navigate('/billing/packages')
                    }}
                    >{translations[lang]['Upgrade']}</button>
                    <button 
                    className="button abort-button"
                    onClick={e => dispatch(setIsShowModal(false))}
                    >{translations[lang]['Cancel']}</button>
                </div>        
            </div>
        </CardTransition>
    </div>
}

export default UpgradeAccountConfirmationModal
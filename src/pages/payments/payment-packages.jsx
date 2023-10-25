import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import { isRolesValid } from '../../utils/roles';
import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../../utils/numbers'
import CheckIcon from '@mui/icons-material/Check'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { setBillPlan } from '../../redux/slices/billSlice';
import translations from '../../i18n';

const PaymentsPackagesPage = ({ roles }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [is12Month, setIs12Month] = useState(false)
    const [is6Month, setIs6Month] = useState(false)
    const [is3Month, setIs3Month] = useState(false)
    const [is1Month, setIs1Month] = useState(false)

    useEffect(() => { 
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    const features = [
        'Record unlimited encounters',
        'Record unlimited prescriptions',
        'Record unlimited appointments',
        'Record unlimited invoices',
        'Send unlimited Email notifications for doctors on new appointment',
        'Invite unlimited doctors to clinic',
        'Invite unlimited owners to clinic',
        //`Send patient's prescriptions through SMS`
    ]


    return <div className="page-container">        
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Billing Plans"]} 
            /> 
        
           <div className="billing-plans-container">
                <h5>{translations[lang]['Subscribe to the plan that best suits your needs.']}</h5>
                <div className="billing-plans-wrapper">
                    <div className="cards-grey-container">
                        <ul className="plans-features-container">
                            {features.map(feature => <li className="body-text grey-text">
                                <CheckIcon htmlColor="green" />
                                {translations[lang][feature]}
                            </li>)}
                        </ul>
                    </div>
                    <div>
                        <div 
                        onClick={e => {
                            setIs12Month(false)
                            setIs6Month(false)
                            setIs3Month(false)
                            setIs1Month(!is1Month)
                        }} 
                        className="plan-package-container"
                        >
                            <div className="circle-icon-container">
                            { is1Month ? <CheckCircleIcon style={{ color: 'green' }} /> : <CircleOutlinedIcon /> }
                                <div>
                                    <strong>{translations[lang]['1 Month']}</strong>
                                    <span className="grey-text body-text">{translations[lang]['Billed monthly']}</span>
                                </div>
                            </div>
                            <div className="plan-price-container">
                                <strong>{formatMoney(350)}</strong>
                                <span className="grey-text body-text">{translations[lang]['/per month']}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    is12Month || is6Month || is3Month || is1Month ?
                    <div className="margin-top-1 billing-plans-button-container">
                        <button 
                        className="action-color-bg white-text normal-button"
                        onClick={e => {

                            let billPlan = {}

                            if(is12Month) {
                                billPlan = { planName: '12 month', planDaysDuration: 365, planPrice: 550 * 12 }
                            } else if(is6Month) {
                                billPlan = { planName: '6 month', planDaysDuration: 180, planPrice: 650 * 6 }
                            } else if(is3Month) {
                                billPlan = { planName: '3 month', planDaysDuration: 90, planPrice: 750 * 3 }
                            } else if(is1Month) {
                                billPlan = { planName: '1 month', planDaysDuration: 30, planPrice: 350 }
                            }

                            dispatch(setBillPlan(billPlan))
                            navigate('/billing/billing-data')
                        }}
                        >
                            {translations[lang]['Upgrade']}
                        </button>
                    </div>
                    :
                    null
                }
           </div>
            
        </div>
        
    </div>
}

export default PaymentsPackagesPage
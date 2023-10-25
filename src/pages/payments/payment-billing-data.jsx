import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import { isRolesValid } from '../../utils/roles';
import { useNavigate } from 'react-router-dom';
import { serverRequest } from '../../components/API/request';
import { toast } from 'react-hot-toast'
import PaymentLoadingModal from './payment-loading'
import translations from '../../i18n';

const PaymentsBillingDataPage = ({ roles }) => {

    const navigate = useNavigate()
    
    const user = useSelector(state => state.user.user)
    const bill = useSelector(state => state.bill)
    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(false)

    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [email, setEmail] = useState(user.email)
    const [phone, setPhone] = useState()

    const [clinic, setClinic] = useState()
    const [clinics, setClinics] = useState([])

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [clinicError, setClinicError] = useState()

    useEffect(() => { 
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')

        if(Object.entries(bill).length == 0) {
            navigate('/billing/packages')
        }

    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics-owners/owners/${user._id}/owner-created`)
        .then(response => {
            setClinics(response.data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!clinic) return setClinicError(translations[lang]['clinic is required'])

        if(!firstName) return setFirstNameError(translations[lang]['first name is required'])
        
        if(!lastName) return setLastNameError(translations[lang]['last name is required'])

        if(!phone) return setPhoneError(translations[lang]['phone is required'])

        try {

            setIsLoading(true)

            const clinicRequest = await serverRequest.post(`/v1/subscriptions/clinics/${clinic}/subscription-expired`)
            
            if(clinicRequest.data.isSubscriptionActive) {
                setClinicError(translations[lang]['Clinic is already registered in a plan'])
                setIsLoading(false)
                return
            }

            const paymentData = {
                firstName,
                lastName,
                email,
                clinicId: clinic,
                phone: Number.parseInt(phone),
                planName: bill.planName,
                planPrice: bill.planPrice * 100,
                planDaysDuration: bill.planDaysDuration
            }

            const payment = await serverRequest.post(`/v1/payments/paymob`, paymentData)

            setIsLoading(false)

            location.href = payment.data.iFrameURL

        } catch(error) {
            setIsLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'firstName') return setFirstNameError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'lastName') return setLastNameError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'phone') return setPhoneError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'clinicId') return setClinicError(error?.response?.data?.message)
            

            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        }

    }


    return <div className="page-container">
        { isLoading ? <PaymentLoadingModal /> : null }
        
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Billing Data"]}
            /> 
            <br />
            <div className="cards-2-list-wrapper">
                <form className="" onSubmit={handleSubmit}>
                <div className="form-input-container margin-top-1">
                        <label>{translations[lang]['Clinic']}</label>
                        <div className="form-input-button-container">
                            <select
                            className="form-input"
                            onChange={e => setClinic(e.target.value)}
                            onClick={e => setClinicError()}
                            >
                                <option selected disabled>{translations[lang]['Select Clinic']}</option>
                                {clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                            </select>
                        </div>
                        <span className="red">{clinicError}</span>
                    </div>
                    <div className="form-input-container margin-top-1">
                        <label>{translations[lang]['First Name']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            onClick={e => setFirstNameError()}
                            />
                        </div>
                        <span className="red">{firstNameError}</span>
                    </div>
                    <div className="form-input-container margin-top-1">
                        <label>{translations[lang]['Last Name']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onClick={e => setLastNameError()}
                            />
                        </div>
                        <span className="red">{lastNameError}</span>
                    </div>
                    <div className="form-input-container margin-top-1">
                        <label>{translations[lang]['Email']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="email" 
                            className="form-input" 
                            value={email}
                            disabled
                            />
                        </div>
                    </div>
                    <div className="form-input-container margin-top-1">
                        <label>{translations[lang]['Phone']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="tel" 
                            className="form-input" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            onClick={e => setPhoneError()}
                            />
                        </div>
                        <span className="red">{phoneError}</span>
                    </div>
                    <div></div>
                    <div className="margin-top-1 billing-data-buttons-container">
                        <button 
                        className="normal-button action-color-bg white-text"
                        >
                            {translations[lang]['Buy Plan']}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    </div>
}

export default PaymentsBillingDataPage
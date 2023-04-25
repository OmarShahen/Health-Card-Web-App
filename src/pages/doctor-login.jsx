import { useState } from 'react'
import './patients.css'
import { serverRequest } from '../components/API/request'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useDispatch } from 'react-redux/es/exports'
import { setUser } from '../redux/slices/userSlice'


const DoctorLoginPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()

    const [phoneError, setPhoneError] = useState()
    const [passwordError, setPasswordError] = useState()

    const [isSubmit, setIsSubmit] = useState(false)

    const handleLogin = (e) => {

        e.preventDefault()

        if(!phone) return setPhoneError('رقم الهاتف مطلوب')

        if(!password) return setPasswordError('كلمة المرور مطلوبة')

        const loginData = { phone: Number.parseInt(phone), countryCode: 20, password }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/doctors/login', loginData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            const userData = { ...data.user, isLogged: true }
            dispatch(setUser(userData))
            navigate('/patients')
        })
        .catch(error => {
            console.error(error)
            setIsSubmit(false)

            try {

                const userError = error.response.data
                
                if(userError.field === 'phone') return setPhoneError(userError.message)

                if(userError.field === 'password') return setPasswordError(userError.message)

            } catch(error) {
                console.error(error)
            }
        })

    }

    return <div className="forms-page-container">
    <div className="patient-form-section-container">
        <form id="login-form" onSubmit={handleLogin}>
        <div className="patient-form-section-header">
            <h1>
                اهلا بيك
            </h1>
            <p className="light-text-color">
                تسجيل الدخول في حساب الروشتة الالكترونية
            </p>
        </div>
        <div>
            <div className="form-input-container">
                <label>رقم الهاتف</label>
                <input 
                type="tel" 
                className="form-input" 
                placeholder="رقم الهاتف" 
                onChange={e => setPhone(e.target.value)}
                onClick={e => setPhoneError('')}
                />
                <span className="form-error-message">{phoneError}</span>
            </div>
            <div className="form-input-container">
                <label>كلمة المرور</label>
                <input 
                type="password" 
                className="form-input" 
                placeholder="كلمة السر"
                onChange={e => setPassword(e.target.value)}
                onClick={e => setPasswordError('')} 
                />
                <span className="form-error-message">{passwordError}</span>
            </div>
        </div>
        <div>
            <p className="light-text-color small-description-text">
            </p>
            <button className="button">
                {
                    isSubmit ?
                    <TailSpin
                    height="40"
                    width="40"
                    color="white"
                    />
                    :
                    'تسجيل الدخول'
                }
            </button>
        </div>
        <div>
        </div>
        </form>
    </div>
    </div>
}

export default DoctorLoginPage
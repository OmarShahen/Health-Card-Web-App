import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import { NavLink } from 'react-router-dom'
import PageTransition from '../../components/transitions/page-transitions'
import translations from '../../i18n'

const ForgotPasswordPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const lang = useSelector(state => state.lang.lang)

    const [email, setEmail] = useState()
    const [isSubmit, setIsSubmit] = useState(false)

    const [emailError, setEmailError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError(translations[lang]['email is required'])

        setIsSubmit(true)
        serverRequest.post('/v1/auth/forgot-password', { email })
        .then(response => {
            setIsSubmit(false)
            return navigate(`/reset-password/${email}`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            const errorData = error.response.data

            if(errorData.field === 'email' || errorData.field === 'isSent') return setEmailError(errorData.message)

        })


    }

    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        {translations[lang]['Forgot Password?']}
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>{translations[lang]['Email']}</label>
                        <input 
                        type="email" 
                        className="form-input"
                        onChange={e => setEmail(e.target.value)}
                        onClick={e => setEmailError()}
                        />
                        <span className="red">{emailError}</span>
                    </div>
                    <div className="submit-btn-container">
                        {
                            isSubmit ?
                            <div className="flex-center">
                                <TailSpin width="40" height="40" color="#4c83ee" />
                            </div>
                            :
                            <input type="submit" className="action-color-bg white-text" value={translations[lang]["Continue"]} />
                        }
                        <div className="center margin-top-1">
                            <NavLink to="/login" className="grey bold-text">{translations[lang]['Back']}</NavLink>
                        </div>
                    </div>
                    
                </div>
            </form>
    </div>
    </PageTransition>
}

export default ForgotPasswordPage
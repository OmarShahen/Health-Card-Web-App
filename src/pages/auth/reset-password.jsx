import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../../components/transitions/page-transitions'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const ResetPasswordPage = () => {

    const navigate = useNavigate()

    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const email = pagePath.split('/')[2]
    const verificationCode = pagePath.split('/')[3]

    const [isSubmit, setIsSubmit] = useState(false)

    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const [passwordError, setPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!password) return setPasswordError(translations[lang]['password is required'])

        if(password.length < 8) return setPasswordError(translations[lang]['password length must be at least 8 characters']) 

        if(!confirmPassword) return setConfirmPasswordError(translations[lang]['confirm password is required'])

        if(password != confirmPassword) return setConfirmPasswordError(translations[lang]['not the same new password'])

        const verificationData = { 
            email, 
            verificationCode: Number.parseInt(verificationCode),
            password
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/auth/reset-password`, verificationData)
        .then(response => {
            setIsSubmit(false)
            navigate('/login')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'password') return setPasswordError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }


    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        {translations[lang]['Choose a New Password']}
                    </h3>
                    <h6 className="grey">{translations[lang]['Create a new password that is at least 8 characters long']}</h6>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>{translations[lang]['New Password']}</label>
                        <input 
                        type="password" 
                        className="form-input"
                        onChange={e => setPassword(e.target.value)}
                        onClick={e => setPasswordError()}
                        />
                        <span className="red">{passwordError}</span>
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="form-input-container">
                        <label>{translations[lang]['Confirm Password']}</label>
                        <input 
                        type="password" 
                        className="form-input"
                        onChange={e => setConfirmPassword(e.target.value)}
                        onClick={e => setConfirmPasswordError()}
                        />
                        <span className="red">{confirmPasswordError}</span>
                    </div>
                    <div className="submit-btn-container">
                        {
                            isSubmit ?
                            <div className="flex-center">
                                <TailSpin width="40" height="40" color="#4c83ee" />
                            </div>
                            :
                            <div>    
                                <input type="submit" className="action-color-bg white-text" value={translations[lang]["Submit"]} />
                            </div>
                        }
                    </div>
                    <div className="form-note-container">
                        <span>{translations[lang]["Didn't receive the code?"]} <strong  onClick={e => sendEmailVerificationCode()} className="action-color-text hover">{translations[lang]['Send again']}</strong></span>
                    </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default ResetPasswordPage
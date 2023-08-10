import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../../components/transitions/page-transitions'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const ForgotPasswordVerificationCodePage = () => {

    const navigate = useNavigate()

    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const email = pagePath.split('/')[2]

    const [isSubmit, setIsSubmit] = useState(false)

    const [verificationCode, setVerificationCode] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!verificationCode) return setVerificationCodeError(translations[lang]['verification code is required'])

        const verificationData = { email, verificationCode: Number.parseInt(verificationCode) }

        setIsSubmit(true)
        serverRequest.post(`/v1/auth/verify/reset-password/verifications-codes`, verificationData)
        .then(response => {
            setIsSubmit(false)
            navigate(`/reset-password/${email}/${verificationCode}`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'verificationCode' || errorData.field === 'email') return setVerificationCodeError(errorData.message)

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
                        {translations[lang]['Forgot Password Verification Code']}
                    </h3>
                    <h6 className="grey">{translations[lang]['Type in the code we sent to']} <strong>{email}.</strong></h6>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>{translations[lang]['Verification Code']}</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setVerificationCode(e.target.value)}
                        onClick={e => setVerificationCodeError()}
                        />
                        <span className="red">{verificationCodeError}</span>
                    </div>
                    <div>
                        <div className="policy-container">
                            {translations[lang]['Your verification code will expire in']} <span className="">1</span> {translations[lang]['hour']}
                        </div>
                    </div>
                    <div className="submit-btn-container">
                        {
                            isSubmit ?
                            <div className="flex-center">
                                <TailSpin width="40" height="40" color="#4c83ee" />
                            </div>
                            :
                            <div>
                                {/*<div className="mail-success-message-container green">
                                    <CheckCircleIcon /> Email sent successfully!
                                </div>*/}
                                <input type="submit" className="action-color-bg white-text" value={translations[lang]["Continue"]} />
                            </div>
                        }
                    </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default ForgotPasswordVerificationCodePage
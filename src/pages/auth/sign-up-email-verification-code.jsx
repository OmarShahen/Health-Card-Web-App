import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import PageTransition from '../../components/transitions/page-transitions'
import logo from '../../assets/khatab.png'
import translations from '../../i18n'

const SignUpEmailVerificationCodePage = () => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [verificationCode, setVerificationCode] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!verificationCode) return setVerificationCodeError(translations[lang]['verification code is required'])

        setIsSubmit(true)
        serverRequest.post(`/v1/auth/verify/users/${user._id}/verification-codes/${verificationCode}`)
        .then(response => {
            setIsSubmit(false)
            let data = response.data
            data.user.accessToken = data.token
            const isLogged = user.roles.includes('STAFF') ? false : true
            sessionStorage.setItem('user', JSON.stringify({ ...data.user, isLogged, isCelebrate: true }))
            dispatch(setUser({ ...data.user, isLogged, isCelebrate: true }))
            user.roles.includes('STAFF') ? navigate('/signup/staffs/clinics') : navigate('/patients')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'code') return setVerificationCodeError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    const sendEmailVerificationCode = () => {
        setIsSubmit(true)
        serverRequest.post(`/v1/auth/users/${user._id}/send/verification-codes`)
        .then(response => {
            setIsSubmit(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
        })
    }

    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                <div className="center">
                        <img src={logo} style={{ height: "4rem"  }} />
                    </div>
                    
                    <h6 className="grey body-text">{translations[lang]['Type in the code we sent to']} <strong>{user.email}.</strong></h6>
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
                            {translations[lang]['Your verification code will expire in']} <span className="">2</span> {translations[lang]['minutes']}
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
                    <div className="form-note-container">
                        <span>{translations[lang]["Didn't receive the code?"]} <strong  onClick={e => sendEmailVerificationCode()} className="action-color-text hover">{translations[lang]['Send again']}</strong></span>
                    </div>
                    <div className="center margin-top-1">
                            <span onClick={e => navigate(-1)} className="grey bold-text signup-back-button-container">{translations[lang]['Back']}</span>
                        </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default SignUpEmailVerificationCodePage
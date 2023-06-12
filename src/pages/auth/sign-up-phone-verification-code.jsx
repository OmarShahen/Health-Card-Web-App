import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import ReactInputVerificationCode from 'react-input-verification-code'
import VerificationInput from "react-verification-input"

const SignUpPhoneVerificationCodePage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [verificationCode, setVerificationCode] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!verificationCode) return setVerificationCodeError('verification code is required')

        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/personal-info', { verificationCode })
        .then(response => {
            setIsSubmit(false)
            navigate('/signup/speciality')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'verificationCode') return setVerificationCodeError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Phone Verification Code
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>Verification Code</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setVerificationCode(e.target.value)}
                        onClick={e => setVerificationCodeError()}
                        />
                        <span className="red">{verificationCodeError}</span>
                    </div>
                    <div className="submit-btn-container">
                        {
                            isSubmit ?
                            <div className="flex-center">
                                <TailSpin width="40" height="40" color="#4c83ee" />
                            </div>
                            :
                            <input type="submit" className="action-color-bg white-text" value="Continue" />
                        }
                    </div>
                </div>
            </form>
    </div>
}

export default SignUpPhoneVerificationCodePage
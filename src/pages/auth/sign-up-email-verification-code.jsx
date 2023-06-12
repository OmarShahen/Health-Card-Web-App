import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const SignUpEmailVerificationCodePage = () => {

    const user = useSelector(state => state.user.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [verificationCode, setVerificationCode] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!verificationCode) return setVerificationCodeError('verification code is required')

        setIsSubmit(true)
        serverRequest.post(`/v1/auth/verify/users/${user._id}/verification-codes/${verificationCode}`)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            sessionStorage.setItem('user', JSON.stringify({ ...data.user, isLogged: true }))
            dispatch(setUser({ ...data.user, isLogged: true }))
            navigate('/patients')
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

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Email Verification Code
                    </h3>
                    <h6 className="grey">Type in the code we sent to <strong>{user.email}.</strong></h6>
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
                    <div>
                        <div className="policy-container">
                            Your verification code will expire in <span className="">2</span> minutes
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
                                <input type="submit" className="action-color-bg white-text" value="Continue" />
                            </div>
                        }
                    </div>
                    <div className="form-note-container">
                        <span>Didn't receive the code? <strong  onClick={e => sendEmailVerificationCode()} className="action-color-text hover">Send again</strong></span>
                    </div>
                </div>
            </form>
    </div>
}

export default SignUpEmailVerificationCodePage
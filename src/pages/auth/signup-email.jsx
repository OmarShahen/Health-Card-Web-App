import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'

const SignUpEmailPage = () => {

    const user = useSelector(state => state.user.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [email, setEmail] = useState()
    const [password,setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const [emailError, setEmailError] = useState()
    const [passwordError,setPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError('email is required')

        if(!password) return setPasswordError('password is required')

        if(!confirmPassword) return setConfirmPasswordError('confirm password is required')

        if(confirmPassword !== password) return setConfirmPasswordError('confirm password is not the same as password')

        const verifyData = {
            email,
            password
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/auth/verify/emails/${email}`)
        .then(response => {
            const userData = { ...user, ...verifyData, role: 'DOCTOR' }
            serverRequest.post('/v1/auth/signup', userData)
            .then(response => {
                setIsSubmit(false)
                const data = response.data
                const user = data.user
                dispatch(setUser(user))
                navigate('/signup/email/verification-code')
            })
            .catch(error => {
                setIsSubmit(false)
                console.error(error)
            })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'email') return setEmailError(errorData.message)

                if(errorData.field === 'password') return setPasswordError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Create your account with email
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>Email</label>
                        <input 
                        type="email" 
                        className="form-input"
                        onChange={e => setEmail(e.target.value)}
                        onClick={e => setEmailError()}
                        />
                        <span className="red">{emailError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Password</label>
                        <input 
                        type="password" 
                        className="form-input"
                        onChange={e => setPassword(e.target.value)}
                        onClick={e => setPasswordError()}
                        />
                        <span className="red">{passwordError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Confirm Password</label>
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
                            <input type="submit" className="action-color-bg white-text" value="Continue" />
                        }
                    </div>
                </div>
            </form>
    </div>
}

export default SignUpEmailPage
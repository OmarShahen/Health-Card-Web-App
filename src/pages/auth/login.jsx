import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'

const LoginPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [isSubmit, setIsSubmit] = useState(false)

    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError('email is required')

        if(!password) return setPasswordError('password is required')

        setIsSubmit(true)
        serverRequest.post('/v1/auth/login', { email, password })
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
            const errorData = error.response.data

            if(errorData.field === 'email') {
                return setEmailError(errorData.message)
            } else if(errorData.field === 'password') {
                return setPasswordError(errorData.message)
            }

        })


    }

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Sign in to your account
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
                        <div className="password-and-forgot-password-container">
                            <label>Password</label>
                            <span className="action-color-text">Forgot your password?</span>
                        </div>
                        <input 
                        type="password" 
                        className="form-input"
                        onChange={e => setPassword(e.target.value)}
                        onClick={e => setPasswordError()}
                        />
                        <span className="red">{passwordError}</span>
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

export default LoginPage
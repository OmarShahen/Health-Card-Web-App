import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'

const SignUpPersonalInfoPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [genderError, setGenderError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!firstName) return setFirstNameError('first name is required')

        if(!lastName) return setLastNameError('last name is required')

        if(!gender) return setGenderError('gender is required')

        if(!dateOfBirth) return setDateOfBirthError('date of birth is required')

        const verifyData = {
            firstName,
            lastName,
            gender,
            dateOfBirth,
        }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/personal-info', verifyData)
        .then(response => {
            setIsSubmit(false)
            dispatch(setUser(verifyData))
            navigate('/signup/speciality')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'firstName') return setFirstNameError(errorData.message)

                if(errorData.field === 'lastName') return setLastNameError(errorData.message)

                if(errorData.field === 'gender') return setGenderError(errorData.message)

                if(errorData.field === 'dateOfBirth') return setDateOfBirthError(errorData.message)
                
                if(errorData.field === 'phone') return setPhoneError(errorData.message)

                if(errorData.field === 'countryCode') return setCountryCodeError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Create Your Account In EHR System
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>First Name</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setFirstName(e.target.value)}
                        onClick={e => setFirstNameError()}
                        />
                        <span className="red">{firstNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Last Name</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setLastName(e.target.value)}
                        onClick={e => setLastNameError()}
                        />
                        <span className="red">{lastNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>Gender</label>
                        </div>
                        <select 
                        onChange={e => setGender(e.target.value)}
                        onClick={e => setGenderError()}
                        >
                            <option selected disabled>Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                        <span className="red">{genderError}</span>
                    </div>
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>Date Of Birth</label>
                        </div>
                        <input 
                        type="date" 
                        className="form-input"
                        onChange={e => setDateOfBirth(e.target.value)}
                        onClick={e => setDateOfBirthError()}
                        />
                        <span className="red">{dateOfBirthError}</span>
                    </div>
                    <div>
                        <div className="policy-container">
                            By clicking Continue, you agree to the Health Card 
                            <NavLink> User Agreement,</NavLink> <NavLink>Privacy Policy,</NavLink> and <NavLink>Cookie Policy.</NavLink>
                        </div>
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
                    <div className="form-note-container">
                        <span>Already have an account? <strong><NavLink to="/login">Login</NavLink></strong></span>
                    </div>
                </div>
            </form>
    </div>
}

export default SignUpPersonalInfoPage
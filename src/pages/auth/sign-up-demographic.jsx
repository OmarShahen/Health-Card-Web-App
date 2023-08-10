import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import PageTransition from '../../components/transitions/page-transitions'
import logo from '../../assets/khatab.png'
import { NavLink } from 'react-router-dom'
import translations from '../../i18n'

const SignUpDemographicPage = () => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()

    const [genderError, setGenderError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!gender) return setGenderError(translations[lang]['gender is required'])

        if(!dateOfBirth) return setDateOfBirthError(translations[lang]['date of birth is required'])

        const verifyData = {
            gender,
            dateOfBirth,
        }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/demographic-info', verifyData)
        .then(response => {
            setIsSubmit(false)
            dispatch(setUser({ ...user, ...verifyData }))
            navigate('/signup/roles')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'gender') return setGenderError(errorData.message)

                if(errorData.field === 'dateOfBirth') return setDateOfBirthError(errorData.message)
                
            } catch(erorr) {
                console.error(error)
            }
        })

    }

    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                <div className="center">
                        <img src={logo} style={{ height: "4rem"  }} />
                    </div>
                    <span className="body-text center margin-top-1 grey-text">
                        {translations[lang]['Tell us more about you']}
                    </span>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>{translations[lang]['Gender']}</label>
                        </div>
                        <select 
                        className="form-input"
                        onChange={e => setGender(e.target.value)}
                        onClick={e => setGenderError()}
                        >
                            <option selected disabled>{translations[lang]['Select Gender']}</option>
                            <option value="MALE">{translations[lang]['Male']}</option>
                            <option value="FEMALE">{translations[lang]['Female']}</option>
                        </select>
                        <span className="red">{genderError}</span>
                    </div>
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>{translations[lang]['Date of Birth']}</label>
                        </div>
                        <input 
                        type="date" 
                        className="form-input"
                        onChange={e => setDateOfBirth(e.target.value)}
                        onClick={e => setDateOfBirthError()}
                        />
                        <span className="red">{dateOfBirthError}</span>
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
                            <span onClick={e => navigate(-1)} className="grey bold-text signup-back-button-container">{translations[lang]['Back']}</span>
                        </div>
                    </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default SignUpDemographicPage
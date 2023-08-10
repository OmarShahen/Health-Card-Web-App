import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import PageTransition from '../../components/transitions/page-transitions'
import logo from '../../assets/khatab.png'
import translations from '../../i18n'

const SignUpPersonalInfoPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!firstName) return setFirstNameError(translations[lang]['first name is required'])

        if(!lastName) return setLastNameError(translations[lang]['last name is required'])

        const verifyData = {
            firstName,
            lastName,
        }


        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/personal-info', verifyData)
        .then(response => {
            setIsSubmit(false)
            dispatch(setUser(verifyData))
            navigate('/signup/demographic')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'firstName') return setFirstNameError(errorData.message)

                if(errorData.field === 'lastName') return setLastNameError(errorData.message)
                
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
                        {translations[lang]["Create your account in RA'AYA EHR system"]}
                    </span>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>{translations[lang]['First Name']}</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setFirstName(e.target.value)}
                        onClick={e => setFirstNameError()}
                        />
                        <span className="red">{firstNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>{translations[lang]['Last Name']}</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setLastName(e.target.value)}
                        onClick={e => setLastNameError()}
                        />
                        <span className="red">{lastNameError}</span>
                    </div>
                    <div>
                        <div className="policy-container span-text">
                            {translations[lang]["By clicking Continue, you agree to Ra'aya"]}
                            <NavLink> {translations[lang]['User Agreement']},</NavLink> <NavLink>{translations[lang]['Privacy Policy']},</NavLink> {translations[lang]['and']} <NavLink>{translations[lang]['Cookie Policy']}</NavLink>
                        </div>
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
                    </div>
                    <div className="form-note-container">
                        <span>{translations[lang]['Already have an account?']} <strong><NavLink to="/login">{translations[lang]['Login']}</NavLink></strong></span>
                    </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default SignUpPersonalInfoPage
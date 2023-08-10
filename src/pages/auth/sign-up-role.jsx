import { useState } from 'react'
import './auth.css'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PageTransition from '../../components/transitions/page-transitions'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import logo from '../../assets/khatab.png'
import { NavLink } from 'react-router-dom'
import translations from '../../i18n'

const SignUpRolePage = () => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isSubmit, setIsSubmit] = useState(false)

    const [rolesError, setRolesError] = useState()

    const [isStaff, setIsStaff] = useState(false)
    const [isDoctor, setIsDoctor] = useState(false)
    const [isOwner, setIsOwner] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault()

        let roles

        if(isStaff) {
            roles = ['STAFF']
        } else if(isDoctor) {
            roles = ['DOCTOR']
        } else if(isOwner) {
            roles = ['OWNER']
        } else {
            return setRolesError(translations[lang]['app user role is required'])
        }

        dispatch(setUser({ ...user, roles }))
        navigate(isStaff || isOwner ? '/signup/email' : '/signup/speciality')

    }


    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                <div className="center">
                        <img src={logo} style={{ height: "4rem"  }} />
                    </div>
                    <span className="body-text center margin-top-1 grey-text">
                        {translations[lang]['Why are you using the app?']}
                    </span>
                    <h6 className="grey center">{translations[lang]['Please pickup your type of user in the app']}</h6>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="choose-input-wrapper">
                    <div 
                    className="choose-input-container"
                    onClick={e => {
                        setIsOwner(!isOwner)
                        setIsDoctor(false)
                        setIsStaff(false)
                        setRolesError()
                    }}
                    >
                        {
                            isOwner ?
                            <span>
                                <CheckCircleIcon color="success" />
                            </span>
                            :
                            <span style={{ color: '#777A7E' }}>
                                <CircleOutlinedIcon />
                            </span>
                        }
                        
                        <p className="grey-text">{translations[lang]['I am a Owner']}</p>
                    </div>
                    <div 
                    className="choose-input-container"
                    onClick={e => {
                        setIsDoctor(!isDoctor)
                        setIsStaff(false)
                        setIsOwner(false)
                        setRolesError()
                    }}
                    >
                        {
                            isDoctor ?
                            <span>
                                <CheckCircleIcon color="success" />
                            </span>
                            :
                            <span style={{ color: '#777A7E' }}>
                                <CircleOutlinedIcon />
                            </span>
                        }
                        
                        <p className="grey-text">{translations[lang]['I am a Doctor']}</p>
                    </div>
                    <div 
                    className="choose-input-container"
                    onClick={e => {
                        setIsStaff(!isStaff)
                        setIsDoctor(false)
                        setIsOwner(false)
                        setRolesError()
                    }}
                    >
                        {
                            isStaff ?
                            <span>
                                <CheckCircleIcon color="success" />
                            </span>
                            :
                            <span style={{ color: '#777A7E' }}>
                                <CircleOutlinedIcon />
                            </span>
                        }
                        
                        <p className="grey-text">{translations[lang]['I am a Staff']}</p>
                    </div>
                    <div className="center">
                        <span className="red">{rolesError}</span>
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
                                <input type="submit" className="action-color-bg white-text" value={translations[lang]["Continue"]} />
                            </div>
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

export default SignUpRolePage
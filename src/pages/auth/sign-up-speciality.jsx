import { useState, useEffect } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import CancelIcon from '@mui/icons-material/Cancel'
import PageTransition from '../../components/transitions/page-transitions'
import logo from '../../assets/khatab.png'
import translations from '../../i18n'

const SignUpSpecialityPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [doctorsSpecialities, setDoctorSpecialities] = useState([])

    const [specialities, setSpecialities] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState([])

    const [specialitiesError, setSpecialitiesError] = useState()

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setDoctorSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(chosenSpecialities.length === 0) return setSpecialitiesError(translations[lang]['specialities is required']) 

        const verifyData = {
            speciality: chosenSpecialities.map(special => special._id)
        }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/speciality-info', verifyData)
        .then(response => {
            setIsSubmit(false)
            dispatch(setUser({ ...user, ...verifyData }))
            navigate('/signup/email')  
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'speciality') return setSpecialitiesError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    const addSpeciality = (value) => {
        for(let i=0;i<chosenSpecialities.length;i++) {
            if(value === chosenSpecialities[i].name) {
                return
            }
        }
        const chosenSpeciality = doctorsSpecialities.filter(special => special.name === value)
        setChosenSpecialities([...chosenSpecialities, chosenSpeciality[0]])
    }

    return <PageTransition>
    <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                <div className="center">
                        <img src={logo} style={{ height: "4rem"  }} />
                    </div>
                    <span className="body-text center margin-top-1 grey-text">
                        {translations[lang]['Choose your speciality']}
                    </span>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>{translations[lang]['Speciality']}</label>
                        </div>
                        <select 
                        className="form-input"
                        onChange={e => addSpeciality(e.target.value)}
                        onClick={e => setSpecialitiesError()}
                        >
                            <option selected disabled>{translations[lang]['Select Specialities']}</option>
                            {doctorsSpecialities.map(special => <option value={special.name}>{special.name}</option>)}
                        </select>
                        <span className="red">{specialitiesError}</span>
                    </div>
                    <div className="drug-instruction-list-container">
                        {chosenSpecialities.map(special => <span className="status-btn pending">
                            {special.name}
                            <span 
                            onClick={e => setChosenSpecialities(chosenSpecialities.filter(chosenSpecial=> special._id !== chosenSpecial._id))}>
                                <CancelIcon />
                            </span>
                            </span>)}
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

export default SignUpSpecialityPage
import { useState } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PageTransition from '../../components/transitions/page-transitions'
import logo from '../../assets/khatab.png'
import translations from '../../i18n'

const SignUpStaffClinicPage = () => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const navigate = useNavigate()

    const [isSubmit, setIsSubmit] = useState(false)

    const [clinicNumber, setClinicNumber] = useState()
    const [clinicNumberError, setClinicNumberError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!clinicNumber) return setClinicNumberError(translations[lang]['clinic ID is required'])

        const clinicData = { 
            clinicId: Number.parseInt(clinicNumber),
            userId: user._id,
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/clinics-requests/users/staffs`, clinicData)
        .then(response => {
            setIsSubmit(false)
            navigate('/users/pending')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'clinicId') return setClinicNumberError(errorData.message)

                if(errorData.field === 'userId') return setClinicNumberError(errorData.message)

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
                        {translations[lang]['Clinic Registartion']}
                    </span>
                    <h6 className="grey center">{translations[lang]['Type in the clinic ID of the clinic that you work for']}</h6>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>{translations[lang]['Clinic ID']}</label>
                        <input 
                        type="number" 
                        className="form-input"
                        value={clinicNumber}
                        onChange={e => setClinicNumber(e.target.value)}
                        onClick={e => setClinicNumberError()}
                        />
                        <span className="red">{clinicNumberError}</span>
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
                            <span onClick={e => navigate(-1)} className="grey bold-text signup-back-button-container">{translations[lang]["Back"]}</span>
                        </div>
                    </div>
                </div>
            </form>
    </div>
    </PageTransition>
}

export default SignUpStaffClinicPage
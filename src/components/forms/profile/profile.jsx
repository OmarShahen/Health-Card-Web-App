import { useState } from "react"
import './profile.css'
import { serverRequest } from "../../API/request"
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import format from "date-fns/format"
import { useDispatch, useSelector } from "react-redux"
import { setUserDetails } from "../../../redux/slices/userSlice"
import { capitalizeFirstLetter } from "../../../utils/formatString"
import translations from "../../../i18n"
import { setLang } from "../../../redux/slices/langSlice"

const ProfileForm = ({ profile, reload, setReload }) => {

    const dispatch = useDispatch()

    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)
    const [firstName, setFirstName] = useState(profile.firstName)
    const [lastName, setLastName] = useState(profile.lastName)
    const [gender, setGender] = useState(profile.gender)
    const [email, setEmail] = useState(profile.email)
    const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ? format(new Date(profile.dateOfBirth), 'yyyy-MM-dd') : '')

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [genderError, setGenderError] = useState()
    const [emailError, setEmailError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!firstName) return setFirstNameError(translations[lang]['first name is required'])

        if(!lastName) return setLastNameError(translations[lang]['last name is required'])
        
        if(!gender) return setGenderError(translations[lang]['gender is required'])

        if(!dateOfBirth) return setDateOfBirthError(translations[lang]['date of birth is required'])

        const updatedData = { 
            firstName, 
            lastName, 
            gender,
            dateOfBirth
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/users/${profile._id}`, updatedData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            const newUserData = {
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                gender: data.user.gender,
                dateOfBirth: data.user.dateOfBirth
            }
            dispatch(setUserDetails(newUserData))
            setReload(reload+1)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'firstName') return setFirstNameError(errorResponse.message)

                if(errorResponse.field === 'lastName') return setLastNameError(errorResponse.message)

                if(errorResponse.field === 'gender') return setGenderError(errorResponse.message)
                
                if(errorResponse.field === 'dateOfBirth') return setDateOfBirthError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }

    const updateUserLanguage = (value) => {
        dispatch(setLang(value))

        serverRequest.patch(`/v1/users/${profile._id}/language`, { lang: value })
        .then(response => {
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error.response.data.message)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div className="profile-form-container">
        <div className="profile-form-wrapper">
            <form id="profile-form" className="body-text cards-2-list-wrapper">
                <div>
                    <div>
                        <label>{translations[lang]['Account First Name']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            onClick={e => setFirstNameError()}
                            />
                        </div>
                        <span className="red">{firstNameError}</span>
                    </div>
                    <div>
                        <label>{translations[lang]['Account Last Name']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="text" 
                            className="form-input" 
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            onClick={e => setLastNameError()}
                            />
                        </div>
                        <span className="red">{lastNameError}</span>
                    </div>
                    <div>
                        <label>{translations[lang]['Account Gender']}</label>
                        <div className="form-input-button-container">
                            <select 
                            name="gender" 
                            id="gender"
                            className="form-input"
                            onChange={e => setGender(e.target.value)}
                            onClick={e => setGenderError()}
                            >
                                { gender === 'MALE' ? <option value="MALE" selected>{translations[lang]['Male']}</option> : <option value="MALE">{translations[lang]['Male']}</option> }
                                { gender === 'FEMALE' ? <option value="FEMALE" selected>{translations[lang]['Female']}</option> : <option value="FEMALE">{translations[lang]['Female']}</option> }
                            </select>
                        </div>
                        <span className="red">{genderError}</span>
                    </div>
                    <div>
                        <label>{translations[lang]['Roles']}</label>
                        <div className="codes-container">
                            {profile.roles.map(role => <span className="status-btn grey-bg">{capitalizeFirstLetter(role)}</span>)}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <label>{translations[lang]['Account Email']}</label>
                        <div className="form-input-button-container">
                            <input type="email" className="form-input" value={email} disabled />
                        </div>
                        <span className="red">{emailError}</span>
                    </div>
                    <div>
                        <label>{translations[lang]['Account ID']}</label>
                        <div className="form-input-button-container">
                            <input type="number" className="form-input" value={profile.userId} disabled />
                        </div>
                        <span className="red"></span>
                    </div>
                    <div>
                        <label>{translations[lang]['Date of Birth']}</label>
                        <div className="form-input-button-container">
                            <input 
                            type="date" 
                            className="form-input" 
                            value={dateOfBirth}
                            onClick={e => setDateOfBirthError()} 
                            onChange={e => setDateOfBirth(e.target.value)}
                            />
                        </div>
                        <span className="red">{dateOfBirthError}</span>
                    </div>
                    <div>
                        <label>{translations[lang]['Language']}</label>
                        <div className="form-input-button-container">
                            <select 
                            className="form-input"
                            onChange={e => updateUserLanguage(e.target.value)}
                            >
                               { lang === 'en' ? <option value="en" selected>English</option> : <option value="en">English</option> }
                               { lang === 'ar' ? <option value="ar" selected>عربي</option> : <option value="ar">عربي</option> }
                            </select>
                        </div>
                    </div>
                </div>  
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="30" height="30" color="#22D172" />
                        :
                        <button onClick={handleUpdate} className="update-btn">
                            {translations[lang]['Update']}
                        </button>
                    }
                </div>
                
            </form>
        </div>
    </div>
}

export default ProfileForm
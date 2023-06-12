import { useState, useEffect } from "react"
import './profile.css'
import { serverRequest } from "../../API/request"
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import format from "date-fns/format"

const ProfileForm = ({ profile, reload, setReload }) => {


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

        if(!firstName) return setFirstNameError('First name is required')

        if(!lastName) return setLastNameError('Last number is required')
        
        if(!gender) return setGenderError('Gender is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

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

    const resetForm  = () => {

        setFirstName('')
        setLastName('')
        setCountryCode(20)
        setGender("MALE")
        setAge(0)
        setCardId('')

        setFirstNameError()
        setLastNameError()
        setCountryCodeError()
        setGenderError()
        setAgeError()
        setCardIdError()
    }

    return <div className="profile-form-container">
        <div className="profile-form-wrapper">
            <form id="profile-form" className="body-text">
                <div>
                    <label>Account First Name</label>
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
                    <label>Account Last Name</label>
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
                    <label>Account Email</label>
                    <div className="form-input-button-container">
                        <input type="email" className="form-input" value={email} disabled />
                    </div>
                    <span className="red">{emailError}</span>
                </div>
                <div>
                    <label>Account Gender</label>
                    <div className="form-input-button-container">
                        <select 
                        name="gender" 
                        id="gender"
                        onChange={e => setGender(e.target.value)}
                        onClick={e => setGenderError()}
                        >
                            { gender === 'MALE' ? <option value="MALE" selected>Male</option> : <option value="MALE">Male</option> }
                            { gender === 'FEMALE' ? <option value="FEMALE" selected>Female</option> : <option value="FEMALE">Female</option> }
                        </select>
                    </div>
                    <span className="red">{genderError}</span>
                </div>
                <div>
                    <label>Date Of Birth</label>
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
                    {
                        isSubmit ?
                        <TailSpin width="30" height="30" color="#22D172" />
                        :
                        <button onClick={handleUpdate} className="update-btn">
                            Update
                        </button>
                    }
                </div>
                
            </form>
        </div>
    </div>
}

export default ProfileForm
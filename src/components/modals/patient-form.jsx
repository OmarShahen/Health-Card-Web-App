import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { getBirthYearByAge } from '../../utils/age-calculator'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'

const PatientFormModal = ({ reload, setReload, setShowModalForm }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [countryCode, setCountryCode] = useState(20)
    const [phone, setPhone] = useState()
    const [gender, setGender] = useState("MALE")
    const [age, setAge] = useState()
    const [cardId, setCardId] = useState()

    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [genderError, setGenderError] = useState()
    const [ageError, setAgeError] = useState()
    const [cardIdError, setCardIdError] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!firstName) return setFirstNameError('First name is required')

        if(!lastName) return setLastNameError('Last number is required')
        
        if(!countryCode) return setCountryCodeError('Country code is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!gender) return setGenderError('Gender is required')

        if(!cardId) return setCardIdError('Card Id is required')

        const patient = {
            doctorId: user._id,
            cardId: Number.parseInt(cardId),
            firstName,
            lastName,
            countryCode: Number.parseInt(countryCode),
            phone: Number.parseInt(phone),
            gender,
            dateOfBirth: String(getBirthYearByAge(age))
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/patients`, patient)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            resetForm()
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload+1) : navigate('/patients')
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'firstName') return setFirstNameError(errorResponse.message)

                if(errorResponse.field === 'lastName') return setLastNameError(errorResponse.message)

                if(errorResponse.field === 'countryCode') return setCountryCodeError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'gender') return setGenderError(errorResponse.message)

                if(errorResponse.field === 'dateOfBirth') return setAgeError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })

    }

    const resetForm  = () => {

        setFirstName('')
        setLastName('')
        setCountryCode(20)
        setPhone(0)
        setGender("MALE")
        setAge(0)
        setCardId('')

        setFirstNameError()
        setLastNameError()
        setCountryCodeError()
        setPhoneError()
        setGenderError()
        setAgeError()
        setCardIdError()
    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Add Patient</h2>
            </div>
            <div className="modal-body-container">
                <form id="patient-form" className="modal-form-container responsive-form body-text" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>First Name*</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        onClick={e => setFirstNameError()}
                        />
                        <span className="red">{firstNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Last Name*</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        onClick={e => setLastNameError()}
                        />
                        <span className="red">{lastNameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Country Code*</label>
                        <input 
                        type="number"
                        min="0"
                        className="form-input" 
                        placeholder=""
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value)}
                        onClick={e => setCountryCodeError()}
                        />
                        <span className="red">{countryCodeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Phone*</label>
                        <input 
                        type="tel"
                        className="form-input" 
                        placeholder=""
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        onClick={e => setPhoneError()}
                        />
                        <span className="red">{phoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Gender*</label>
                        <select 
                        name="gender" 
                        id="gender"
                        onChange={e => setGender(e.target.value)}
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </select>
                        <span className="red">{genderError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Age</label>
                        <input 
                        type="number"
                        min="1"
                        className="form-input" 
                        placeholder=""
                        value={age} 
                        onChange={e => setAge(e.target.value)}
                        onClick={e => setAgeError()}
                        />
                        <span className="red">{ageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Card ID*</label>
                        <input 
                        type="text"
                        className="form-input" 
                        placeholder=""
                        value={cardId} 
                        onChange={e => setCardId(e.target.value)}
                        onClick={e => setCardIdError()}
                        />
                        <span className="red">{cardIdError}</span>
                    </div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="25" height="25" color="#4c83ee" />
                        :
                        <button 
                        form="patient-form"
                        className="normal-button white-text action-color-bg"
                        >Create</button>
                    }
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => {
                        setShowModalForm(false)
                    }}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default PatientFormModal
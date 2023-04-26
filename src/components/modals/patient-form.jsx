import { useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { getBirthYearByAge } from '../../utils/age-calculator'

const PatientFormModal = ({ reload, setReload, setShowModalForm }) => {

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
            doctorId: '63efbbe147537b9ccb47e9d6',
            cardId: Number.parseInt(cardId),
            firstName,
            lastName,
            countryCode: Number.parseInt(countryCode),
            phone: Number.parseInt(phone),
            gender,
            dateOfBirth: String(getBirthYearByAge(age))
        }

        serverRequest.post(`/v1/patients`, patient)
        .then(response => {
            const data = response.data
            resetForm()
            setReload(reload+1)
            setShowModalForm(false)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
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
                <form id="patient-form" className="modal-form-container body-text" onSubmit={handleSubmit}>
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div>
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
                    <div></div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    <button 
                    form="patient-form"
                    className="normal-button white-text purple-bg"
                    >Add Patient</button>
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
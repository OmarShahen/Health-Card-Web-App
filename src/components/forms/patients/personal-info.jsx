import { useSelector } from "react-redux"
import { cities } from "../../../utils/cities"
import { capitalizeFirstLetter } from "../../../utils/formatString"
import translations from "../../../i18n"

const PatientPersonalInformationForm = (props) => {
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <div className="patient-form-wrapper" id="demographic-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Personal Information']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <label>{translations[lang]['First Name']}</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setFirstNameError()}
                onChange={e => props.setFirstName(e.target.value)}
                />
                <span className="red">{props.firstNameError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Last Name']}</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setLastNameError()}
                onChange={e => props.setLastName(e.target.value)}
                />
                <span className="red">{props.lastNameError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Phone']}</label>
                <input 
                type="tel" 
                className="form-input"
                onClick={e => props.setPhoneError()}
                onChange={e => props.setPhone(e.target.value)}
                />
                <span className="red">{props.phoneError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Gender']}</label>
                <select
                className="form-input"
                onClick={e => props.setGenderError()}
                onChange={e => props.setGender(e.target.value)}
                >
                    <option disabled selected>{translations[lang]['Select Gender']}</option>
                    <option value="MALE">{translations[lang]['Male']}</option>
                    <option value="FEMALE">{translations[lang]['Female']}</option>
                </select>
                <span className="red">{props.genderError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Social Status']}</label>
                <select
                className="form-input"
                onClick={e => props.setSocialStatusError()}
                onChange={e => props.setSocialStatus(e.target.value)}
                >
                    <option disabled selected>{translations[lang]['Select Social Status']}</option>
                    <option value="SINGLE">{translations[lang]['Single']}</option>
                    <option value="MARRIED">{translations[lang]['Married']}</option>
                    <option value="DIVORCED">{translations[lang]['Divorced']}</option>
                    <option value="WIDOWED">{translations[lang]['Widowed']}</option>
                </select>
                <span className="red">{props.socialStatusError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Age']}</label>
                <input 
                type="number" 
                className="form-input"
                onClick={e => props.setAgeError()}
                onChange={e => props.setAge(e.target.value)}
                />
                <span className="red">{props.ageError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['City']}</label>
                <select
                className="form-input"
                onClick={e => props.setCityError()}
                onChange={e => props.setCity(e.target.value)}
                >
                    <option disabled selected>{translations[lang]['Select City']}</option>
                    {cities.map(city => <option value={city}>{translations[lang][capitalizeFirstLetter(city)]}</option>)}
                </select>
                <span className="red">{props.cityError}</span>
            </div>
            {
                user.role === 'DOCTOR' ?
                <div className="form-input-container">
                    <label>Clinic</label>
                    <select
                    onChange={e => props.setClinic(e.target.value)}
                    onClick={e => props.setClinicError()}
                    >
                        <option selected disabled>Select Clinic</option>
                        {props.clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                    </select>
                    <span className="red">{props.clinicError}</span>
                </div>                
                :
                null
            }
        </div>
    </div>
}

export default PatientPersonalInformationForm
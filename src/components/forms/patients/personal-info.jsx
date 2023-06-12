import { useSelector } from "react-redux"

const PatientPersonalInformationForm = (props) => {

    const mainEgyptCities = ["Cairo", "Alexandria", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh", "Port Said", "Suez", "Ismailia", "Faiyum", "Tanta", "Zagazig", "Sohag", "Asyut", "Minya", "Beni Suef", "Qena", "Damanhur", "Damietta"]
    
    const user = useSelector(state => state.user.user)

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Personal Information
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <label>First Name</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setFirstNameError()}
                onChange={e => props.setFirstName(e.target.value)}
                />
                <span className="red">{props.firstNameError}</span>
            </div>
            <div className="form-input-container">
                <label>Last Name</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setLastNameError()}
                onChange={e => props.setLastName(e.target.value)}
                />
                <span className="red">{props.lastNameError}</span>
            </div>
            <div className="form-input-container">
                <label>Phone</label>
                <input 
                type="tel" 
                className="form-input"
                onClick={e => props.setPhoneError()}
                onChange={e => props.setPhone(e.target.value)}
                />
                <span className="red">{props.phoneError}</span>
            </div>
            <div className="form-input-container">
                <label>Gender</label>
                <select
                onClick={e => props.setGenderError()}
                onChange={e => props.setGender(e.target.value)}
                >
                    <option disabled selected>Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
                <span className="red">{props.genderError}</span>
            </div>
            <div className="form-input-container">
                <label>Social Status</label>
                <select
                onClick={e => props.setSocialStatusError()}
                onChange={e => props.setSocialStatus(e.target.value)}
                >
                    <option disabled selected>Select Social Status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                </select>
                <span className="red">{props.socialStatusError}</span>
            </div>
            <div className="form-input-container">
                <label>Age</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setAgeError()}
                onChange={e => props.setAge(e.target.value)}
                />
                <span className="red">{props.ageError}</span>
            </div>
            <div className="form-input-container">
                <label>City</label>
                <select
                onClick={e => props.setCityError()}
                onChange={e => props.setCity(e.target.value)}
                >
                    <option disabled selected>Select City</option>
                    {mainEgyptCities.map(city => <option value={city}>{city}</option>)}
                </select>
                <span className="red">{props.cityError}</span>
            </div>
            <div className="form-input-container">
                <label>Card ID</label>
                <input 
                type="number" 
                className="form-input"
                onClick={e => props.setCardIdError()}
                onChange={e => props.setCardId(e.target.value)}
                />
                <span className="red">{props.cardIdError}</span>
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
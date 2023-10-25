import { useSelector } from "react-redux"
import { cities } from "../../../utils/cities"
import { capitalizeFirstLetter } from "../../../utils/formatString"
import translations from "../../../i18n"
import CancelIcon from '@mui/icons-material/Cancel'


const PatientPersonalInformationForm = (props) => {
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const socialStatus = ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']

    return <div className="patient-form-wrapper" id="demographic-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Personal Information']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <label>{translations[lang]['Name']}*</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setFirstNameError()}
                onChange={e => props.setFirstName(e.target.value)}
                value={props.firstName}
                />
                <span className="red">{props.firstNameError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Phone']}*</label>
                <input 
                type="tel" 
                className="form-input"
                onClick={e => props.setPhoneError()}
                onChange={e => props.setPhone(e.target.value)}
                value={props.phone}
                />
                <span className="red">{props.phoneError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Gender']}*</label>
                <select
                className="form-input"
                onClick={e => props.setGenderError()}
                onChange={e => props.setGender(e.target.value)}
                >
                    <option disabled selected>{translations[lang]['Select Gender']}</option>
                    { props.gender === 'MALE' ? <option value="MALE" selected>{translations[lang]['Male']}</option> : <option value="MALE">{translations[lang]['Male']}</option> }
                    { props.gender === 'FEMALE' ? <option value="FEMALE" selected>{translations[lang]['Female']}</option> : <option value="FEMALE">{translations[lang]['Female']}</option> }
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
                    {socialStatus.map(status => {

                        if(status === props.socialStatus) {
                            return <option value={status} selected>{translations[lang][capitalizeFirstLetter(status)]}</option>
                        }

                        return <option value={status}>{translations[lang][capitalizeFirstLetter(status)]}</option>
                    })}
                </select>
                <span className="red">{props.socialStatusError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['Age']}*</label>
                <input 
                type="number" 
                className="form-input"
                onClick={e => props.setAgeError()}
                onChange={e => props.setAge(e.target.value)}
                value={props.age}
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
                    {
                    cities.map(city => {

                        if(props.city === city) {
                            return <option value={city} selected>{translations[lang][capitalizeFirstLetter(city)]}</option>
                        }

                        return <option value={city}>{translations[lang][capitalizeFirstLetter(city)]}</option>
                    })}
                </select>
                <span className="red">{props.cityError}</span>
            </div>
            {
                user.roles.includes('DOCTOR') && !props.isUpdate ?
                <div className="form-input-container">
                    <label>{translations[lang]['Clinic']}*</label>
                    <select
                    className="form-input"
                    onChange={e => props.setClinic(e.target.value)}
                    onClick={e => props.setClinicError()}
                    >
                        <option selected disabled>{translations[lang]['Select Clinic']}</option>
                        {props.clinics.map(clinic => <option value={clinic.clinic._id}>{clinic.clinic.name}</option>)}
                    </select>
                    <span className="red">{props.clinicError}</span>
                </div>                
                :
                null
            }
            {
                user.roles.includes('STAFF') && !props.isUpdate ?
                <div className="form-input-container">
                    <label>{translations[lang]['Doctors']}*</label>
                    <select
                    className="form-input"
                    onChange={e => {

                        if(e.target.value === 'ALL') {
                            props.setSelectedDoctors([...props.doctors])
                            return
                        }

                        const doctorRegisteredList = props.selectedDoctors.filter(doctor => doctor.doctorId === e.target.value)
                        if(doctorRegisteredList.length != 0) {
                            return
                        }

                        const targetDoctorList = props.doctors.filter(doctor => doctor.doctorId === e.target.value)
                        props.setSelectedDoctors([...props.selectedDoctors, ...targetDoctorList])
                    }}
                    onClick={e => props.setDoctorError()}
                    >
                        <option selected disabled>{translations[lang]['Select Doctors']}</option>
                        <option value="ALL">{translations[lang]['All']}</option>
                        {props.doctors.map(doctor => <option value={doctor?.doctor?._id}>
                            {`${doctor?.doctor?.firstName} ${doctor?.doctor?.lastName}`}
                        </option>)}
                    </select>
                    <div className="drug-instruction-list-container">
                    {props.selectedDoctors.map(doctor => <span className="status-btn pending">
                        {`${doctor?.doctor?.firstName} ${doctor?.doctor?.lastName}`}
                        <span 
                        onClick={e => props.setSelectedDoctors(props.selectedDoctors.filter(selectedDoctor => selectedDoctor?.doctorId !== doctor?.doctorId))}>
                            <CancelIcon />
                        </span>
                    </span>)}
                </div>
                    <span className="red">{props.doctorError}</span>
                </div>
                :
                null
            }
        </div>
    </div>
}

export default PatientPersonalInformationForm
import './patient.css'
import { format } from 'date-fns'

const PatientCard = ({ patient, doctorId }) => {

    const getRegistrationWithDoctorDate = (patientDoctors, doctorId) => {
        for(let i=0;i<patientDoctors.length;i++) {
            if(patientDoctors[i].doctorId === doctorId) {
                return patientDoctors[i].createdAt
            }
        }
    }

    return <div className="patient-card-container">
        <div>
            <img src={`https://avatars.dicebear.com/api/initials/${patient.firstName + ' ' + patient.lastName}.svg`} />
        </div>
        <div className="patient-card-info-container">
            <div className="name-and-phone-container">
                <strong className="subheader-text">{patient.firstName + ' ' + patient.lastName}</strong>
                <span className="light-text-color body-text">{`+${patient.countryCode}${patient.phone}`}</span>
            </div>
            <span className="body-text">12 Feb 2023</span>
        </div>
    </div>
}

export default PatientCard
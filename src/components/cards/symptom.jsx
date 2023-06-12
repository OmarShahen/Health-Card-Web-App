import CardDate from './components/date'
import './patient.css'
import { format } from 'date-fns'

const SymptomCard = ({ symptom }) => {

    const doctorName = `${symptom?.doctor.firstName} ${symptom?.doctor.lastName}`
    const doctorPhone = `+${symptom?.doctor.countryCode}${symptom?.doctor.phone}`

    return <div className="patient-card-container disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{doctorPhone}</span>
                </div>
            </div>
        </div>
        <div className="codes-container body-text patient-card-body">
                <span className="status-btn grey-bg">{symptom.symptom}</span>
        </div>
        <CardDate creationDate={symptom.createdAt} />
    </div>
}

export default SymptomCard
import CardTransition from '../transitions/card-transitions'
import CardDate from './components/date'
import './patient.css'


const SymptomCard = ({ symptom }) => {

    const doctorName = `${symptom?.doctor.firstName} ${symptom?.doctor.lastName}`
    const doctorPhone = `+${symptom?.doctor.countryCode}${symptom?.doctor.phone}`

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{symptom?.doctor?.email}</span>
                </div>
            </div>
        </div>
        <div className="body-text patient-card-body">
                <span>{symptom.symptom}</span>
        </div>
        <CardDate creationDate={symptom.createdAt} />
    </div>
    </CardTransition>
}

export default SymptomCard
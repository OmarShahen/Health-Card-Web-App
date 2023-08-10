import CardTransition from '../transitions/card-transitions'
import CardDate from './components/date'
import './patient.css'

const DiagnoseCard = ({ diagnose }) => {

    const doctorName = `${diagnose?.doctor.firstName} ${diagnose?.doctor.lastName}`
    const doctorPhone = `+${diagnose?.doctor.countryCode}${diagnose?.doctor.phone}`

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{diagnose?.doctor?.email}</span>
                </div>
            </div>
        </div>
        <div className="body-text patient-card-body">
                <span>{diagnose.diagnose}</span>
        </div>
        <CardDate creationDate={diagnose.createdAt} />
    </div>
    </CardTransition>
}

export default DiagnoseCard
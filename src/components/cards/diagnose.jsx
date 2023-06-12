import CardDate from './components/date'
import './patient.css'
import { format } from 'date-fns'

const DiagnoseCard = ({ diagnose }) => {

    const doctorName = `${diagnose?.doctor.firstName} ${diagnose?.doctor.lastName}`
    const doctorPhone = `+${diagnose?.doctor.countryCode}${diagnose?.doctor.phone}`

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
                <span className="status-btn grey-bg">{diagnose.diagnose}</span>
        </div>
        <CardDate creationDate={diagnose.createdAt} />
    </div>
}

export default DiagnoseCard
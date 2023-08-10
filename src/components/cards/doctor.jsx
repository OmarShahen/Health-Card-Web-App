import './patient.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CardDate from './components/date'
import CardTransition from '../transitions/card-transitions'


const DoctorCard = ({ doctor }) => {

    const doctorName = `${doctor?.firstName} ${doctor?.lastName}`

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{doctor?.email}</span>
                </div>
            </div>
            <div>
            </div>
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <div>
                        <div className="card-list-header body-text">
                        </div>
                        <div className="codes-container">
                            {doctor.specialities.map(special => <span className="status-btn grey-bg">{special.name}</span>)}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    </CardTransition>
}

export default DoctorCard
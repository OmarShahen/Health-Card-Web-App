import './patient.css'
import { format } from 'date-fns'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'


const DoctorCard = ({ doctor }) => {

    const doctorName = `${doctor.firstName} ${doctor.lastName}`
    const doctorPhone = `+${doctor.countryCode}${doctor.phone}`

    return <div className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{doctorPhone}</span>
                </div>
            </div>
            <div>
                <MoreHorizIcon />
            </div>
        </div>
        <div className="codes-container body-text patient-card-body">
            {doctor.speciality.map(special => <span className="status-btn grey-bg">{special}</span>)}
        </div>
        <CardDate date={doctor.createdAt} />
    </div>
}

export default DoctorCard
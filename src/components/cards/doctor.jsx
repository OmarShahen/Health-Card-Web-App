import './patient.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CardDate from './components/date'


const DoctorCard = ({ doctor }) => {

    const doctorName = `${doctor.doctor.firstName} ${doctor.doctor.lastName}`
    const doctorPhone = `+${doctor.doctor.countryCode}${doctor.doctor.phone}`

    return <div className="patient-card-container disable-hover">
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
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Clinic</strong>
                    <span>{doctor.clinic.name}</span>
                </li>
                <li>
                    <strong>Name</strong>
                    <span>{doctorName}</span>
                </li>
                <li>
                    <strong>Phone</strong>
                    <span>{doctorPhone}</span>
                </li>
                <li>
                    <div>
                        <div className="card-list-header body-text">
                            <strong>Speciality</strong>
                        </div>
                        <div className="codes-container">
                            {doctor.doctor.speciality.map(special => <span className="status-btn grey-bg">{special}</span>)}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <CardDate creationDate={doctor.createdAt} />
    </div>
}

export default DoctorCard
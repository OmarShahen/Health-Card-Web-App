import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { format } from 'date-fns'
import { getTime } from '../../utils/time'


const AppointmentCard = ({ appointment }) => {

    const renderAppointmentStatus = (status) => {

        if(status === 'DONE') {
            return <span className="tag-green-text">{status}</span>
        } else if(status === 'CANCELLED') {
            return <span className="tag-red-text">{status}</span>         
        } else if(status === 'UPCOMING') {
            return <span className="tag-purple-text">{status}</span>      
        } else if(status === 'WAITING') {
            return <span className="tag-orange-text">{status}</span>      
        } else if(status === 'ACTIVE') {
            return <span className="tag-light-blue-text">{status}</span>    
        } else {
            return <span className="tag-grey-text">{status}</span>
        }
    }

    return <div className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${'Omar Reda'}.svg`} alt="patient-image" />
                <div>
                    <strong>{appointment.patientName}</strong>
                    <span className="grey-text">{`+${appointment.patientCountryCode}${appointment.patientPhone}`}</span>
                </div>
            </div>
            <div>
                <MoreHorizIcon />
            </div>
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Date</strong>
                    <span>{format(new Date(appointment.reservationTime), 'dd MMM yyyy')}</span>
                </li>
                <li>
                    <strong>Time</strong>
                    <span>{getTime(new Date(appointment.reservationTime))}</span>
                </li>
                <li>
                    <strong>Status</strong>
                    <span className="patient-card-status">{renderAppointmentStatus(appointment.status)}</span>
                </li>
            </ul>
        </div>
    </div>
}

export default AppointmentCard
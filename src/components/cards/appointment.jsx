import { format } from 'date-fns'
import { getTime } from '../../utils/time'
import CardDate from './components/date'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UpcomingOutlinedIcon from '@mui/icons-material/UpcomingOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardActions from './components/actions'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'

const AppointmentCard = ({ appointment, reload, setReload }) => {

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

    const updateAppointmentStatus = (appointmentId, status) => {

        serverRequest.patch(`/v1/appointments/${appointmentId}/status`, { status })
        .then(response => {
            const data = response.data
            const updatedAppointment = data.appointment
            setReload(reload + 1)
            setViewStatus('ALL')
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const deleteAppointment = (appointmentId) => {

        serverRequest.delete(`/v1/appointments/${appointmentId}`)
        .then(response => {
            const data = response.data
            const deletedAppointment = data.appointment
            setReload(reload + 1)
            setViewStatus('ALL')
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const cardActionsList = [
        {
            name: 'Upcoming',
            icon: <UpcomingOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateAppointmentStatus(appointment._id, 'UPCOMING')
            }
        },
        {
            name: 'Waiting',
            icon: <HourglassEmptyOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateAppointmentStatus(appointment._id, 'WAITING')
            }
        },
        {
            name: 'Active',
            icon: <MeetingRoomOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateAppointmentStatus(appointment._id, 'ACTIVE')
            }
        },
        {
            name: 'Done',
            icon: <CheckCircleOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateAppointmentStatus(appointment._id, 'DONE')
            }
        },
        {
            name: 'Cancelled',
            icon: <CancelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateAppointmentStatus(appointment._id, 'CANCELLED')
            }
        },
        {
            name: 'Delete',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteAppointment(appointment._id)
            }
        },
     ]

    return <div className="patient-card-container disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${appointment.doctor.firstName + appointment.doctor.lastName}.svg`} alt="patient-image" />
                <div>
                    <strong>{appointment.doctor.firstName + ' ' + appointment.doctor.lastName}</strong>
                    <span className="grey-text">{`+${appointment.doctor.countryCode}${appointment.doctor.phone}`}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
        <div className="card-contact-section-container body-text">
                <div>
                    <strong>Patient</strong><br />
                    <span className="grey-text">{appointment.patientName} {'+' + appointment.patientCountryCode + appointment.patientPhone}</span>
                </div>
            </div>
            <ul>
                {
                    appointment.clinic ?
                    <li>
                        <strong>
                            Clinic
                        </strong>
                        <span>{appointment.clinic.name}</span>
                    </li>
                    :
                    null
                }
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
                <li>
                    <strong>Visit Reason</strong>
                    <span>{appointment.visitReason ? appointment.visitReason.name : 'Not Registered'}</span>
                </li>
            </ul>
        </div>
        <CardDate creationDate={appointment.createdAt} updateDate={appointment.updatedAt} />
    </div>
}

export default AppointmentCard
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
import { formatMoney } from '../../utils/numbers'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const AppointmentCard = ({ 
    appointment, 
    setIsShowDeleteModal, 
    setTargetAppointment, 
    setIsShowStatusModal,
    setStatus
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const patientName = `${appointment?.patient?.firstName} ${appointment?.patient?.lastName ? appointment?.patient?.lastName : ''}`

    const renderAppointmentStatus = (status) => {

        if(status === 'DONE') {
            return <span className="status-btn done bold-text">{translations[lang]['Done']}</span>
        } else if(status === 'CANCELLED') {
            return <span className="status-btn declined bold-text">{translations[lang]['Cancelled']}</span>         
        } else if(status === 'UPCOMING') {
            return <span className="status-btn pending bold-text">{translations[lang]['Upcoming']}</span>      
        } else if(status === 'WAITING') {
            return <span className="status-btn tag-purple-bg white-text bold-text">{translations[lang]['Waiting']}</span>      
        } else if(status === 'ACTIVE') {
            return <span className="status-btn tag-green-bg white-text bold-text">{translations[lang]['Active']}</span>    
        } else if(status === 'EXPIRED'){
            return <span className="status-btn grey-bg bold-text">{translations[lang]['Expired']}</span>
        }
    }


    const cardActionsList = [
        {
            name: translations[lang]['Upcoming'],
            icon: <UpcomingOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setStatus('UPCOMING')
                setIsShowStatusModal(true)
            }
        },
        {
            name: translations[lang]['Waiting'],
            icon: <HourglassEmptyOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setStatus('WAITING')
                setIsShowStatusModal(true)
            }
        },
        {
            name: translations[lang]['Active'],
            icon: <MeetingRoomOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setStatus('ACTIVE')
                setIsShowStatusModal(true)
            }
        },
        {
            name: translations[lang]['Done'],
            icon: <CheckCircleOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setStatus('DONE')
                setIsShowStatusModal(true)
            }
        },
        {
            name: translations[lang]['Cancelled'],
            icon: <CancelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetAppointment(appointment)
                setStatus('CANCELLED')
                setIsShowStatusModal(true)
            }
        },
    ]

    user.roles.includes('STAFF') ?
    cardActionsList.push({
        name: translations[lang]['Delete'],
        icon: <DeleteOutlineOutlinedIcon />,
        onAction: (e) => {
            e.stopPropagation()
            setTargetAppointment(appointment)
            setIsShowDeleteModal(true)
        }
    })
    :
    null

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${appointment?.patient?.firstName + ' ' + appointment?.patient?.lastName}.svg`} alt="patient-image" />
                <div>
                    <strong>{appointment?.patient?.firstName + ' ' + appointment?.patient?.lastName}</strong>
                    <span 
                    className="grey-text"
                    >
                        {`+${String(appointment?.patient?.countryCode) + String(appointment?.patient?.phone)}`}
                    </span>
                </div>
            </div>
            { user.roles.includes('STAFF') || user.roles.includes('DOCTOR') ? <CardActions actions={cardActionsList} /> : null }
        </div>
        <div className="patient-card-body">
        
            <ul>
                {
                    user.roles.includes('DOCTOR') || user.roles.includes('OWNER') ?
                    <li>
                        <strong>
                            {translations[lang]['Clinic']}
                        </strong>
                        <span>{appointment?.clinic?.name}</span>
                    </li>
                    :
                    null
                }
                <li>
                    <strong>{translations[lang]['Doctor']}</strong>
                    <span>{appointment?.doctor?.firstName + ' ' + appointment?.doctor?.lastName}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Date']}</strong>
                    <span>{format(new Date(appointment?.reservationTime), lang === 'en' ? 'dd MMM yyyy' : 'yyyy/MM/dd')}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Time']}</strong>
                    <span>{new Date(appointment?.reservationTime).toLocaleTimeString()}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Service']}</strong>
                    <span>{appointment?.service ? appointment.service.name : translations[lang]['Not Registered']}</span>
                </li>
                {/*
                    !user.roles.includes('DOCTOR') ?
                    <li>
                        <strong>{translations[lang]['Cost']}</strong>
                        <span>{appointment?.service ? formatMoney(appointment.service.cost) : translations[lang]['Not Registered']}</span>
                    </li>
                    :
                    null
                */}
                <li>
                    <strong>{translations[lang]['Status']}</strong>
                    {renderAppointmentStatus(appointment?.status)}
                </li>
            </ul>
        </div>
        <CardDate creationDate={appointment?.createdAt} updateDate={appointment?.updatedAt} />
    </div>
    </CardTransition>
}

export default AppointmentCard
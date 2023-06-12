import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'


const ClinicRequestCard = ({ request, reload, setReload }) => {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)


    const updateClinicRequestStatus = (status) => {
        setIsLoading(true)
        serverRequest.patch(`/v1/clinics-requests/${request._id}`, { status })
        .then(response => {
            setIsLoading(false)
            setReload(reload + 1)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const cardActionsList = [
        {
            name: 'Accept',
            icon: <CheckCircleOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('ACCEPTED')
            }
        },
        {
            name: 'Decline',
            icon: <DoNotDisturbAltOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('REJECTED')
            }
        },
        {
            name: 'Pending',
            icon: <HourglassEmptyOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('PENDING')
            }
        },
     ]

    return <div onClick={e => navigate(`/patients/${patient.patient._id}/medical-profile`)} className="patient-card-container disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${request.clinic.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{request.clinic.name}</strong>
                    <span className="grey-text">#{request.clinic.clinicId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Phone</strong>
                    <span>{`+${request.clinic.countryCode}${request.clinic.phone}`}</span>
                </li>
                <li>
                    <strong>Country</strong>
                    <span>{request.clinic.country}</span>
                </li>
                <li>
                    <strong>City</strong>
                    <span>{request.clinic.city}</span>
                </li>
                <li>
                    <strong>Address</strong>
                    <span>{request.clinic.address}</span>
                </li>
                <li>
                    <strong>Status</strong>
                    { request.status === 'PENDING' ? <span className="status-btn pending bold-text">{request.status}</span> : null }
                    { request.status === 'ACCEPTED' ? <span className="status-btn done bold-text">{request.status}</span> : null }
                    { request.status === 'REJECTED' ? <span className="status-btn declined bold-text">{request.status}</span> : null }
                </li>
            </ul>
        </div>
        {
            request.status === 'PENDING' ?
            isLoading ?
            <div className="container-center"> 
                <TailSpin
                height="25"
                width="25"
                color="dodgerblue"
                />
            </div>
            :
            <div className="card-buttons-container">
                <button onClick={e => updateClinicRequestStatus('ACCEPTED')} className="normal-button action-color-bg white-text">Accept</button>
                <button onClick={e => updateClinicRequestStatus('REJECTED')} className="normal-button cancel-button">Decline</button>
            </div>
            :
            null
        }
        <CardDate creationDate={request.createdAt} />

    </div>
}

export default ClinicRequestCard
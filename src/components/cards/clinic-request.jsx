import { useState } from 'react'
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const ClinicRequestCard = ({ 
    request, 
    reload, 
    setReload, 
    isReceiverView, 
    isShowClinic,
    setIsShowDeleteModal, 
    setTargetRequest 
}) => {

    const lang = useSelector(state => state.lang.lang)

    const name = !isShowClinic ? request?.user?.firstName + ' ' + request?.user?.lastName : request?.clinic?.name
    const contact = !isShowClinic ? request?.user?.email : `#${request?.clinic?.clinicId}`

    const [isLoading, setIsLoading] = useState(false)

    const updateClinicRequestStatus = (status) => {
        setIsLoading(true)

        let endpointURL = ''

        if(request.role === 'STAFF') {
            endpointURL = `/v1/clinics-requests/${request._id}/staffs`
        } else if(request.role === 'DOCTOR') {
            endpointURL = `/v1/clinics-requests/${request._id}/doctors`
        } else if(request.role === 'OWNER') {
            endpointURL = `/v1/clinics-requests/${request._id}/owners`
        }

        serverRequest.patch(endpointURL, { status })
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


    const userCardActionsList = [
        {
            name: translations[lang]['Accept'],
            icon: <CheckCircleOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('ACCEPTED')
            }
        },
        {
            name: translations[lang]['Decline'],
            icon: <DoNotDisturbAltOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('REJECTED')
            }
        },
        {
            name: translations[lang]['Pending'],
            icon: <HourglassEmptyOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                updateClinicRequestStatus('PENDING')
            }
        },
     ]

     if(request.role === 'STAFF') {
        userCardActionsList.push({
            name: translations[lang]['Delete Request'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetRequest(request)
                setIsShowDeleteModal(true)
            }
        })
     }

     const ownerCardActionsList = [
        {
            name: translations[lang]['Delete Request'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetRequest(request)
                setIsShowDeleteModal(true)
            }
        },
     ]

     const cardActionsList = !isReceiverView ? ownerCardActionsList : userCardActionsList

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${name}.svg`} alt="patient-image" />
                <div>
                    <strong>{name}</strong>
                    <span className="grey-text">{contact}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                {
                    isShowClinic ?
                    <li>
                        <strong>{translations[lang]['Inviter']}</strong>
                        <span>{request.user.firstName + ' ' + request.user.lastName}</span>
                    </li>
                    :
                    <li>
                        <strong>{translations[lang]['Clinic']}</strong>
                        <span>{request.clinic.name}</span>
                    </li>
                }
                <li>
                    <strong>{translations[lang]['Country']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(request.clinic.country)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['City']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(request.clinic.city)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Role']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(request.role)]}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Status']}</strong>
                    { request.status === 'PENDING' ? <span className="status-btn pending bold-text">{translations[lang]['Pending']}</span> : null }
                    { request.status === 'ACCEPTED' ? <span className="status-btn done bold-text">{translations[lang]['Accepted']}</span> : null }
                    { request.status === 'REJECTED' ? <span className="status-btn declined bold-text">{translations[lang]['Rejected']}</span> : null }
                </li>
            </ul>
        </div>
        { isReceiverView ?
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
                <button 
                onClick={e => updateClinicRequestStatus('ACCEPTED')} 
                className="normal-button action-color-bg white-text">
                    {translations[lang]['Accept']}
                </button>
                <button 
                onClick={e => updateClinicRequestStatus('REJECTED')} 
                className="normal-button cancel-button">
                    {translations[lang]['Decline']}
                </button>
            </div>
            :
            null
            :
            null
        }
        <CardDate creationDate={request.createdAt} />

    </div>
    </CardTransition>
}

export default ClinicRequestCard
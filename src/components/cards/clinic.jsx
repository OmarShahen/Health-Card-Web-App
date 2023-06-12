import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'


const ClinicCard = ({ clinic, reload, setReload }) => {

    const navigate = useNavigate()

    const deleteClinic = (clinic) => {
        serverRequest.delete(`/v1/clinics-doctors/${clinic._id}`)
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const cardActionsList = [
        {
            name: 'Delete clinic',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteClinic(clinic)
            }
        },
     ]

    return <div onClick={e => navigate(`/patients/${patient.patient._id}/medical-profile`)} className="patient-card-container disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${clinic.clinic.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{clinic.clinic.name}</strong>
                    <span className="grey-text">#{clinic.clinic.clinicId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Phone</strong>
                    <span>{`+${clinic.clinic.countryCode}${clinic.clinic.phone}`}</span>
                </li>
                <li>
                    <strong>Country</strong>
                    <span>{clinic.clinic.country}</span>
                </li>
                <li>
                    <strong>City</strong>
                    <span>{clinic.clinic.city}</span>
                </li>
                <li>
                    <strong>Address</strong>
                    <span>{clinic.clinic.address}</span>
                </li>
            </ul>
        </div>
        <CardDate creationDate={clinic.createdAt} />
    </div>
}

export default ClinicCard
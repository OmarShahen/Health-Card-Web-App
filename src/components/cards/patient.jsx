import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'


const PatientCard = ({ patient, reload, setReload }) => {

    const navigate = useNavigate()

    const patientName = `${patient.patient.firstName} ${patient.patient.lastName}`
    const patientPhone = `+${patient.patient.countryCode}${patient.patient.phone}`

    const deletePatient = (doctorPatientAccessId) => {
        serverRequest.delete(`/v1/doctors-patients-access/${doctorPatientAccessId}`)
        .then(response => {
            const data = response.data
            setReload(reload+1)
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }

    const cardActionsList = [
        {
            name: 'Delete Patient',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deletePatient(patient._id)
            }
        }
     ]

    return <div onClick={e => navigate(`/patients/${patient.patient._id}/medical-profile`)} className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                <div>
                    <strong>{patientName}</strong>
                    <span className="grey-text">#{patient.patient.cardId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                {
                    patient.clinic ?
                    <li>
                        <strong>Clinic</strong>
                        <span>{patient.clinic.name}</span>
                    </li>
                    :
                    null
                }
                <li>
                    <strong>Phone</strong>
                    <span>{patientPhone}</span>
                </li>
                <li>
                    <strong>Card ID</strong>
                    <span>#{patient.patient.cardId}</span>
                </li>
                <li>
                    <strong>Gender</strong>
                    <span>{patient.patient.gender}</span>
                </li>
                <li>
                    <strong>Social Status</strong>
                    <span>{patient.patient.socialStatus ? patient.patient.socialStatus : 'Not Registered'}</span>
                </li>
                <li>
                    <strong>Age</strong>
                    <span>{patient.patient.dateOfBirth ? getAge(patient.patient.dateOfBirth) : 'Not Registered'}</span>
                </li>
            </ul>
        </div>
        <CardDate creationDate={patient.createdAt} />
    </div>
}

export default PatientCard
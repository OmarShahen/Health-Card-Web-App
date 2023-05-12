import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'

const PatientCard = ({ patient }) => {

    const navigate = useNavigate()

    const patientName = `${patient.firstName} ${patient.lastName}`
    const patientPhone = `+${patient.countryCode}${patient.phone}`

    const cardActionsList = [
        {
            name: 'Delete Patient',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteEncounter(encounter._id)
            }
        },
        {
            name: 'Update Patient',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/encounters/${encounter._id}/update`)
            }
        },
     ]

    return <div onClick={e => navigate(`/patients/${patient._id}/medical-profile`)} className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                <div>
                    <strong>{patientName}</strong>
                    <span className="grey-text">#{patient.cardId}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>Phone</strong>
                    <span>{patientPhone}</span>
                </li>
                <li>
                    <strong>Card ID</strong>
                    <span>#{patient.cardId}</span>
                </li>
                <li>
                    <strong>Gender</strong>
                    <span>{patient.gender}</span>
                </li>
                <li>
                    <strong>Age</strong>
                    <span>{patient.dateOfBirth ? getAge(patient.dateOfBirth) : 'Not Registered'}</span>
                </li>
            </ul>
        </div>
        <CardDate date={patient.createdAt} />
    </div>
}

export default PatientCard
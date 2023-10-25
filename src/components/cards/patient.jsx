import './patient.css'
import { getAge } from '../../utils/age-calculator'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { useNavigate } from 'react-router-dom'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const PatientCard = ({ patient, reload, setReload, setTargetPatient, setIsShowDeleteModal }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const patientName = `${patient.patient.firstName} ${patient?.patient?.lastName ? patient?.patient?.lastName : ''}`
    const patientPhone = `+${patient.patient.countryCode}${patient.patient.phone}`

    const profileURL = user.roles.includes('STAFF') ? `/patients/${patient.patient._id}/clinics/${user.clinicId}/medical-profile` : `/patients/${patient.patient._id}/clinics/${patient.clinic._id}/medical-profile`

    const cardActionsList = [
        {
            name: translations[lang]['Delete Patient'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetPatient(patient)
                setIsShowDeleteModal(true)
                deletePatient(patient._id)
            }
        },
        {
            name: translations[lang]['Update Patient'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${patient?.patient?._id}/form?mode=UPDATE`)
            }
        }
     ]

    return <CardTransition>
        <div 
        onClick={e => navigate(profileURL)} 
        className="patient-card-container body-text">
            <div className="patient-card-header">
                <div className="patient-image-info-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${patientName}.svg`} alt="patient-image" />
                    <div>
                        <strong>{patientName}</strong>
                        <span className="grey-text">#{patient?.patient?.patientId}</span>
                    </div>
                </div>
                <CardActions actions={cardActionsList} />
            </div>
            <div className="patient-card-body">
                <ul>
                    {
                        patient.clinic ?
                        <li>
                            <strong>{translations[lang]['Clinic']}</strong>
                            <span>{patient?.clinic?.name}</span>
                        </li>
                        :
                        null
                    }
                    <li>
                        <strong>{translations[lang]['Phone']}</strong>
                        <span>{patientPhone}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Card ID']}</strong>
                        <span>{patient.patient.cardId ? `#${patient.patient.cardId}` : translations[lang]['Not Registered']}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Gender']}</strong>
                        <span>{patient.patient.gender ? translations[lang][capitalizeFirstLetter(patient.patient.gender)] : translations[lang]['Not registered']}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Social Status']}</strong>
                        <span>{patient.patient.socialStatus ? translations[lang][capitalizeFirstLetter(patient.patient.socialStatus)] : translations[lang]['Not Registered']}</span>
                    </li>
                    <li>
                        <strong>{translations[lang]['Age']}</strong>
                        <span>{patient.patient.dateOfBirth ? getAge(patient.patient.dateOfBirth) : translations[lang]['Not Registered']}</span>
                    </li>
                </ul>
            </div>
            <CardDate creationDate={patient.createdAt} />
        </div>
    </CardTransition>
}

export default PatientCard
import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const ClinicDoctorCard = ({ 
    clinicDoctor, 
    setTargetClinicDoctor, 
    setIsShowDeleteModal,
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const doctorName = `${clinicDoctor?.doctor?.firstName} ${clinicDoctor?.doctor?.lastName}`

    const cardActionsList = [
        {
            name: translations[lang]['Delete Doctor'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetClinicDoctor(clinicDoctor)
                setIsShowDeleteModal(true)
            }
        }
     ]

    return <CardTransition>
    <div className="patient-card-container body-text disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} alt="patient-image" />
                <div>
                    <strong>{doctorName}</strong>
                    <span className="grey-text">{clinicDoctor?.doctor?.email}</span>
                </div>
            </div>
            {/*
                !user.roles.includes('STAFF') ?
                <CardActions actions={cardActionsList} />
                :
                null
            */}
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Clinic']}</strong>
                    <span>{clinicDoctor?.clinic?.name}</span>
                </li>
            </ul>
            <br />
            <div className="codes-container">
                {clinicDoctor?.specialities?.map(special => <span className="status-btn grey-bg">
                    {special.name}
                </span>)}
            </div>
        </div>
        <CardDate 
        creationDate={clinicDoctor?.createdAt}
        />
    </div>
    </CardTransition>
}

export default ClinicDoctorCard
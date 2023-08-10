import './patient.css'
import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CardTransition from '../transitions/card-transitions'
import { useSelector } from 'react-redux'
import translations from '../../i18n'


const ClinicStaffCard = ({ 
    staff, 
    setTargetInvoice, 
    setIsShowDeleteModal,
}) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const name = `${staff.firstName} ${staff.lastName}`


    const cardActionsList = [
        {
            name: translations[lang]['Remove Staff'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetInvoice(invoice)
                setIsShowDeleteModal(true)
            }
        }
     ]

    return <CardTransition>
    <div className="patient-card-container body-text disable-hover">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${name}.svg`} alt="patient-image" />
                <div>
                    <strong>{name}</strong>
                    <span className="grey-text">{staff.email}</span>
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
                {
                    staff.clinic ?
                    <li>
                        <strong>{translations[lang]['Clinic']}</strong>
                        <span>{staff.clinic.name}</span>
                    </li>
                    :
                    null
                }
                
            </ul>
        </div>
        <CardDate creationDate={staff.createdAt} />
    </div>
    </CardTransition>
}

export default ClinicStaffCard
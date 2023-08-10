import './patient.css'
import CardDate from './components/date'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardActions from './components/actions'
import CardTransition from '../transitions/card-transitions'
import { capitalizeFirstLetter } from '../../utils/formatString'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const ContactCard = ({ 
    contact, 
    setFormMode, 
    setUpdateContact, 
    setIsShowForm,
    setIsShowDeleteModal
}) => {

    const contactPhone = `+${contact.countryCode}${contact.phone}`

    const lang = useSelector(state => state.lang.lang)

    const cardActionsList = [
        {
            name: translations[lang]['Delete Contact'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setUpdateContact(contact)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: translations[lang]['Update Contact'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setUpdateContact(contact)
                setFormMode('EDITE')
                setIsShowForm(true)
            }
        },
     ]

    return <CardTransition>
    <div className="patient-card-container disable-hover body-text">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${contact.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{contact.name}</strong>
                    <span className="grey-text">{contactPhone}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="patient-card-body">
            <ul>
                <li>
                    <strong>{translations[lang]['Name']}</strong>
                    <span>{contact.name}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Phone']}</strong>
                    <span>{contactPhone}</span>
                </li>
                <li>
                    <strong>{translations[lang]['Relation']}</strong>
                    <span>{translations[lang][capitalizeFirstLetter(contact?.relation)]}</span>
                </li>
            </ul>
        </div>
        { contact.createdAt ? <CardDate creationDate={contact.createdAt} /> : null }
    </div>
    </CardTransition>
}

export default ContactCard
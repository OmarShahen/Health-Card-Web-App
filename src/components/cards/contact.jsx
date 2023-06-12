import './patient.css'
import CardDate from './components/date'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import CardActions from './components/actions'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'


const ContactCard = ({ contact, reload, setReload, patientId, setFormMode, setUpdateContact, setIsShowForm }) => {

    const contactPhone = `+${contact.countryCode}${contact.phone}`

    const deleteContact = (contact, patientId) => {

        serverRequest.delete(`/v1/patients/${patientId}/emergency-contacts/country-codes/${contact.countryCode}/phones/${contact.phone}`)
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
            name: 'Delete Contact',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteContact(contact, patientId)
            }
        },
        {
            name: 'Update Contact',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setUpdateContact(contact)
                setFormMode('EDITE')
                setIsShowForm(true)
            }
        },
     ]

    return <div className="patient-card-container disable-hover">
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
                    <strong>Name</strong>
                    <span>{contact.name}</span>
                </li>
                <li>
                    <strong>Phone</strong>
                    <span>{contactPhone}</span>
                </li>
                <li>
                    <strong>Relation</strong>
                    <span>{contact.relation}</span>
                </li>
            </ul>
        </div>
        { contact.createdAt ? <CardDate creationDate={contact.createdAt} /> : null }
    </div>
}

export default ContactCard
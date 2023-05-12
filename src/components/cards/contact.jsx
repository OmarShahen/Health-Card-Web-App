import './patient.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CardDate from './components/date'


const ContactCard = ({ contact }) => {

    const contactPhone = `+${contact.countryCode}${contact.phone}`

    return <div className="patient-card-container">
        <div className="patient-card-header">
            <div className="patient-image-info-container">
                <img src={`https://avatars.dicebear.com/api/initials/${contact.name}.svg`} alt="patient-image" />
                <div>
                    <strong>{contact.name}</strong>
                    <span className="grey-text">{contactPhone}</span>
                </div>
            </div>
            <div className="patient-card-header-right-section">
                <MoreHorizIcon />
            </div>
        </div>
        <div className="codes-container body-text patient-card-body">
            <span className="status-btn grey-bg">{contact.relation}</span>
        </div>
        <CardDate date={contact.createdAt} />
    </div>
}

export default ContactCard
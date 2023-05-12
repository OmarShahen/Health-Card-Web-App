import './cards.css'
import { toast } from 'react-hot-toast'
import CardDate from './components/date'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import CardActions from './components/actions'
import { serverRequest } from '../API/request'


const EncounterCard = ({ encounter, setReload, reload }) => {

     const patientName = `${encounter.patient.firstName} ${encounter.patient.lastName}`
     const doctorName = `${encounter.doctor.firstName} ${encounter.doctor.lastName}`
     const patientCardId = encounter.patient.cardId

     const navigate = useNavigate()

     const deleteEncounter = (encounterId) => {
        serverRequest.delete(`/v1/encounters/${encounterId}`)
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
            name: 'Delete Encounter',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deleteEncounter(encounter._id)
            }
        },
        {
            name: 'Update Encounter',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/encounters/${encounter._id}/update`)
            }
        },
        {
            name: 'View Patient',
            icon: <HotelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${encounter.patient._id}/medical-profile`)
            }
        },
     ]


    return <div onClick={e => navigate(`/encounters/${encounter._id}/view`)} className="card-container body-text">
        <div className="card-header-container">
            <div className="card-header-person-info">
                <div>
                    <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} />
                </div>
                <div className="card-image-description-container">
                    <strong>{doctorName}</strong>
                    <span className="grey-text span-text">{encounter.doctor.speciality[0]}</span>
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="card-body">
            <div className="card-contact-section-container">
                <div>
                    <strong>Patient</strong><br />
                    <span className="grey-text">{patientName} { patientCardId ? `- ${patientCardId}` : null }</span>
                </div>
            </div>
            <ul>
                <li>
                    <div className="card-list-header body-text">
                        <strong>Symptoms</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.symptoms.map(symptom => <span className="status-btn grey-bg">
                            {symptom}                  
                        </span>) }
                    </div>
                </li>
                <li>
                    <div className="card-list-header body-text">                     
                        <strong>Diagnosis</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.diagnosis.map(diagnose => <span className="status-btn grey-bg">
                            {diagnose}                  
                        </span>) }
                    </div>
                </li>
                {
                    encounter?.notes.length !== 0 ?
                    <li>
                        <div className="card-list-header body-text">
                            <strong>Notes</strong>
                        </div>
                        <div className="codes-container">
                            { encounter.notes.map(note => <span className="status-btn grey-bg">
                                {note}                        
                            </span>) }
                        </div>
                    </li>
                    :
                    null
                }
            </ul>
        </div>
        <CardDate date={encounter.createdAt} />
    </div>
}

export default EncounterCard
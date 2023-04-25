import './cards.css'
import { format } from 'date-fns'
import translations from '../../i18n'
import { NoteAlt } from '@mui/icons-material'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import { toast } from 'react-hot-toast'

const EncounterCard = ({ encounter, entity, deleteEncounter }) => {

    const entityName = entity !== 'DOCTOR' ?
     `${encounter.patient.firstName} ${encounter.patient.lastName}`
     :
     `${encounter.doctor.firstName} ${encounter.doctor.lastName}`

     const entityPhone = entity !== 'DOCTOR' ? 
     `${encounter.patient.countryCode}${encounter.patient.phone}`
     :
     `${encounter.doctor.countryCode}${encounter.doctor.phone}`



    const formatDrugInstructions = (instructions) => {
        let text = ``
        for(let i=0;i<instructions.length;i++) {
            text += ` ${translations['ar'][instructions[i]]} و`
        }

        return text
    }

    return <div className="card-container body-text">
        <div className="card-header">
            <div className="card-header-person-info">
                <div>
                    <img src={`https://avatars.dicebear.com/api/initials/${entityName}.svg`} />
                </div>
                <div>
                    <strong>{entityName}</strong>
                    <span className="grey-text">{format(new Date(encounter.createdAt), 'dd MMM yyyy')}</span>
                </div>
            </div>
            <div className="small-description-text actions-container">
                <MoreVertOutlinedIcon />
                <div className="actions-dropdown-container">
                    <ul>
                        <li className="width" onClick={e => deleteEncounter(encounter._id)}>Delete Encounter</li>
                        <li className="width">Update Encounter</li>
                        <li className="width">View Patient Profile</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="card-body">
            <ul>
                <li>
                    <div>
                        
                        <strong>Diagnosis</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.diagnosis.map(diagnose => <span className="status-btn grey-bg">
                            {diagnose}                  
                        </span>) }
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Symptoms</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.symptoms.map(symptom => <span className="status-btn pending">
                            {symptom}                  
                        </span>) }
                    </div>
                </li>
                <li>
                    <div>
                        <strong>Notes</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.notes.map(note => <span className="status-btn pending">
                            {note}                        
                        </span>) }
                    </div>
                </li>                    
            </ul>
        </div>
    </div>
}

export default EncounterCard
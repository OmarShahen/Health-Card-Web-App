import './cards.css'
import { toast } from 'react-hot-toast'
import CardDate from './components/date'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import CardActions from './components/actions'
import CardTransition from '../transitions/card-transitions'
import translations from '../../i18n'
import { useSelector } from 'react-redux'

const EncounterCard = ({ 
    encounter, 
    setReload, 
    reload, 
    setTargetEncounter, 
    setIsShowDeleteModal 
    }) => {

     const patientName = `${encounter.patient.firstName} ${encounter.patient.lastName}`
     const doctorName = `${encounter.doctor.firstName} ${encounter.doctor.lastName}`
     const patientCardId = encounter?.patient?.patientId

     const navigate = useNavigate()

     const lang = useSelector(state => state.lang.lang)


     const cardActionsList = [
        {
            name: translations[lang]['Delete Encounter'],
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setTargetEncounter(encounter)
                setIsShowDeleteModal(true)
            }
        },
        {
            name: translations[lang]['Update Encounter'],
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/encounters/${encounter._id}/update`)
            }
        },
        {
            name: translations[lang]['View Patient'],
            icon: <HotelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${encounter.patient._id}/medical-profile`)
            }
        },
     ]


    return <CardTransition>
    <div 
    onClick={e => navigate(`/encounters/${encounter._id}/view`)} 
    className="card-container white-bg body-text">
        <div className="card-header-container">
            <div className="card-header-person-info">
                <div>
                    <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} />
                </div>
                <div className="card-image-description-container">
                    <strong>{doctorName}</strong>
                    {
                        encounter.clinic ?
                        <span className="grey-text span-text">{encounter.clinic.name}</span>
                        :
                        null
                    }
                </div>
            </div>
            <CardActions actions={cardActionsList} />
        </div>
        <div className="card-body">
            <div className="card-contact-section-container">
                <div>
                    <strong>{translations[lang]['Patient']}</strong><br />
                    <span className="grey-text">{patientName} { patientCardId ? `- #${patientCardId}` : null }</span>
                </div>
            </div>
            <ul>
                <li>
                    <div className="card-list-header body-text">
                        <strong>{translations[lang]['Symptoms']}</strong>
                    </div>
                    <div className="codes-container">
                        { encounter.symptoms.map(symptom => <span className="status-btn grey-bg">
                            {symptom}                  
                        </span>) }
                    </div>
                </li>
                <li>
                    <div className="card-list-header body-text">                     
                        <strong>{translations[lang]['Diagnosis']}</strong>
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
                            <strong>{translations[lang]['Notes']}</strong>
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
        <CardDate creationDate={encounter.createdAt} updateDate={encounter.updatedAt} />
    </div>
    </CardTransition>
}

export default EncounterCard
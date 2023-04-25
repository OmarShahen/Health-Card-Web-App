import './cards.css'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { format } from 'date-fns'
import translations from '../../i18n'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'


const PrescriptionCard = ({ prescription, entity, deletePrescription }) => {

    const entityName = entity !== 'DOCTOR' ?
     `${prescription.patient.firstName} ${prescription.patient.lastName}`
     :
     `${prescription.doctor.firstName} ${prescription.doctor.lastName}`

     const entityPhone = entity !== 'DOCTOR' ? 
     `${prescription.patient.countryCode}${prescription.patient.phone}`
     :
     `${prescription.doctor.countryCode}${prescription.doctor.phone}`

    const formatDrugInstructions = (instructions) => {
        let text = ``
        for(let i=0;i<instructions.length;i++) {
            text += ` ${translations['ar'][instructions[i]]} و`
        }

        return text
    }

    const formatDrugUsage = (dosage, frequency, duration, instructions) => {
        return `
        عدد ${dosage.amount} ${translations['ar'][dosage.unit]} ${frequency.number} مرة في ${translations['ar'][frequency.timeUnit]} ${formatDrugInstructions(instructions)} لمدة ${duration.number} ${translations['ar'][duration.timeUnit]}
        `
    }


    return <div className="prescription-card-container body-text">
        <div className="prescription-card-header">
            <div className="prescription-image-and-name-container">
                <div className="card-image-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${entityName}.svg`} />
                </div>
                <div className="prescription-name-container">
                    <strong>{entityName}</strong>
                    <span className="light-text-color small-description-text">{`+${entityPhone}`}</span>
                </div>
            </div>
            <div className="small-description-text actions-container">
                <MoreVertOutlinedIcon />
                <div className="actions-dropdown-container">
                    <ul>
                        <li className="width" onClick={e => deletePrescription(prescription._id)}>Delete Prescription</li>
                        <li className="width">Update Prescription</li>
                        <li className="width">View Patient Profile</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="prescription-card-body">
            {
                prescription.medicines.map(drug => <div className="drug-container">
                <div className="drug-icon-container">
                    <span className="icon-container pending"><MedicationOutlinedIcon /></span>
                </div>
                <div className="drug-info-container">
                    <div className="drug-header">
                        <strong>{drug.name}</strong>
                    </div>
                    <div className="grey-text drug-description">
                        <p>
                            {`${drug.dosage.amount} ${drug.dosage.unit} X ${drug.frequency.number} ${drug.frequency.timeUnit} X ${drug.duration.number} ${drug.duration.timeUnit}`}
                        </p>
                    </div>
                    <div className="instructions-codes-container">
                            { drug.instructions.map(instruction => <span className="status-btn pending">{instruction}</span>) }
                    </div>
                </div>
            </div>)
            }
        </div>
    </div>
}

export default PrescriptionCard
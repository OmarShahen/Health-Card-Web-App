import './cards.css'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { format } from 'date-fns'
import translations from '../../i18n';

const DoctorPrescriptionCard = ({ prescription }) => {

    return <div className="prescription-card-container">
        <div className="prescription-card-header">
            <div className="small-description-text">
                <span>{format(new Date(prescription.createdAt), 'dd MMM yyyy')}</span>
            </div>
            <div className="prescription-card-doctor-info">
                <div>
                    <strong>{prescription.patientName}</strong>
                    <span className="light-text-color small-description-text">{`+${prescription.patientCountryCode} ${prescription.patientPhone}`}</span>
                </div>
                <div>
                    <img src={`https://avatars.dicebear.com/api/initials/${prescription.patientName}.svg`} />
                </div>
            </div>
        </div>
        <div className="prescription-card-body">
            <ul>
                { prescription.medicines.map(drug => <li>
                    <div>
                        <strong>{drug.name}</strong>
                        <div className="prescription-card-icon-container">
                            <MedicationOutlinedIcon />
                        </div>
                    </div>
                    <p className="light-text-color">
                        {
                            `عدد ${drug.dosage.amount} ${translations['ar'][drug.dosage.unit]} ${drug.frequency.number} مرة في ${translations['ar'][drug.frequency.timeUnit]} لمدة ${drug.duration.number} ${translations['ar'][drug.duration.timeUnit]}`
                        }
                        {/*
                        `${drug.dosage.amount} ${translations['ar'][drug.dosage.unit]} X ${drug.frequency.number} ${translations['ar'][drug.frequency.timeUnit]} X ${drug.duration.number} ${translations['ar'][drug.duration.timeUnit]}`
                    */}
                    </p>
                    <div className="instructions-codes-container">
                        { drug.instructions.map(instruction => <span className="status-btn pending">{translations['ar'][instruction]}</span>) }
                    </div>
                </li>) }
                
            </ul>
            <div className="note-container">
                <strong>ملاحظات</strong><br />
                <span className="light-text-color">{prescription.note}</span>
            </div>
        </div>
    </div>
}

export default DoctorPrescriptionCard
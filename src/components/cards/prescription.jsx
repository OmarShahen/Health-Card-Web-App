import './cards.css'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import CardDate from './components/date'
import { useNavigate } from 'react-router-dom'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import CardActions from './components/actions'
import { serverRequest } from '../API/request';
import { toast } from 'react-hot-toast';

const PrescriptionCard = ({ prescription, setReload, reload }) => {

    const navigate = useNavigate()

    const patientName = `${prescription.patient.firstName} ${prescription.patient.lastName}`
    const doctorName = `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
    const patientCardId = prescription.patient.cardId

    const deletePrescription = (prescriptionId) => {

        serverRequest.delete(`/v1/prescriptions/${prescriptionId}`)
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
            name: 'Delete Prescription',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                deletePrescription(prescription._id)
            }
        },
        {
            name: 'Update Prescription',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/prescriptions/${prescription._id}/update`)
            }
        },
        {
            name: 'View Patient',
            icon: <HotelOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                navigate(`/patients/${prescription.patient._id}/medical-profile`)
            }
        },
     ]

    return <div onClick={e => navigate(`/prescriptions/${prescription._id}/view`)} className="prescription-card-container body-text">
        <div className="prescription-card-header">
            <div className="prescription-image-and-name-container">
                <div className="card-image-container">
                    <img src={`https://avatars.dicebear.com/api/initials/${doctorName}.svg`} />
                </div>
                <div className="prescription-name-container">
                    <strong>{doctorName}</strong>
                    {
                        prescription.clinic ?
                        <span className="grey-text span-text">{prescription.clinic.name}</span>
                        :
                        null
                    }                
                </div>
            </div>
            <div className="card-header-left-container">
                <CardActions actions={cardActionsList} />
                <span>#{prescription.prescriptionId}</span>
            </div>
        </div>
        <div className="prescription-card-body">
            <div className="card-contact-section-container">
                <div>
                    <strong>Patient</strong><br />
                    <span className="grey-text">{patientName} { patientCardId ? `- ${patientCardId}` : null }</span>
                </div>
                
            </div>
            {
                prescription.medicines.map(drug => <div className="drug-container">
                <div className="drug-icon-container">
                    <span className="icon-container grey-bg"><MedicationOutlinedIcon /></span>
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
                    <div className="codes-container">
                            { drug.instructions.map(instruction => <span className="status-btn grey-bg">{instruction}</span>) }
                    </div>
                </div>
            </div>)
            }
            {
                prescription.notes && prescription.notes.length != 0 ?
                <div>
                    <div className="card-list-header body-text">
                        <strong>Notes</strong>
                    </div>
                    <div className="codes-container">
                        { prescription.notes.map(note => <span className="status-btn grey-bg">
                            {note}                        
                        </span>) }
                    </div>
                </div>
                :
                null
            }
        </div>
        <CardDate creationDate={prescription.createdAt} updateDate={prescription.updatedAt} />
    </div>
}

export default PrescriptionCard
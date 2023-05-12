import './quick-forms.css'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import { useNavigate } from 'react-router-dom'


const QuickFormMenu = ({ setShowPatientForm, setShowPatientCardForm, setShowAppointmentForm }) => {

    const navigate = useNavigate()

    return <div className="quick-form-menu-container">
        <div className="quick-form-menu-header-container">
            <span>Quick Adds</span>
        </div>
        <div className="quick-form-list-container">
            <ul>
                <li onClick={e => setShowPatientCardForm(true)}>
                    <span>Patient Card</span>
                    <MedicalInformationOutlinedIcon />
                </li>
                <li onClick={e => setShowPatientForm(true)}>
                    <span>Patient</span>
                    <HotelOutlinedIcon />
                </li>
                <li onClick={e => navigate(`/encounters/form`)}>
                    <span>Encounter</span>
                    <AssignmentOutlinedIcon />
                </li>
                <li onClick={e => navigate(`/prescriptions/form`)}>
                    <span>Prescription</span>
                    <MedicationOutlinedIcon />
                </li>
                <li onClick={e => setShowAppointmentForm(true)}>
                    <span>Appointment</span>
                    <CalendarMonthOutlinedIcon />
                </li>
            </ul>
        </div>
    </div>
}

export default QuickFormMenu
import './quick-forms.css'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import translations from '../../../i18n'


const QuickFormMenu = ({ setShowInsuranceCompanyForm, setShowPatientCardForm, setShowAppointmentForm, setShowInvoiceForm }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <div className="quick-form-menu-container">
        <div className="quick-form-menu-header-container">
            <span>{translations[lang]['Quick Adds']}</span>
        </div>
        <div className="quick-form-list-container">
            <ul>
                {
                    user.roles.includes('DOCTOR') || user.roles.includes('STAFF') ?
                    <li onClick={e => setShowPatientCardForm(true)}>
                        <span>{translations[lang]['Patient Card']}</span>
                        <MedicalInformationOutlinedIcon />
                    </li>
                    :
                    null
                }
                
                {   user.roles.includes('STAFF') ?
                    <li onClick={e => navigate(`/patients/form`)}>
                        <span>{translations[lang]['Patient']}</span>
                        <HotelOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('DOCTOR') ?
                    <li onClick={e => navigate(`/encounters/form`)}>
                        <span>{translations[lang]['Encounter']}</span>
                        <AssignmentOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('DOCTOR') ?
                    <li onClick={e => navigate(`/prescriptions/form`)}>
                        <span>{translations[lang]['Prescription']}</span>
                        <MedicationOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('STAFF') ?
                    <li onClick={e => setShowAppointmentForm(true)}>
                        <span>{translations[lang]['Appointment']}</span>
                        <CalendarMonthOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('STAFF') ?
                    <li onClick={e => setShowInvoiceForm(true)}>
                        <span>{translations[lang]['Invoices']}</span>
                        <ReceiptLongOutlinedIcon />
                    </li>
                    :
                    null
                }
                {
                    user.roles.includes('OWNER') ?
                    <li onClick={e => setShowInsuranceCompanyForm(true)}>
                        <span>Insurance Company</span>
                        <HomeWorkOutlinedIcon />
                    </li>
                    :
                    null
                }
            </ul>
        </div>
    </div>
}

export default QuickFormMenu
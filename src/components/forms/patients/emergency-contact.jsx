import './patients.css'
import { useNavigate } from 'react-router-dom'

const PatientEmergencyContactSection = ({ setShowSection }) => {

    const navigate = useNavigate()

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                جهات اتصال الطواري
            </h1>
            <p className="light-text-color">
                سيتم اضافة هذه المعلومة لملفك الطبي و ملف الطواري الخاص بيك
            </p>
        </div>
        <div>
            <div className="form-input-container">
                <input type="text" className="form-input" placeholder="صلة القرابة" />
            </div>
            <div className="form-input-container">
                <input type="text" className="form-input" placeholder="اسم الجهة" />
            </div>
            <div className="form-input-container">
                <input type="text" className="form-input" placeholder="رقم الموبايل" />
            </div>
        </div>
        <div className="patient-form-btn-container">
            <button className="button" onClick={e => navigate('/patients/1')}>
                تسجيل
            </button>
        </div>
    </div>
}

export default PatientEmergencyContactSection
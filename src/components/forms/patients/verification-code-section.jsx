import './patients.css'
import ReactInputVerificationCode from 'react-input-verification-code'
import SectionsTracker from './form-section-tracker'
import VerificationInput from "react-verification-input"


const PatientVerificationCodeSection = ({ setShowSection }) => {

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                تاكيد رقم الموبايل
            </h1>
            <p className="light-text-color">
                تم ارسال الكود علي رقم <strong>201065630331</strong><br />
                لتاكيد رقم الموبايل

            </p>
        </div>
            <div className="verification-codes-inputs-container">
                <VerificationInput length={5} />
            </div> 
        <div className="patient-form-btn-container">
            <button className="button" onClick={e => setShowSection('NAME')}>
                ارسل الكود مجددا
            </button>
        </div>
    </div>
}

export default PatientVerificationCodeSection
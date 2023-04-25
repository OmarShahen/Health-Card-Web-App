import { useState } from 'react'
import './patients.css'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import SectionsTracker from './form-section-tracker'

const PatientPhoneSection = ({ setShowSection }) => {

    const [value, setValue] = useState()

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                ادخل برقم الموبايل
            </h1>
            <p className="light-text-color small-description-text">
                اهلا بيك في كارت الصحة. ادخل رقم الموبايل للدخول لحسابك او انشاء حساب جديد
            </p>
        </div>
        <div>
        <PhoneInput
        country={'eg'}
        containerClass="phone-input-container"
        inputClass="phone-input"
        value={value}
        onChange={phone => setValue(phone)}
        />
        </div>
        <div className="patient-form-btn-container">
            <button className="button" onClick={e => setShowSection('VERIFICATION-CODE')}>
                تاكيد رقم الموبايل
            </button>
        </div>
    </div>
}

export default PatientPhoneSection
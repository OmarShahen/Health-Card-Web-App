import { useState } from 'react'
import PatientNameSection from "../components/forms/patients/name-section"
import PatientSocialStatusSection from "../components/forms/patients/social-status-section"
import PatientBloodGroupSection from "../components/forms/patients/blood-group-section"
import PatientLocationSection from "../components/forms/patients/location-section"
import PatientChronicSection from "../components/forms/patients/chronic-section"
import PatientEmergencyContactSection from "../components/forms/patients/emergency-contact"
import PatientPhoneSection from "../components/forms/patients/phone-section"
import PatientVerificationCodeSection from "../components/forms/patients/verification-code-section"

const PatientsFormPage = () => {

    const [showSection, setShowSection] = useState('PHONE-NUMBER')

    const formNavigator = () => {

        if(showSection === 'PHONE-NUMBER') {
            return <PatientPhoneSection setShowSection={setShowSection} />
        } else if(showSection === 'VERIFICATION-CODE') {
            return <PatientVerificationCodeSection setShowSection={setShowSection} /> 
        } else if(showSection === 'NAME') {
            return <PatientNameSection setShowSection={setShowSection} /> 
        } else if(showSection === 'SOCIAL-STATUS') {
            return <PatientSocialStatusSection setShowSection={setShowSection} /> 
        } else if(showSection === 'LOCATION') {
            return <PatientLocationSection setShowSection={setShowSection} /> 
        } else if(showSection === 'DISEASES') {
            return <PatientChronicSection setShowSection={setShowSection} /> 
        } else if(showSection === 'BLOOD-GROUP') {
            return <PatientBloodGroupSection setShowSection={setShowSection} /> 
        } else if(showSection === 'EMERGENCY') {
            return <PatientEmergencyContactSection setShowSection={setShowSection} /> 
        } 
    }

    return <div className="patient-form-container">
        { formNavigator() }
        
    </div>
}

export default PatientsFormPage
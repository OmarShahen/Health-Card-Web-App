import './App.css'
import EncountersPage from './pages/encounters'
import PrescriptionsPage from './pages/prescriptions'
import DoctorLoginPage from './pages/doctor-login'
import DoctorSignUpPage from './pages/doctor-signup'
import EncountersFormPage from './pages/encounters-form'
import PrescriptionsFormPage from './pages/prescriptions-form'
import DoctorPrescriptionsPage from './pages/prescriptions/doctor-prescriptions'
import PatientsPage from './pages/patients'
import PatientMedicalPage from './pages/patients/patient-medical'
import AppointmentsPage from './pages/appointments'
import ClinicsPage from './pages/clinics/clinics'
import ClinicsRequestsPage from './pages/clinics/clinic-requests'
import SettingsPage from './pages/settings'
import ProfilePage from './pages/profile/profile'
import SpecialityPage from './pages/profile/speciality'
import PasswordPage from './pages/profile/password'
import LoginPage from './pages/auth/login'
import SignUpPersonalInfoPage from './pages/auth/sign-up-personal-info'
import SignUpSpecialityPage from './pages/auth/sign-up-speciality'
import SignUpEmailPage from './pages/auth/signup-email'
import SignUpEmailVerificationCodePage from './pages/auth/sign-up-email-verification-code'
import { Toaster } from 'react-hot-toast'
import PatientEmergencyContactsPage from './pages/patients/patient-emergency-contacts'
import PatientDoctorsPage from './pages/patients/patient-doctors'
import PatientEncountersPage from './pages/patients/patient-encounters'
import PatientSymptomsPage from './pages/patients/patient-symptoms'
import PatientDiagnosisPage from './pages/patients/patient-diagnosis'
import PatientPrescriptionsPage from './pages/patients/patient-prescriptions'
import PatientDrugsPage from './pages/patients/patient-drugs'
import UpdateEncountersFormPage from './pages/update-encounter-form'
import UpdatePrescriptionsFormPage from './pages/update-prescription-form'
import PatientFormPage from './pages/patient-form'
import SupportPage from './pages/support/support'
import EncounterPage from './pages/encounter'
import PrescriptionPage from './pages/prescription'
import InvoicesPage from './pages/invoices'
import ServicesPage from './pages/services'
import ClinicsServicesPage from './pages/clinics/clinic-services'
import MainLayout from './components/layouts/main-layout'
import PatientProfileLayout from './components/layouts/patient-profile-layout'
import SignupFormLayout from './components/layouts/signup-layout'
import ClinicsLayout from './components/layouts/clinic-layout'
import UserProfileLayout from './components/layouts/user-profile-layout'


import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'


function App() {


  return (
    <div className="App">
      <Router>
        <Toaster />
        <Routes>
          {/*<Route path="/patients" element={<PatientsFormPage />} />*/}
          <Route element={<MainLayout />}>
            <Route path="/invoices" element={<InvoicesPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/services" element={<ServicesPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/encounters" element={<EncountersPage roles={['DOCTOR']} />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage roles={['DOCTOR']} />} />
            <Route path="/encounters/form" element={<EncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/form" element={<PrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/patients/form" element={<PatientFormPage />} />
            <Route path="/encounters/:id/update" element={<UpdateEncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/:id/update" element={<UpdatePrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/doctors" element={<DoctorPrescriptionsPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/patients/:id" element={<PrescriptionPage roles={['DOCTOR']} />} />

            <Route element={<PatientProfileLayout />}>
              <Route path="/patients/:id/medical-profile" element={<PatientMedicalPage />} />
              <Route path="/patients/:id/emergency-contacts" element={<PatientEmergencyContactsPage />} />
              <Route path="/patients/:id/doctors" element={<PatientDoctorsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/encounters" element={<PatientEncountersPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/symptoms" element={<PatientSymptomsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/diagnosis" element={<PatientDiagnosisPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/prescriptions" element={<PatientPrescriptionsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/drugs" element={<PatientDrugsPage roles={['DOCTOR']} />} />
            </Route>

            <Route element={<ClinicsLayout roles={['DOCTOR']} />} >
              <Route path="/clinics/accepted" element={<ClinicsPage roles={['DOCTOR']} />}/>
              <Route path="/clinics/requests" element={<ClinicsRequestsPage roles={['DOCTOR']} />} />
              <Route path="/clinics/services" element={<ClinicsServicesPage roles={['DOCTOR']} />} />
            </Route>

            <Route element={<UserProfileLayout />}>
              <Route path="/settings/profile" element={<ProfilePage />} />
              <Route path="/settings/password" element={<PasswordPage />} />
              <Route path="/settings/speciality" element={<SpecialityPage roles={['DOCTOR']} />} />
            </Route>
            
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/encounters/:id/view" element={<EncounterPage roles={['DOCTOR']} />}/>
            <Route path="/prescriptions/:id/view" element={<PrescriptionPage roles={['DOCTOR']} />} />

            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />

          </Route>

          <Route element={<SignupFormLayout />}>
            <Route path="/signup" element={<SignUpPersonalInfoPage />} />
            <Route path="/signup/speciality" element={<SignUpSpecialityPage />} />
            <Route path="/signup/email" element={<SignUpEmailPage />} />
            <Route path="/signup/email/verification-code" element={<SignUpEmailVerificationCodePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <div className="page-bottom-margin"></div>
    </div>
  )
}

export default App

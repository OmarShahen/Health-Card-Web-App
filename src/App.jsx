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
import SettingsPage from './pages/settings'
import LoginPage from './pages/auth/login'
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
import ProfilePage from './pages/profile/profile'
import EncounterPage from './pages/encounter'
import PrescriptionPage from './pages/prescription'
import MainLayout from './components/layouts/main-layout'
import PatientProfileLayout from './components/layouts/patient-profile-layout'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import { useSelector } from 'react-redux'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />
        <Routes>
          {/*<Route path="/patients" element={<PatientsFormPage />} />*/}
          <Route element={<MainLayout />}>
            <Route path="/encounters" element={<EncountersPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/encounters/form" element={<EncountersFormPage />} />
            <Route path="/prescriptions/form" element={<PrescriptionsFormPage />} />
            <Route path="/encounters/:id/update" element={<UpdateEncountersFormPage />} />
            <Route path="/prescriptions/:id/update" element={<UpdatePrescriptionsFormPage />} />
            <Route path="/prescriptions/doctors" element={<DoctorPrescriptionsPage />} />
            <Route path="/prescriptions/patients/:id" element={<PrescriptionPage />} />

            <Route element={<PatientProfileLayout />}>
              <Route path="/patients/:id/medical-profile" element={<PatientMedicalPage />} />
              <Route path="/patients/:id/emergency-contacts" element={<PatientEmergencyContactsPage />} />
              <Route path="/patients/:id/doctors" element={<PatientDoctorsPage />} />
              <Route path="/patients/:id/encounters" element={<PatientEncountersPage />} />
              <Route path="/patients/:id/symptoms" element={<PatientSymptomsPage />} />
              <Route path="/patients/:id/diagnosis" element={<PatientDiagnosisPage />} />
              <Route path="/patients/:id/prescriptions" element={<PatientPrescriptionsPage />} />
              <Route path="/patients/:id/drugs" element={<PatientDrugsPage />} />
            </Route>
            
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/encounters/:id/view" element={<EncounterPage />}/>
            <Route path="/prescriptions/:id/view" element={<PrescriptionPage />} />

            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<ProfilePage />} />

          </Route>

          <Route path="/doctors/login" element={<DoctorLoginPage />} />
          <Route path="/doctors/signup" element={<DoctorSignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <div className="page-bottom-margin"></div>
    </div>
  )
}

export default App

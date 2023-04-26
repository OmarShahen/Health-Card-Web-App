import './App.css'
import PatientsFormPage from './pages/patients-form'
import EncountersPage from './pages/encounters'
import PrescriptionsPage from './pages/prescriptions'
import PatientProfile from './pages/patient-profile'
import BottomNavigationBar from './components/navigation/tab-bar'
import DoctorLoginPage from './pages/doctor-login'
import DoctorSignUpPage from './pages/doctor-signup'
import PrescriptionsFormPage from './pages/prescriptions-form'
import DoctorPrescriptionsPage from './pages/prescriptions/doctor-prescriptions'
import PrescriptionPage from './pages/prescriptions/prescription'
import PatientsPage from './pages/patients'
import PatientMedicalPage from './pages/patient-medical'
import AppointmentsPage from './pages/appointments'
import TabBar from './components/navigation/tab-bar'
import SettingsPage from './pages/settings'
import LoginPage from './pages/auth/login'
import { Toaster } from 'react-hot-toast'
import NavigationBar from './components/navigation/navigation-bar'
import NavigationTabs from './components/navigation/navigation-tabs'
import SideBar from './components/navigation/side-bar'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import { useSelector } from 'react-redux'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />
        { user.isLogged ? <NavigationBar /> : null }
        { user.isLogged ? <NavigationTabs /> : null }
        <Routes>
          {/*<Route path="/patients" element={<PatientsFormPage />} />*/}
          <Route path="/encounters" element={<EncountersPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/cards/:cardUUID" element={<PatientProfile />} />
          <Route path="/encounters/patients/:patientId/form" element={<PrescriptionsFormPage />} />
          <Route path="/prescriptions/doctors" element={<DoctorPrescriptionsPage />} />
          <Route path="/prescriptions/patients/:id" element={<PrescriptionPage />} />

          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id/medical-profile" element={<PatientMedicalPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/doctors/login" element={<DoctorLoginPage />} />
          <Route path="/doctors/signup" element={<DoctorSignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        {/*<BottomNavigationBar />*/}
      </Router>
      <div className="page-bottom-margin"></div>
    </div>
  )
}

export default App

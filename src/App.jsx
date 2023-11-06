import './App.css'
import EncountersPage from './pages/encounters'
import PrescriptionsPage from './pages/prescriptions'
import EncountersFormPage from './pages/encounters-form'
import PrescriptionsFormPage from './pages/prescriptions-form'
import DoctorPrescriptionsPage from './pages/prescriptions/doctor-prescriptions'
import PatientsPage from './pages/patients'
import PatientMedicalPage from './pages/patients/patient-medical'
import AppointmentsPage from './pages/appointments'
import ClinicsOwnedPage from './pages/clinics/clinics-owned'
import ClinicsInvitationsPage from './pages/clinics/clinics-invitations'
import ClinicsServicesPage from './pages/clinics-services'
import ClinicsJoinRequestsPage from './pages/clinics/clinics-requests'
import ClinicsRegisteredPage from './pages/clinics/clinics-registered'
import SettingsPage from './pages/settings'
import ProfilePage from './pages/profile/profile'
import SpecialityPage from './pages/profile/speciality'
import PasswordPage from './pages/profile/password'
import DeleteAccountPage from './pages/profile/delete-account'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ForgotPasswordVerificationCodePage from './pages/auth/forgot-password-verification-code'
import ResetPasswordPage from './pages/auth/reset-password'
import SignUpPersonalInfoPage from './pages/auth/sign-up-personal-info'
import SignUpSpecialityPage from './pages/auth/sign-up-speciality'
import SignUpEmailPage from './pages/auth/signup-email'
import SignUpEmailVerificationCodePage from './pages/auth/sign-up-email-verification-code'
import SignUpDemographicPage from './pages/auth/sign-up-demographic'
import SignUpRolePage from './pages/auth/sign-up-role'
import SignUpStaffClinicPage from './pages/auth/sign-up-staff-clinic'
import { Toaster } from 'react-hot-toast'
import PatientEmergencyContactsPage from './pages/patients/patient-emergency-contacts'
import PatientDoctorsPage from './pages/patients/patient-doctors'
import PatientEncountersPage from './pages/patients/patient-encounters'
import PatientSymptomsPage from './pages/patients/patient-symptoms'
import PatientDiagnosisPage from './pages/patients/patient-diagnosis'
import PatientPrescriptionsPage from './pages/patients/patient-prescriptions'
import PatientDrugsPage from './pages/patients/patient-drugs'
import PatientAppointmentsPage from './pages/patients/patient-appointments'
import PatientInvoicesPage from './pages/patients/patient-invoices'
import PatientInsurancePoliciesPage from './pages/patients/patient-insurance-policies'
import PatientStorageHomePage from './pages/patients/patient-storage-home'
import PatientStorageFoldersPage from './pages/patients/patient-storage-folders'
import UpdateEncountersFormPage from './pages/update-encounter-form'
import UpdatePrescriptionsFormPage from './pages/update-prescription-form'
import PatientFormPage from './pages/patient-form'
import SupportPage from './pages/support/support'
import EncounterPage from './pages/encounter'
import PrescriptionPage from './pages/prescription'
import InvoicesPage from './pages/invoices/invoices'
import InvoiceCheckoutPage from './pages/invoices/invoice-checkout'
import InvoicePage from './pages/invoices/invoice'
import ServicesPage from './pages/services'
import MainLayout from './components/layouts/main-layout'
import PatientProfileLayout from './components/layouts/patient-profile-layout'
import SignupFormLayout from './components/layouts/signup-layout'
import ClinicsLayout from './components/layouts/clinic-layout'
import UserProfileLayout from './components/layouts/user-profile-layout'
import ClinicProfileLayout from './components/layouts/clinic-profile-layout'
import ClinicProfilePage from './pages/clinic-profile/clinic-info'
import ClinicServicesPage from './pages/clinic-profile/clinic-services'
import ClinicsStaffsRequestsPage from './pages/clinics/clinics-staffs-requests'
import ClinicsDoctorsRequestsPage from './pages/clinics/clinics-doctors-requests'
import ClinicsOwnersRequestsPage from './pages/clinics/clinics-owners-requests'
import DoctorsPage from './pages/doctors'
import StaffsPage from './pages/staffs'
import StaffPendingPage from './pages/accounts/staff-pending'

import UpgradeAccountConfirmationModal from './components/modals/confirmation/upgrade-account-confirmation-modal'
import RechargeClinicConfirmationModal from './components/modals/confirmation/recharge-clinic-confirmation-modal'

import PaymentStatusPage from './pages/payments/payment-status'
import PaymentCheckoutPage from './pages/payments/payment-checkout'
import PaymentsPackagesPage from './pages/payments/payment-packages'
import PaymentsBillingDataPage from './pages/payments/payment-billing-data'

import InsurancesPage from './pages/insurances/insurances'
import InsurancePoliciesPage from './pages/insurances/insurance-policies'

import InsurancesLayout from './components/layouts/insurance-layout'
import InsuranceInvoicesPage from './pages/insurances/insurance-company-invoices'
import InsuranceCompanyPoliciesPage from './pages/insurances/insurance-company-policies'

import FileManagerHomePage from './pages/file-manager/home'
import FileManagerFolderPage from './pages/file-manager/folder'
import FileManagerFilesPage from './pages/file-manager/file'

import PDFViewerPage from './pages/viewer/pdf-viewer'

import AnalyticsOverviewPage from './pages/analytics/overview'
import MarketingReportPage from './pages/analytics/marketing-report'
import ImpressionsSurveysReportPage from './pages/analytics/impression-surveys-report'
import TreatmentSurveysReportPage from './pages/analytics/treatment-surveys-report'

import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'


function App() {

  const modal = useSelector(state => state.modal)
  const user = useSelector(state => state.user.user)

  return (
    <div className="App">
      <Router>
        <Toaster />
        { modal.isShowModal ? <UpgradeAccountConfirmationModal /> : null }
        { modal.isShowRenewModal ? <RechargeClinicConfirmationModal /> : null }

        <Routes>

          <Route path="/" element={<Navigate to="/login" />} />

          <Route element={user.isLogged ? <MainLayout /> : <LoginPage />}>

            <Route path="/analytics/overview" element={<AnalyticsOverviewPage roles={['OWNER']} />} />
            <Route path="/analytics/marketing-report" element={<MarketingReportPage roles={['OWNER']} />} />
            <Route path="/analytics/impressions-report" element={<ImpressionsSurveysReportPage roles={['OWNER']} />} />
            <Route path="/analytics/treatments-report" element={<TreatmentSurveysReportPage roles={['OWNER']} />} />

            <Route path="/doctors" element={<DoctorsPage roles={['OWNER', 'STAFF']} />} />
            <Route path="/staffs" element={<StaffsPage roles={['OWNER']} />} />
            <Route path="/invoices" element={<InvoicesPage roles={['OWNER', 'STAFF']} />} />
            <Route path="/invoices/checkout" element={<InvoiceCheckoutPage roles={['OWNER', 'STAFF']} />} />
            <Route path="/services" element={<ServicesPage roles={['OWNER', 'STAFF']} />} />
            <Route path="/encounters" element={<EncountersPage roles={['DOCTOR']} />} />
            <Route path="/appointments" element={<AppointmentsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
            <Route path="/prescriptions" element={<PrescriptionsPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/encounters/form" element={<EncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/form" element={<PrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/patients/form" element={<PatientFormPage roles={['STAFF', 'DOCTOR']}/>} />
            <Route path="/patients/:patientId/form" element={<PatientFormPage roles={['STAFF', 'DOCTOR']}/>} />
            <Route path="/encounters/:id/update" element={<UpdateEncountersFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/:id/update" element={<UpdatePrescriptionsFormPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/doctors" element={<DoctorPrescriptionsPage roles={['DOCTOR']} />} />
            <Route path="/prescriptions/patients/:id" element={<PrescriptionPage roles={['DOCTOR', 'STAFF']} />} />
            <Route path="/invoices/:invoiceId" element={<InvoicePage roles={['OWNER', 'STAFF']} />}/>

            <Route path="/billing/checkout" element={<PaymentCheckoutPage roles={['DOCTOR', 'OWNER']}/>} />
            <Route path="/billing/packages" element={<PaymentsPackagesPage roles={['DOCTOR', 'OWNER']} />} />
            <Route path="/billing/billing-data" element={<PaymentsBillingDataPage roles={['OWNER', 'DOCTOR']} />} />

            <Route path="/insurance-companies" element={<InsurancesPage roles={['OWNER', 'STAFF']} />} />
            <Route path="/insurance-policies" element={<InsurancePoliciesPage roles={['DOCTOR', 'STAFF']} />} />

            <Route path="/clinics/services" element={<ClinicsServicesPage roles={['OWNER', 'STAFF']} />} />

            <Route path="/files-manager" element={<FileManagerHomePage roles={['OWNER', 'DOCTOR']} />} />
            <Route path="/files-manager/folders/:folderId" element={<FileManagerFolderPage roles={['OWNER', 'STAFF', 'DOCTOR']} />} />
        
            <Route element={<PatientProfileLayout />}>
              <Route path="/patients/:id/clinics/:clinicId/medical-profile" element={<PatientMedicalPage roles={['STAFF', 'DOCTOR', 'OWNER']}/>} />
              <Route path="/patients/:id/clinics/:clinicId/emergency-contacts" element={<PatientEmergencyContactsPage roles={['STAFF', 'DOCTOR', 'OWNER']} />} />
              <Route path="/patients/:id/clinics/:clinicId/doctors" element={<PatientDoctorsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/encounters" element={<PatientEncountersPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/symptoms" element={<PatientSymptomsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/diagnosis" element={<PatientDiagnosisPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/prescriptions" element={<PatientPrescriptionsPage roles={['DOCTOR']} />} />
              <Route path="/patients/:id/clinics/:clinicId/drugs" element={<PatientDrugsPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/appointments" element={<PatientAppointmentsPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/invoices" element={<PatientInvoicesPage roles={['DOCTOR', 'STAFF']} />} />
              <Route path="/patients/:id/clinics/:clinicId/insurance-policies" element={<PatientInsurancePoliciesPage roles={['STAFF', 'OWNER']} />} />
              <Route path="/patients/:id/clinics/:clinicId/attachments" element={<PatientStorageHomePage roles={['DOCTOR', 'OWNER', 'STAFF']} />} />
              {/*<Route path="/patients/:id/clinics/:clinicId/folders/:folderId" element={<PatientStorageFoldersPage roles={['OWNER', 'STAFF', 'DOCTOR']} />} />*/}
            </Route>

            <Route element={<ClinicsLayout roles={['DOCTOR', 'OWNER']} />} >
              <Route path="/clinics/owned" element={<ClinicsOwnedPage roles={['DOCTOR', 'OWNER']} />}/>
              <Route path="/clinics/invitations" element={<ClinicsInvitationsPage roles={['DOCTOR', 'OWNER']} />} />
              <Route path="/clinics/requests" element={<ClinicsJoinRequestsPage roles={['OWNER']}/>} />
              <Route path="/clinics/registered" element={<ClinicsRegisteredPage roles={['DOCTOR']} />} />
              <Route path="/clinics/staffs/requests" element={<ClinicsStaffsRequestsPage roles={['OWNER']} />} />
              <Route path="/clinics/doctors/requests" element={<ClinicsDoctorsRequestsPage roles={['OWNER']} />} />
              <Route path="/clinics/owners/requests" element={<ClinicsOwnersRequestsPage roles={['DOCTOR', 'OWNER']} />} />
            </Route>

            <Route element={<ClinicProfileLayout roles={['OWNER']} />}>
              <Route path="/clinics/:clinicId/profile" element={<ClinicProfilePage roles={['OWNER']} />} />
              <Route path="/clinics/:clinicId/services" element={<ClinicServicesPage roles={['OWNER']} />} />
            </Route>

            <Route element={<UserProfileLayout />}>
              <Route path="/settings/profile" element={<ProfilePage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/password" element={<PasswordPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
              <Route path="/settings/speciality" element={<SpecialityPage roles={['DOCTOR']} />} />
              <Route path="/settings/account-delete" element={<DeleteAccountPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            </Route>

            <Route element={<InsurancesLayout />}>
              <Route path="/insurance-companies/:insuranceCompanyId/invoices" element={<InsuranceInvoicesPage roles={['OWNER', 'STAFF']} />} />
              <Route path="/insurance-companies/:insuranceCompanyId/policies" element={<InsuranceCompanyPoliciesPage roles={['OWNER', 'STAFF']} />} />
            </Route>
            
            <Route path="/patients" element={<PatientsPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            <Route path="/encounters/:id/view" element={<EncounterPage roles={['DOCTOR']} />}/>
            <Route path="/prescriptions/:id/view" element={<PrescriptionPage roles={['DOCTOR', 'STAFF']} />} />

            <Route path="/settings" element={<SettingsPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />
            <Route path="/support" element={<SupportPage roles={['DOCTOR', 'STAFF', 'OWNER']} />} />

          </Route>

          <Route element={<SignupFormLayout />}>
            <Route path="/signup" element={<SignUpPersonalInfoPage />} />
            <Route path="signup/demographic" element={<SignUpDemographicPage />} />
            <Route path="/signup/speciality" element={<SignUpSpecialityPage />} />
            <Route path="signup/roles" element={<SignUpRolePage />} />
            <Route path="/signup/email" element={<SignUpEmailPage />} />
            <Route path="/signup/staffs/clinics" element={<SignUpStaffClinicPage />} />
            <Route path="/signup/email/verification-code" element={<SignUpEmailVerificationCodePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:email" element={<ForgotPasswordVerificationCodePage />} />
          <Route path="reset-password/:email/:verificationCode" element={<ResetPasswordPage />} />

          <Route path="/users/pending" element={<StaffPendingPage />} />

          <Route path="/payments/status" element={<PaymentStatusPage />} />

          <Route path="/viewers/pdf/:fileId" element={<PDFViewerPage />}/>

        </Routes>
      </Router>
      <div className="page-bottom-margin"></div>
    </div>
  )
}

export default App

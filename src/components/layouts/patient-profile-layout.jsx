import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { serverRequest } from '../../components/API/request'
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { setPatient } from '../../redux/slices/patientSlice'
import { useDispatch, useSelector } from 'react-redux'
import translations from '../../i18n'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AppointmentFormModal from '../modals/appointment-form'
import EmergencyContactFormModal from '../modals/emergency-contacts-form'
import InsurancePoliciyFormModal from '../modals/insurance-policy-form'

const PatientProfileLayout = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const dispatch = useDispatch()
    const [showQuickActionsForm, setShowQuickActionsForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [patientProfile, setPatientProfile] = useState({})

    const [isShowAppointmentsForm, setIsShowAppointmentsForm] = useState(false)
    const [isShowEmergencyContactsForm, setIsShowEmergencyContactsForm] = useState(false)
    const [isShowInsurancePolicy, setIsShowInsurancePolicy] = useState(false)

    useEffect(() => scroll(0,0), [])
    
    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setPatientProfile(data.patient)
            dispatch(setPatient(data.patient))
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Medical Profile']} />
        { isShowAppointmentsForm ? <AppointmentFormModal setShowFormModal={setIsShowAppointmentsForm} /> : null }
        { isShowEmergencyContactsForm ? <EmergencyContactFormModal mode={'CREATE'} setShowModalForm={setIsShowEmergencyContactsForm} /> : null }
        { isShowInsurancePolicy ? <InsurancePoliciyFormModal setShowFormModal={setIsShowInsurancePolicy} /> : null }
        <div className="padded-container">
        <div className="page-header-wrapper">
                    <div className="back-button-container">
                        <ArrowBackIcon />
                        <span onClick={e => navigate(-1)}>{translations[lang]['Back']}</span>
                    </div>
                    <div className="page-header-container">
                        <div>
                            <h1>
                                { isLoading ? 'Loading...' : patientProfile?.firstName + ' ' + patientProfile?.lastName }
                            </h1>
                        </div>
                        <div className="btns-container subheader-text quick-form-container">
                            <button onClick={e => setShowQuickActionsForm(!showQuickActionsForm)}>
                                <AddOutlinedIcon />
                                <strong>
                                    {translations[lang]['Quick Actions']}
                                </strong>
                            </button>
                            { 
                            showQuickActionsForm ? 
                            <QuickFormMenu 
                            setShowAppointmentForm={setIsShowAppointmentsForm}
                            setShowEmergencyContactForm={setIsShowEmergencyContactsForm}
                            setShowInsurancePoliciesForm={setIsShowInsurancePolicy}
                            /> 
                            : 
                            null 
                            }
                        </div>
                    </div>
                </div>
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/patients/${patientId}/medical-profile`}>{translations[lang]['Profile']}</NavLink></li> 
                    <li><NavLink to={`/patients/${patientId}/emergency-contacts`}>{translations[lang]['Emergency Contacts']}</NavLink></li>
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/doctors`}>{translations[lang]['Past Doctors']}</NavLink></li> */}
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/encounters`}>{translations[lang]['Encounters']}</NavLink></li> }
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/symptoms`}>{translations[lang]['Symptoms']}</NavLink></li> */}
                    {/* !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/diagnosis`}>{translations[lang]['Diagnosis']}</NavLink></li> */}
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/prescriptions`}>{translations[lang]['Prescriptions']}</NavLink></li> }
                    { !user.roles.includes('DOCTOR') ? null : <li><NavLink to={`/patients/${patientId}/drugs`}>{translations[lang]['Drugs']}</NavLink></li> }
                    { user.roles.includes('DOCTOR') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/appointments`}>{translations[lang]['Appointments']}</NavLink></li> : null }
                    { user.roles.includes('OWNER') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/invoices`}>{translations[lang]['Invoices']}</NavLink></li> : null }
                    { user.roles.includes('OWNER') || user.roles.includes('STAFF') ? <li><NavLink to={`/patients/${patientId}/insurance-policies`}>{translations[lang]['Insurance Policies']}</NavLink></li> : null }
                </ul>
            </div>
            <Outlet />
        </div>
    </div>
}

export default PatientProfileLayout
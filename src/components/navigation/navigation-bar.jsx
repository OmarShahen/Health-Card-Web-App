import { useState, useEffect } from 'react'
import './navigation-bar.css'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import UserProfileMenu from '../menus/profile/profile'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import translations from '../../i18n'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import AppointmentFormModal from '../modals/appointment-form'
import { serverRequest } from '../API/request'
import { setServices } from '../../redux/slices/servicesSlice'
import { setDoctors } from '../../redux/slices/doctorsSlice'
import InvoiceFormModal from '../modals/invoice-form'
import InsurancePolicyFormModal from '../modals/insurance-policy-form'
import InsuranceFormModal from '../modals/insurance-form'
import SearchPatientInputField from '../inputs/patients-search'
import { setInsuranceCompanies } from '../../redux/slices/insuranceCompaniesSlice'
import { setClinics } from '../../redux/slices/clinicsSlice'


const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)
    const [showQuickActionsForm, setShowQuickActionsForm] = useState(false)

    const [isShowAppointmentsForm, setIsShowAppointmentsForm] = useState(false)
    const [showInvoiceForm, setShowInvoiceForm] = useState(false)
    const [isShowEmergencyContactsForm, setIsShowEmergencyContactsForm] = useState(false)
    const [isShowInsurancePolicy, setIsShowInsurancePolicy] = useState(false)
    const [isShowInsuranceCompanyForm, setIsShowInsuranceCompanyForm] = useState(false)


    useEffect(() => {
        if(!user.isLogged) {
            navigate('/login')
        }

        if(user.roles.includes('STAFF') && !user.clinicId) {
            navigate('/users/pending')
        }

        const windowWidth = window.innerWidth

        if(windowWidth <= 600) {
            dispatch(setIsShowSidebar(false))
        }

    }, [user.isLogged])

    useEffect(() => {

        if(!user.roles.includes('STAFF')) {
            return
        }

        serverRequest.get(`/v1/services/clinics/${user.clinicId}`)
        .then(response => {
            const services = response.data.services
            dispatch(setServices({ services }))
        })
        .catch(error => {
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('STAFF')) {
            return
        }

        serverRequest.get(`/v1/doctors/clinics/${user.clinicId}`)
        .then(response => {
            const doctors = response.data.doctors
            dispatch(setDoctors({ doctors }))
        })
        .catch(error => {
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('STAFF')) {
            return
        }

        serverRequest.get(`/v1/insurances/clinics/${user.clinicId}`)
        .then(response => {
            const insuranceCompanies = response.data.insurances
            dispatch(setInsuranceCompanies({ insuranceCompanies }))
        })
        .catch(error => {
            console.error(error.response.data.message)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('OWNER')) {
            return
        }

        serverRequest.get(`/v1/clinics-owners/owners/${user._id}`)
        .then(response => {
            const clinics = response.data.clinics
            dispatch(setClinics({ clinics }))
        })
        .catch(error => {
            console.error(error.response.data.message)
        })
    }, [])


    return <div>
        <div className="navigation-bar-container body-text">
            <div className="navigation-map-container">
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
                <span>{`${user.firstName} ${user.lastName}`}</span>
            </div>
            
            <div className="navigation-bar-options-container">
                
                <div className="quick-form-container">
                    <button 
                    className="upgrade-btn"
                    onClick={e => setShowQuickActionsForm(!showQuickActionsForm)}
                    >
                        <AddOutlinedIcon />
                        {translations[lang]['Create']}
                    </button>
                    { 
                        showQuickActionsForm ? 
                        <QuickFormMenu 
                        setShowAppointmentForm={setIsShowAppointmentsForm}
                        setShowEmergencyContactForm={setIsShowEmergencyContactsForm}
                        setShowInsurancePoliciesForm={setIsShowInsurancePolicy}
                        setShowInvoiceForm={setShowInvoiceForm}
                        setShowMenu={setShowQuickActionsForm}
                        setIsShowInsuranceCompanyForm={setIsShowInsuranceCompanyForm}
                        /> 
                        : 
                        null 
                    }
                </div>
                   
                <div className="show-large">
                    <NavLink to="/settings/profile">
                        <SettingsOutlinedIcon />
                    </NavLink>
                </div>
                <div className="show-large">
                    <NotificationsNoneOutlinedIcon />
                </div>
                <div className="user-profile-container">
                    <span onClick={e => setShowUserProfileMenu(!showUserProfileMenu)}>
                        <AccountCircleIcon />
                    </span>
                    { showUserProfileMenu ? <UserProfileMenu user={user} /> : null }
                </div>
            </div>
        </div>
        { 
            isShowAppointmentsForm ? 
            <AppointmentFormModal setShowFormModal={setIsShowAppointmentsForm} />
             : 
             null 
        }
        { 
            showInvoiceForm ? 
            <InvoiceFormModal setShowModalForm={setShowInvoiceForm} /> 
            : 
            null 
        }
        {
            isShowInsurancePolicy ?
            <InsurancePolicyFormModal setShowFormModal={setIsShowInsurancePolicy} />
            :
            null
        }
        {
            isShowInsuranceCompanyForm ?
            <InsuranceFormModal setShowFormModal={setIsShowInsuranceCompanyForm} />
            :
            null
        }

    </div>
}

export default NavigationBar
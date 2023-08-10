import { useState, useEffect } from 'react'
import './navigation-bar.css'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import UserProfileMenu from '../menus/profile/profile'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import PatientFormModal from '../modals/patient-form'
import AppointmentFormModal from '../modals/appointment-form'
import InvoiceFormModal from '../modals/invoice-form'
import PatientCardJoinFormModal from '../modals/patient-card-join-form'
import InsuranceFormModal from '../modals/insurance-form'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import translations from '../../i18n'

const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const sidebar = useSelector(state => state.sidebar)
    const lang = useSelector(state => state.lang.lang)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)
    const [showQuickFormsMenu, setShowQuickFormsMenu] = useState(false)

    const [showPatientForm, setShowPatientForm] = useState(false)
    const [showPatientCardForm, setShowPatientCardForm] = useState(false)
    const [showAppointmentForm, setShowAppointmentForm] = useState(false)
    const [showInvoiceForm, setShowInvoiceForm] = useState(false)
    const [showInsuranceCompanyForm, setShowInsuranceCompanyForm] = useState(false)

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


    return <div>
        <div className="navigation-bar-container body-text">
            { showPatientForm ? <PatientFormModal setShowModalForm={setShowPatientForm} /> : null }
            { showPatientCardForm ? <PatientCardJoinFormModal setShowModalForm={setShowPatientCardForm} /> : null }
            { showAppointmentForm ? <AppointmentFormModal setShowFormModal={setShowAppointmentForm} /> : null }
            { showInvoiceForm ? <InvoiceFormModal setShowModalForm={setShowInvoiceForm}/> : null }
            { showInsuranceCompanyForm ? <InsuranceFormModal setShowFormModal={setShowInsuranceCompanyForm} /> : null }

            <div className="navigation-map-container">
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
                <span>{pageName}</span>
            </div>
            <div className="navigation-bar-options-container">
                <div className="quick-form-container">
                    <button 
                    className="create-btn" 
                    onClick={e => setShowQuickFormsMenu(!showQuickFormsMenu)}
                    >
                        {translations[lang]['Create']}
                        <KeyboardArrowDownOutlinedIcon />
                    </button>
                    { showQuickFormsMenu ?
                    <QuickFormMenu 
                    setShowPatientForm={setShowPatientForm}
                    setShowPatientCardForm={setShowPatientCardForm}
                    setShowAppointmentForm={setShowAppointmentForm}
                    setShowInvoiceForm={setShowInvoiceForm}
                    setShowInsuranceCompanyForm={setShowInsuranceCompanyForm}
                    /> 
                    : 
                    null 
                    }
                </div>
                <div>
                    <NavLink to="/settings/profile">
                        <SettingsOutlinedIcon />
                    </NavLink>
                </div>
                <div>
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
    </div>
}

export default NavigationBar
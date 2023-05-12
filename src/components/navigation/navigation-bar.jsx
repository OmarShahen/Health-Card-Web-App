import { useState, useEffect } from 'react'
import './navigation-bar.css'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import UserProfileMenu from '../menus/profile/profile'
import QuickFormMenu from '../menus/quick-forms/quick-forms'
import PatientFormModal from '../modals/patient-form'
import AppointmentFormModal from '../modals/appointment-form'
import PatientCardJoinFormModal from '../modals/patient-card-join-form'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'

const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const sidebar = useSelector(state => state.sidebar)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)
    const [showQuickFormsMenu, setShowQuickFormsMenu] = useState(false)

    const [showPatientForm, setShowPatientForm] = useState(false)
    const [showPatientCardForm, setShowPatientCardForm] = useState(false)
    const [showAppointmentForm, setShowAppointmentForm] = useState(false)

    useEffect(() => {
        if(!user.isLogged) {
            navigate('/login')
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
                        Create
                        <KeyboardArrowDownOutlinedIcon />
                    </button>
                    { showQuickFormsMenu ?
                    <QuickFormMenu 
                    setShowPatientForm={setShowPatientForm}
                    setShowPatientCardForm={setShowPatientCardForm}
                    setShowAppointmentForm={setShowAppointmentForm}
                    /> 
                    : 
                    null 
                    }
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
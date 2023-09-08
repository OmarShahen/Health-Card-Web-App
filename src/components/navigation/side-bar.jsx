import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import './side-bar.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined'
import StoreMallDirectoryOutlinedIcon from '@mui/icons-material/StoreMallDirectoryOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { setIsLogged, setMode } from '../../redux/slices/userSlice'
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined'
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined'
import { serverRequest } from '../API/request'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { formatNumber } from '../../utils/numbers'
import { setNumberOfInvitations } from '../../redux/slices/invitationSlice'
import { toast } from 'react-hot-toast'
import { capitalizeFirstLetter } from '../../utils/formatString'
import UpgradeOutlinedIcon from '@mui/icons-material/UpgradeOutlined'
import { motion, AnimatePresence } from "framer-motion";
import logoImage from '../../assets/memories.png'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import format from 'date-fns/format'
import translations from '../../i18n'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined'
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined'
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined'
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined'
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined'
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'


const SideBar = ({ width, isHideText, setHideSideBar }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)
    const numberOfInvitations = useSelector(state => state.invitation.numberOfInvitations)

    const [numberOfAppointments, setNumberOfAppointments] = useState(0)

    const [isShowTreatment, setIsShowTreatment] = useState(true)
    const [isShowAppointments, setIsShowAppointments] = useState(true)
    const [isShowInsurances, setIsShowInsurances] = useState(user.roles.includes('STAFF') ? true : false)
    const [isShowInvoices, setIsShowInvoices] = useState(false)
    const [isShowUsers, setIsShowUsers] = useState(user.roles.includes('STAFF') ? true : false)
    const [isShowClinics, setIsShowClinics] = useState(true)
    const [isShowInvitations, setIsShowInvitations] = useState(false)

    useEffect(() => {

        if(!user.roles.includes('OWNER')) {
            return
        }

        serverRequest.get(`/v1/users/${user._id}/mode`)
        .then(response => {
            dispatch(setMode(response.data.mode))
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics-requests/users/${user._id}/status/PENDING`)
        .then(response => {
            dispatch(setNumberOfInvitations(response.data.clinicsRequests.length))
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('DOCTOR') && !user.roles.includes('STAFF')) {
            return
        }

        const todayDate = new Date()

        const statsQuery = { specific: format(todayDate, 'yyyy-MM-dd') }

        const endpointURL = user.roles.includes('DOCTOR') ? 
        `/v1/appointments/doctors/${user._id}/status/UPCOMING`
        :
        `/v1/appointments/clinics/${user.clinicId}/status/UPCOMING`

        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setNumberOfAppointments(response.data.appointments.length)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return <div className="side-bar-container body-text" style={{ width }}>
        <AnimatePresence>
      <motion.div
        className="sidebar"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
      >
        <div className="side-bar-arrow-container show-mobile">
            <span onClick={e => dispatch(setIsShowSidebar(false))}>
                <ArrowBackIcon />
            </span>
        </div>
        <div className="center side-bar-logo-container">
            <img src={logoImage} />
        </div>
        {
            user?.roles?.includes('OWNER') && user.mode ?
            <div className="center margin-vertical-1">
                {
                    user.mode === 'TEST' ?
                    <span className="status-btn tag-green-bg white-text box-shadow span-text bold-text">
                        Free Trial
                    </span>
                    :
                    <span className="status-btn tag-red-bg white-text box-shadow span-text bold-text">
                        Plus mode
                    </span>
                }
                
            </div>
            :
            null
        }
        
        <ul>
        <ul className="nav-nested-list-container">
            {/*}
            <li>
                <div>
                    <NavLink to="/patients">
                        <SignalCellularAltOutlinedIcon />
                        Dashboard
                    </NavLink>
                </div>
            </li>
            */}
            <li>
                <div>
                    <NavLink to="/patients">
                        <HotelOutlinedIcon />
                        {translations[lang]['Patients']}
                    </NavLink>
                </div>
            </li>
            
            {
                user.roles.includes('OWNER') || user.roles.includes('STAFF') ?
                <li>
                    <div>
                        <NavLink to="/invoices">
                            <PaymentOutlinedIcon />
                            {translations[lang]['Invoices']}
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            {
                user.roles.includes('OWNER') || user.roles.includes('STAFF') ?
                <li>
                    <div>
                        <NavLink to="/clinics/services">
                            <FactCheckOutlinedIcon />
                            {translations[lang]['Services']}
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            {
                user.roles.includes('OWNER') || user.roles.includes('DOCTOR') ?
                <li>
                    <div>
                        <NavLink to="/files-manager">
                            <CreateNewFolderOutlinedIcon />
                            {translations[lang]['Files Manager']}
                        </NavLink>
                    </div>
                </li>
                :
                null
            }
            {
                user.roles.includes('DOCTOR') || user.roles.includes('OWNER') ?
                <li>
                    <div>
                        <NavLink to="/clinics/invitations">
                                <EmailOutlinedIcon />
                                { translations[lang]['My Invitations'] }
                        </NavLink>
                    </div>
                    <span className="side-bar-number-container span-text">{formatNumber(numberOfInvitations)}</span>
                </li>
                :
                null
            }
        </ul>
        {
                user?.roles?.includes('STAFF') ?
                null
                :
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowClinics(!isShowClinics)}
                    >
                        { translations[lang]['Clinics'] }
                        <span>
                            { isShowClinics ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowClinics ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                            <ul className="nav-nested-list-container">
                                <li>
                                    <div>
                                        <NavLink to="/clinics/owned">
                                            <StoreMallDirectoryOutlinedIcon />
                                            {translations[lang]['Owned']}
                                        </NavLink>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <NavLink to="/clinics/registered">
                                            <HowToRegOutlinedIcon />
                                            {translations[lang]['Registered']}
                                        </NavLink>
                                    </div>
                                </li>
                            </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
            }
            {
                user.roles.includes('DOCTOR') ? 
                <li>
                    <div 
                    className="header-list-container" 
                    onClick={e => setIsShowTreatment(!isShowTreatment)}
                    >
                        { translations[lang]['Treatment'] }
                        <span>
                            { isShowTreatment ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowTreatment ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                        <ul className="nav-nested-list-container">
                            <li>
                                <div>
                                    <NavLink to="/encounters">
                                        <AssignmentOutlinedIcon />
                                        {translations[lang]['Encounters']}
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/prescriptions">
                                        <MedicationOutlinedIcon />
                                        {translations[lang]['Prescriptions']}
                                    </NavLink>
                                </div>
                            </li>
                        </ul>
                        </motion.ul>
                        :
                        null
                    }
                </li>
                :
                null
            }
        
        <li>
                <div 
                className="header-list-container"
                onClick={e => setIsShowAppointments(!isShowAppointments)}
                >
                    { translations[lang]['Appointments'] }
                    <span>
                        { isShowTreatment ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                    </span>
                </div>
                {
                    isShowAppointments ?
                    <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="nested-links"
                    >
                    <ul className="nav-nested-list-container">
                        <li>
                            <div>
                                <NavLink to="/appointments">
                                        <TodayOutlinedIcon />
                                        { translations[lang]['Today'] }
                                </NavLink>
                            </div>
                            <span className="side-bar-number-container span-text">{formatNumber(numberOfAppointments)}</span>
                        </li>
                        <li>
                            <div>
                                <NavLink to="/appointments?period=1">
                                        <InsertInvitationOutlinedIcon />
                                        { translations[lang]['Tommorrow'] }
                                </NavLink>
                            </div>
                        </li>
                    </ul>
                    </motion.ul>
                    :
                    null
                }
            </li>            
            
            {
                user.roles.includes('OWNER') || user.roles.includes('STAFF') ?
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowUsers(!isShowUsers)}
                    >
                        { translations[lang]['Users'] }
                        <span>
                        { isShowUsers ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowUsers ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                        <ul className="nav-nested-list-container">
                            <li>
                                <div>
                                    <NavLink to="/doctors">
                                            <MedicalInformationOutlinedIcon />
                                            { translations[lang]['Doctors'] }
                                    </NavLink>
                                </div>
                            </li>
                            {
                                user.roles.includes('OWNER') ?
                                <li>
                                    <div>
                                        <NavLink to="/staffs">
                                                <AssignmentIndOutlinedIcon />
                                                { translations[lang]['Staffs'] }
                                        </NavLink>
                                    </div>
                                </li>
                                :
                                null
                            }
                        </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
                :
                null
            }
            {
                user.roles.includes('OWNER') || user.roles.includes('STAFF') ?
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowInsurances(!isShowInsurances)}
                    >
                        { translations[lang]['Insurances'] }
                        <span>
                        { isShowInsurances ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowInsurances ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                        <ul className="nav-nested-list-container">
                            <li>
                                <div>
                                    <NavLink to="/insurance-companies">
                                        <HomeWorkOutlinedIcon />
                                        {translations[lang]['Companies']}
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/insurance-policies">
                                        <HealthAndSafetyOutlinedIcon />
                                        {translations[lang]['Policies']}
                                    </NavLink>
                                </div>
                            </li>
                        </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
                :
                null
            }
            {
                user?.roles?.includes('OWNER') ?
                <li>
                    <div 
                    className="header-list-container"
                    onClick={e => setIsShowInvitations(!isShowInvitations)}
                    >
                        { translations[lang]['Invitations & Requests'] }
                        <span>
                        { isShowInvitations ? <KeyboardArrowUpIcon /> : <ExpandMoreOutlinedIcon /> }
                        </span>
                    </div>
                    {
                        isShowInvitations ?
                        <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="nested-links"
                        >
                        <ul className="nav-nested-list-container">
                            <li>
                                <div>
                                    <NavLink to="/clinics/invitations">
                                            <EmailOutlinedIcon />
                                            { translations[lang]['My Invitations'] }
                                    </NavLink>
                                </div>
                                <span className="side-bar-number-container span-text">{formatNumber(numberOfInvitations)}</span>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/clinics/owners/requests">
                                            <ContactEmergencyOutlinedIcon />
                                            { translations[lang]['Owners'] }
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/clinics/doctors/requests">
                                            <MedicalInformationOutlinedIcon />
                                            { translations[lang]['Doctors'] }
                                    </NavLink>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <NavLink to="/clinics/staffs/requests">
                                            <AssignmentIndOutlinedIcon />
                                            { translations[lang]['Staffs'] }
                                    </NavLink>
                                </div>
                            </li>    
                        </ul>
                        </motion.ul>
                        :
                        null
                    }
                    
                </li>
                :
                null
            }
            {/*<li>
                <NavLink to="/login" onClick={e => {
                    sessionStorage.setItem('user', null)
                    dispatch(setIsLogged(false))
                }}>
                    <span>
                        <LogoutOutlinedIcon />
                        {isHideText ? null : translations[lang]['Logout'] }
                    </span>
                </NavLink>
            </li>*/}
            </ul>
        {
            (user?.roles?.includes('DOCTOR') || user?.roles?.includes('OWNER')) && user.mode === 'TEST' ?
            <div className="center margin-vertical-1">
                <NavLink to="/billing/packages" className="upgrade-container action-color-bg white-text">
                    <UpgradeOutlinedIcon />
                    Upgrade
                </NavLink>
            </div>
            :
            null
        }
    </motion.div>
    </AnimatePresence>
    </div>
}

export default SideBar
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
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'

const NavigationBar = ({ pageName }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const sidebar = useSelector(state => state.sidebar)
    const lang = useSelector(state => state.lang.lang)
    const dispatch = useDispatch()

    const [showUserProfileMenu, setShowUserProfileMenu] = useState(false)


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
            <div className="navigation-map-container">
                    <span onClick={e => dispatch(setIsShowSidebar(!sidebar.isShowSidebar))}>
                        <MenuOpenIcon />
                    </span>
                <span>{pageName}</span>
            </div>
            <div className="navigation-bar-options-container">
                {
                    user.roles.includes('DOCTOR') || user.roles.includes('OWNER') ?
                    <div>
                        <button 
                        className="upgrade-btn"
                        onClick={e => navigate('/billing/packages')}
                        >
                            <StarBorderOutlinedIcon />
                            Upgrade to Plus
                        </button>
                    </div>
                    :
                    null
                }
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
    </div>
}

export default NavigationBar
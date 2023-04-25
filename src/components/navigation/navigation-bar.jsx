import './navigation-bar.css'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SettingsIcon from '@mui/icons-material/Settings'

const NavigationBar = () => {

    return <div className="navigation-bar-container">
        <div>
            Logo
        </div>
        <div className="navigation-bar-search-container">
            <input type="search" className="input-field" placeholder="Search..." />
        </div>
        <div className="navigation-bar-options-container">
            <button className="create-btn">
                Create
                <KeyboardArrowDownOutlinedIcon />
            </button>
            <div>
                <HelpOutlinedIcon />
                <span>Help</span>
            </div>
            <div>
                <NotificationsIcon />
            </div>
            <div>
                <SettingsIcon />
            </div>
            <div>
                <AccountCircleIcon />
            </div>
        </div>
    </div>
}

export default NavigationBar
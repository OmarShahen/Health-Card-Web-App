import { NavLink, Outlet } from "react-router-dom"
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../../components/sections/page-header'

const UserProfileLayoutPage = () => {

    return <div className="page-container">
        <NavigationBar pageName={'Settings - Profile'} />
        <div className="padded-container">
            <PageHeader pageName="Profile Settings" />
            <div className="mini-page-navigator-container">
                <ul>
                    <li><NavLink to={`/settings/profile`}>Details</NavLink></li>
                    <li><NavLink to={`/settings/password`}>Passwords</NavLink></li>
                    <li><NavLink to={`/settings/speciality`}>Speciality</NavLink></li>
                </ul>
            </div>
            <div className="margin-top-1"></div>
            <Outlet />
        </div>
    </div>
}

export default UserProfileLayoutPage
import './profile.css'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setIsLogged } from '../../../redux/slices/userSlice'


const UserProfileMenu = ({ user }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    return <div className="user-profile-menu-container">
        <div className="user-profile-menu-header-container">
            <span>Account</span>
        </div>
        <div className="user-profile-menu-img-container">
            <img src={`https://avatars.dicebear.com/api/initials/${user.firstName} ${user.lastName}.svg`} alt="profile-image" />
            <div className="span-text">
                <strong>{`${user.firstName} ${user.lastName}`}</strong>
                <br />
                <span className="grey-text">{user.email}</span>
            </div>
        </div>
        <div className="user-profile-list-container">
            <ul>
                <li onClick={e => navigate('/settings/profile')}>
                    <span>Profile</span>
                    <AccountBoxOutlinedIcon />
                </li>
                <li onClick={e => {
                    sessionStorage.setItem('user', null)
                    dispatch(setIsLogged(false))
                }}>
                    <span>Log out</span>
                    <LogoutOutlinedIcon />
                </li>
            </ul>
        </div>
    </div>
}

export default UserProfileMenu
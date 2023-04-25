import { ConstructionOutlined } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import { useSelector } from 'react-redux/es/exports'


const PrescriptionMobileNavBar = () => {

    const user = useSelector(state => state.user.user)
    const { firstName, lastName } = user

    return <div>
        <div className="prescriptions-page-header">
            <div>
                <MenuIcon />
            </div>
            <div className="profile-nav-bar-container">
                <img 
                src={`https://avatars.dicebear.com/api/initials/${firstName} ${lastName}.svg`} 
                />
                <div>
                    <strong>{`${firstName} ${lastName}`}</strong>
                    <span className="light-text-color small-description-text">أخصائي طب وجراحة المسالك البولية</span>
                </div>
            </div>
        </div>
    </div>
}

export default PrescriptionMobileNavBar
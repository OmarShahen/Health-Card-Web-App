import '../patient-medical.css'
import ChangePasswordForm from '../../components/forms/profile/change-password'
import { useSelector } from 'react-redux'

const PasswordPage = () => {

    const user = useSelector(state => state.user.user)

    return <div>
        { user ? <ChangePasswordForm /> : null }
    </div>
}

export default PasswordPage
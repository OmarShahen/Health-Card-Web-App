import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './signup.css'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setLang } from '../../redux/slices/langSlice'

const SignupFormLayout = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)

    useEffect(() => {
        if(Object.entries(user).length <= 2) {
            navigate('/signup')
        }
    }, [])

    return <div>
        <div className="language-container grey-text">
            <span onClick={e => dispatch(setLang('en'))}>English</span>
            <span onClick={e => dispatch(setLang('ar'))}>عربي</span>
        </div>
        <Outlet />
    </div>
}

export default SignupFormLayout
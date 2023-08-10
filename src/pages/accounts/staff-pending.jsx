import { useEffect  } from 'react'
import './account.css'
import PageTransition from '../../components/transitions/page-transitions'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../../redux/slices/userSlice'
import translations from '../../i18n'

const StaffPendingPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        serverRequest.get(`/v1/users/${user._id}`)
        .then(response => {
            let user = response.data.user
            user.accessToken = response.data.token
            if(user.clinicId) {
                sessionStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
                dispatch(setUser({ ...user, isLogged: true }))
                navigate('/patients')
            }
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    return <PageTransition>
    <div>
        <div className="pending-page-container">
            <div>
                <h3>{translations[lang]['Your account is created']} <span className="action-color-text">{translations[lang]['Successfully!']}</span></h3>
                { lang === 'en' ?
                    <p className="left body-text grey-text">
                    Your account is created successfully but it's not linked to
                    a clinic yet, on connection with the requested clinic<br /> you will be redirected
                    to your dashboard.
                </p>
                :
                <p className="right body-text grey-text">
                    تم انشاء حسابك بنجاح و لكن الحساب غير متصل بعيادة حتي الان, في حين الاتصال بلعيادة المختارة سيتم توجيهك الي لوحة التحكم
                </p>
                }
                <div className="center">
                    <button 
                    onClick={e => navigate('/signup/staffs/clinics')}
                    className="normal-button action-color-bg white-text"
                    >{translations[lang]['Choose another clinic']}</button>
                </div>
            </div>
        </div>
    </div>
    </PageTransition>
}

export default StaffPendingPage
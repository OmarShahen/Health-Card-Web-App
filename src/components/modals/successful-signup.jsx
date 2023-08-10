import './modals.css'
import './success-modal.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import successImage from '../../assets/confetti.png'
import { useSelector } from 'react-redux'
import CardTransition from '../transitions/card-transitions'
import Confetti from 'react-confetti'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'

const SuccessfulSignupModal = ({ setIsShowModal }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    return <CardTransition>
    <div className="modal">
        <Confetti
        width={window.innerWidth * 0.95}
        height={window.innerHeight}
        />
        <div className="modal-container body-text success-modal-container">
            <div className="success-modal-header">
                <h1 className="header-text">{translations[lang]['Welcome,']} {user.firstName + ' ' + user.lastName}!</h1>
                <img src={successImage} />
            </div>
            <div className="grey-text">
                { lang === 'en' ? `We are excited to have you on board and can't wait for you to get started.` : `نحن متحمسون لوجودك معنا و لانستطيع الانتظار حتي تبداء` }<br /> 
                Here's a quick guide to help you get up and running:
            </div>
            <div className="margin-top-1"></div>
            <div className="success-modal-list-container grey-text">
                <ul>
                    <li>
                        <CheckCircleIcon />
                        Explore our app and familiarize yourself with its features. We have 
                        designed our app to be intuitive and user-friendly, but if you have 
                        any questions or need help with anything, please don't hesitate to 
                        reach out to us.
                    </li>
                    <li>
                        <CheckCircleIcon />
                        Customize your profile and settings to your liking. This will help 
                        you get the most out of our app and tailor it to your specific 
                        needs and preferences.
                    </li>
                    <li>
                        <CheckCircleIcon />
                        Keep an eye out for updates and new features. We are constantly 
                        improving our app and adding new functionality to make it even 
                        better.
                    </li>
                </ul>
            </div>
            <div className="margin-top-1"></div>
            <div className="grey-text">
                Thank you for choosing our app, and we hope you enjoy using 
                it as much as we do. If you have any feedback or suggestions 
                for how we can improve, please let us know. We're here to make 
                your experience with our app as great as possible!
            </div>
            <div className="success-modal-button-container margin-top-1">
                <button 
                onClick={e => {
                    user.roles.includes('DOCTOR') ? navigate(`/clinics/owned?isNew=true`) : setIsShowModal(false)
                    setIsShowModal(false)
                }}
                className="normal-button action-color-bg white-text"
                >Let's get started !</button>
                <button
                onClick={e =>setIsShowModal(false)}
                className="normal-button cancel-button">Close</button>
            </div>
        </div>
    </div>
    </CardTransition>
}

export default SuccessfulSignupModal
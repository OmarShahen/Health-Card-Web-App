import { useEffect } from 'react'
import './support.css'
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../../components/sections/page-header'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import translations from '../../i18n'

const SupportPage = ({ roles }) => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        window.scrollTo(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    return <div className="support-page-container">
        <PageHeader pageName={translations[lang]['Support']} />
        <div className="support-page-text-container cards-grey-container body-text">
            <div>
                {
                    lang === 'en' ?
                <p>
                    Welcome to our Ra'aya support page!<br /><br /> We're here to help you get
                    the most out of our platform and ensure that you have a positive experience 
                    using our software.
                </p>
                :
                null
                } 
                { 
                    lang === 'en' ?        
                    <p>
                        If you have any questions or issues with our EHR system app, our customer support team is 
                        available to assist you.<br /> You can contact us via <strong> phone</strong>, 
                        <strong> email</strong>,
                        <strong> whatsapp</strong>, or 
                        <strong> telegram </strong>
                        and we'll do our best to respond to your inquiry as soon as possible.
                    </p>
                    :
                    null
                }
                { lang === 'ar' ? <br /> : null }
                <ul>
                    <li>
                        Phone <strong className="action-color-text">+201065630331</strong>
                    </li>
                    <li>
                        Email <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=omarredaelsayedmohamed@gmail.com"
                        target="_blank"
                        >
                            <strong className="action-color-text">raayahelp@gmail.com</strong>
                        </a>
                    </li>
                    <li>
                        Whatsapp <a 
                        href="https://wa.me/201065630331"
                        target="_blank"
                        >
                            <strong className="action-color-text">+201065630331</strong>
                        </a>
                    </li>
                    <li>
                        Telegram <a 
                        href="https://t.me/+201065630331"
                        target="_blank"
                        >
                            <strong className="action-color-text">+201065630331</strong>
                        </a>
                    </li>
                </ul>
                {
                    lang === 'en' ?
                    <p>
                        Thank you for choosing our EHR system app. We're committed to providing you with the 
                        best possible service and support,<br /> and we look forward to helping you succeed with our 
                        software.
                    </p>
                    :
                    null
                }
                { lang === 'ar' ? <br /> : null }
            </div>
        </div>
    </div>
}

export default SupportPage
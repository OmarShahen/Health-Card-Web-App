import './support.css'
import NavigationBar from '../../components/navigation/navigation-bar'
import PageHeader from '../../components/sections/page-header'

const SupportPage = () => {

    return <div className="support-page-container">
        <NavigationBar />
        <PageHeader pageName={'Support'} />
        <div className="support-page-text-container cards-grey-container">
            <p>
                Welcome to our EHR system app's support page!<br /> We're here to help you get
                the most out of our platform and ensure that you have a positive experience 
                using our software.
            </p>
            <p>
                If you have any questions or issues with our EHR system app, our customer support team is available to assist you.<br /> You can contact us via phone, email,
                or live chat, and we'll do our best to respond to your inquiry as soon as possible.
            </p>
            <p>
                Thank you for choosing our EHR system app. We're committed to providing you with the 
                best possible service and support,<br /> and we look forward to helping you succeed with our 
                software.
            </p>
        </div>
    </div>
}

export default SupportPage
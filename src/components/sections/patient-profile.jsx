import { useState } from 'react'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import SmokingRoomsOutlinedIcon from '@mui/icons-material/SmokingRoomsOutlined'
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined'
import MacroOffOutlinedIcon from '@mui/icons-material/MacroOffOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import { getAge } from '../../utils/age-calculator'
import { capitalizeFirstLetter } from '../../utils/formatString'
import translations from '../../i18n'
import { useSelector } from 'react-redux'


const PatientProfileSection = ({ patient }) => {

    const lang = useSelector(state => state.lang.lang)

    const [demographic, setDemographic] = useState(true)
    const [emergencyContacts, setEmergencyContacts] = useState(true)
    const [badHabits, setBadHabits] = useState(true)
    const [chronicDiseases, setChronicDiseases] = useState(true)
    const [geneticIssue, setGeneticIssue] = useState(true)
    const [blood, setBlood] = useState(true)
    const [allergy, setAllergy] = useState(true)
    const [immune, setImmune] = useState(true)
    const [surgery, setSurgery] = useState(true)

    const formatValue = (value) => {

        if(typeof value !== 'boolean') {
            return 'Not Registered'
        } else if(value === true) {
            return 'Yes'
        } else if(value === false) {
            return 'No'
        }
    }

    return <div>

    <div className="cards-grey-container">
        <div className="information-list-container" id="demographic-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Personal Information']}
                    </h2>
                    <span className="icon-container pending">
                        <Person2OutlinedIcon />
                    </span>
                </div>
            </div>
            {
                demographic ?
                <ul className="body-text">
                <li>
                    <div className="bold-text">
                        {translations[lang]['Name']}
                    </div>
                    <div>
                        {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Card ID']}
                    </div>
                    <div>
                        {patient.cardId ? `#${patient.cardId}` : translations[lang]['Not Registered']}
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Phone']}
                    </div>
                    <div>
                    {patient.countryCode && patient.phone ? `+${patient.countryCode}${patient.phone}` : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['City']}
                    </div>
                    <div>
                        { patient.city ? translations[lang][capitalizeFirstLetter(patient.city)] : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Gender']}
                    </div>
                    <div>
                        { patient.gender ? translations[lang][capitalizeFirstLetter(patient.gender)] : translations[lang]['Not Registered'] }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Social Status']}
                    </div>
                    <div>
                        {patient.socialStatus ? translations[lang][capitalizeFirstLetter(patient.socialStatus)] : translations[lang]['Not Registered']}
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        {translations[lang]['Age']}
                    </div>
                    <div>
                        {patient.dateOfBirth ? getAge(patient.dateOfBirth) : translations[lang]['Not Registered']}
                    </div>
                </li>
                </ul>
                :
                null
            }
            
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="bad-habits-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Bad Habits']}
                    </h2>
                    <span className="icon-container pending">
                        <SmokingRoomsOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                badHabits ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Current Smoker']}
                        </div>
                        <div>
                            {translations[lang][formatValue(patient?.healthHistory?.isSmokingPresent)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Past Smoker']}
                        </div>
                        <div>
                            {translations[lang][formatValue(patient?.healthHistory?.isSmokingPast)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Current Alcoholic']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isAlcoholPresent)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Past Alcoholic']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isAlcoholPast)]}
                        </div>
                    </li>
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="chronic-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Chronic Diseases']}
                    </h2>
                    <span className="icon-container done">
                        <ElderlyOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                chronicDiseases ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['High Pressure']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isHighBloodPressure)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Diabetes']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isDiabetic)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Heart Diseases']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isChronicHeart)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Neurological Diseases']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isChronicNeurological)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Liver Diseases']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isChronicLiver)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Kidney Diseases']}
                        </div>
                        <div>
                            {translations[lang][formatValue(patient?.healthHistory?.isChronicKidney)]}
                        </div>
                    </li>
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="genetic-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Genetic Diseases']}
                    </h2>
                    <span className="icon-container pending">
                        <CoronavirusOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                geneticIssue ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Cancer in Family']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isCancerFamily)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                        {translations[lang]['Genetic Issue']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isGeneticIssue)]}
                        </div>
                    </li>
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="blood-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Blood']}
                    </h2>
                    <span className="icon-container declined">
                        <BloodtypeOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                blood ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Blood Group']}
                        </div>
                        <div>
                            { patient?.bloodGroup ? patient.bloodGroup : translations[lang]['Not Registered'] }
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                        {translations[lang]['Blood Transfusion']}
                        </div>
                        <div>
                            {translations[lang][formatValue(patient?.healthHistory?.isBloodTransfusion)]}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Blood Diseases']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isBloodDiseases)]}
                        </div>
                    </li>
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="allergies-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Allergies']}
                    </h2>
                    <span className="icon-container done">
                        <MacroOffOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                allergy ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Allergic']}
                        </div>
                        <div>
                            {translations[lang][formatValue(patient?.healthHistory?.isAllergic)]}
                        </div>
                    </li>
                    {
                        patient?.healthHistory?.allergies && patient?.healthHistory?.allergies.length !== 0 ?
                        <li className="nested-list">
                            <div className="bold-text">
                            {translations[lang]['Allergies']}  
                            </div>
                            <div className="codes-container">
                                {
                                    patient?.healthHistory.allergies.map(allergy => <span className="status-btn grey-bg">
                                        {allergy}
                                    </span>)
                                }
                            </div>
                        </li>
                        :
                        null

                    }
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container">
        <div className="information-list-container" id="immune-section">
            <div className="information-list-header">
                <div className="header-and-icon-container">
                    <h2 className="subheader-text">
                        {translations[lang]['Immune Diseases']}
                    </h2>
                    <span className="icon-container declined">
                        <HealthAndSafetyOutlinedIcon />
                    </span>
                </div>
            </div>
            {
                immune ?
                <ul className="body-text">
                    <li>
                        <div className="bold-text">
                            {translations[lang]['Immune Diseases']}
                        </div>
                        <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isImmuneDiseases)]}
                        </div>
                    </li>
                </ul>
                :
                null
            }
        </div>
    </div>

    <br />

    <div className="cards-grey-container" id="surgery-section">
        <div className="information-list-container">
        <div className="information-list-header">
            <div className="header-and-icon-container">
                <h2 className="subheader-text">
                    {translations[lang]['Past Surgery']}
                </h2>
                <span className="icon-container pending">
                    <VaccinesOutlinedIcon />
                </span>
            </div>
        </div>
        {
            surgery ?
            <ul className="body-text">
                <li>
                    <div className="bold-text">
                        {translations[lang]['Hospital Confined']}
                    </div>
                    <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isHospitalConfined)]}
                    </div>
                </li>
                {
                    patient.healthHistory.hospitalConfinedReason.length !== 0 ?
                    <li className="nested-list">
                        <div className="bold-text">
                            {translations[lang]['Confine Reason']}
                        </div>
                        <div className="codes-container">
                            {
                                patient.healthHistory.hospitalConfinedReason.map(reason => <span className="status-btn grey-bg">
                                    {reason}
                                </span>)
                            }
                        </div>
                    </li>
                    :
                    null
                }
                
                <li>
                    <div className="bold-text">
                        {translations[lang]['Past Surgery']}
                    </div>
                    <div>
                        {translations[lang][formatValue(patient?.healthHistory?.isSurgicalOperations)]}
                    </div>
                </li>
                {
                    patient?.healthHistory?.surgicalOperationsReason.length !== 0 ?
                    <li className="nested-list">
                        <div className="bold-text">
                            {translations[lang]['Surgeries']} 
                        </div>
                        <div className="codes-container">
                            { patient?.healthHistory?.surgicalOperationsReason.map(reason => <span className="status-btn grey-bg">
                                {reason}
                            </span>) }
                        </div>
                    </li>
                    :
                    null
                }
            </ul>
            :
            null
        }
        </div>
    </div>
</div>
}

export default PatientProfileSection
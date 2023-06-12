import { useState } from 'react'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import SmokingRoomsOutlinedIcon from '@mui/icons-material/SmokingRoomsOutlined'
import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined'
import MacroOffOutlinedIcon from '@mui/icons-material/MacroOffOutlined'
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined'
import VaccinesOutlinedIcon from '@mui/icons-material/VaccinesOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { getAge } from '../../utils/age-calculator'

const PatientProfileSection = ({ patient }) => {

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
                        Personal Information
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
                        Name
                    </div>
                    <div>
                        {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : 'Not Registered' }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        Card ID
                    </div>
                    <div>
                        #{patient.cardId}
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        Phone
                    </div>
                    <div>
                    {patient.countryCode && patient.phone ? `+${patient.countryCode}${patient.phone}` : 'Not Registered' }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        City
                    </div>
                    <div>
                        { patient.city ? patient.city : 'Not Registered' }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        Gender
                    </div>
                    <div>
                        { patient.gender ? patient.gender : 'Not Registered' }
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        Social Status
                    </div>
                    <div>
                        {patient.socialStatus ? patient.socialStatus : 'Not Registered'}
                    </div>
                </li>
                <li>
                    <div className="bold-text">
                        Age
                    </div>
                    <div>
                        {patient.dateOfBirth ? getAge(patient.dateOfBirth) : 'Not Registered'}
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
                        Bad Habits
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
                            Current Smoker
                        </div>
                        <div>
                            {formatValue(patient?.healthHistory?.isSmokingPresent)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Past Smoker
                        </div>
                        <div>
                            {formatValue(patient?.healthHistory?.isSmokingPast)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Current Alcoholic
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isAlcoholPresent)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Past Alcoholic
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isAlcoholPast)}
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
                        Chronic Diseases
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
                            High Pressure
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isHighBloodPressure)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Diabetes
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isDiabetic)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Heart Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isChronicHeart)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Neurological Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isChronicNeurological)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Liver Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isChronicLiver)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Kidney Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isChronicKidney)}
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
                        Genetic Diseases
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
                            Cancer in Family
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isCancerFamily)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                        Genetic Issue
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isGeneticIssue)}
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
                        Blood
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
                            Blood Group
                        </div>
                        <div>
                            { patient?.bloodGroup ? patient.bloodGroup : 'Not Registered' }
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                        Blood Transfusion
                        </div>
                        <div>
                            {formatValue(patient?.healthHistory?.isBloodTransfusion)}
                        </div>
                    </li>
                    <li>
                        <div className="bold-text">
                            Blood Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isBloodDiseases)}
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
                        Allergies
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
                            Allergic
                        </div>
                        <div>
                            {formatValue(patient?.healthHistory?.isAllergic)}
                        </div>
                    </li>
                    {
                        patient?.healthHistory?.allergies && patient?.healthHistory?.allergies.length !== 0 ?
                        <li className="nested-list">
                            <div className="bold-text">
                            Allergies  
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
                        Immune Diseases
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
                            Immune Diseases
                        </div>
                        <div>
                        {formatValue(patient?.healthHistory?.isImmuneDiseases)}
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
                    Past Surgery
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
                        Hospital Confined
                    </div>
                    <div>
                        {formatValue(patient?.healthHistory?.isHospitalConfined)}
                    </div>
                </li>
                {
                    patient?.healthHistory?.isHospitalConfined && patient.healthHistory.hospitalConfinedReason.length !== 0 ?
                    <li className="nested-list">
                        <div className="bold-text">
                            Confine Reason  
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
                        Past Surgery
                    </div>
                    <div>
                    {formatValue(patient?.healthHistory?.isSurgicalOperations)}
                    </div>
                </li>
                {
                    patient?.healthHistory?.isSurgicalOperations && patient?.healthHistory?.surgicalOperationsReason.length !== 0 ?
                    <li className="nested-list">
                        <div className="bold-text">
                            Surgeries  
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
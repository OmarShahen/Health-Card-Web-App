import { useState, useEffect } from "react"
import './patients.css'
import PatientPersonalInformationForm from "../components/forms/patients/personal-info"
import PatientBadHabitsForm from "../components/forms/patients/bad-habits"
import PatientChronicDiseasesForm from "../components/forms/patients/chronic-diseases"
import PatientGeneticDiseasesForm from "../components/forms/patients/genetic-diseases"
import PatientBloodGroupForm from "../components/forms/patients/blood-group"
import PatientAllergiesForm from "../components/forms/patients/allergies"
import PatientImmuneDiseasesForm from "../components/forms/patients/immune-diseases"
import PatientSurgeryForm from "../components/forms/patients/surgery"
import { TailSpin } from "react-loader-spinner"
import { serverRequest } from "../components/API/request"
import { toast } from "react-hot-toast"
import { getBirthYearByAge } from "../utils/age-calculator"
import PageHeader from "../components/sections/page-header"
import NavigationBar from '../components/navigation/navigation-bar'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux"
import { isRolesValid } from "../utils/roles"
import { setIsShowModal } from "../redux/slices/modalSlice"
import PatientCardInformationForm from "../components/forms/patients/card-info"
import translations from "../i18n"

const PatientFormPage = ({ roles }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [clinics, setClinics] = useState([])
    const [isSubmit, setIsSubmit] = useState(false)

    const [clinic, setClinic] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [countryCode, setCountryCode] = useState(20)
    const [phone, setPhone] = useState()
    const [gender, setGender] = useState()
    const [socialStatus, setSocialStatus] = useState()
    const [age, setAge] = useState()
    const [city, setCity] = useState()
    const [cardId, setCardId] = useState()
    const [cvc, setCvc] = useState()

    const [isSmokingPast, setIsSmokingPast] = useState()
    const [isSmokingPresent, setIsSmokingPresent] = useState()
    const [isAlcoholPast, setIsAlcoholPast] = useState()
    const [isAlcoholPresent, setIsAlcoholPresent] = useState()

    const [isHighBloodPressure, setIsHighBloodPressure] = useState()
    const [isDiabetic, setIsDiabetic] = useState()
    const [isChronicHeart, setIsChronicHeart] = useState()
    const [isChronicNeurological, setIsChronicNeurological] = useState()
    const [isChronicLiver, setIsChronicLiver] = useState()
    const [isChronicKidney, setIsChronicKidney] = useState()

    const [isCancerFamily, setIsCancerFamily] = useState()
    const [isGeneticIssue, setIsGeneticIssue] = useState()

    const [bloodGroup, setBloodGroup] = useState()
    const [isBloodDiseases, setIsBloodDiseases] = useState()
    const [isBloodTransfusion, setIsBloodTransfusion] = useState()

    const [isAllergic, setIsAllergic] = useState()
    const [allergies, setAllergies] = useState([])

    const [isImmuneDiseases, setIsImmuneDiseases] = useState()

    const [isSurgicalOperations, setIsSurgicalOperations] = useState()
    const [surgicalOperationsReason, setSurgicalOperationsReason] = useState([])
    const [isHospitalConfined, setIsHospitalConfined] = useState()
    const [hospitalConfinedReason, setHospitalConfinedReason] = useState([])

    const [clinicError, setClinicError] = useState()
    const [firstNameError, setFirstNameError] = useState()
    const [lastNameError, setLastNameError] = useState()
    const [countryCodeError, setCountryCodeError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [genderError, setGenderError] = useState()
    const [socialStatusError, setSocialStatusError] = useState()
    const [ageError, setAgeError] = useState()
    const [cityError, setCityError] = useState()
    const [cardIdError, setCardIdError] = useState()
    const [cvcError, setCvcError] = useState()

    useEffect(() => {

        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')

        if(user.roles.includes('STAFF')) {
            return
        }

        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            const data = response.data
            setClinics(data.clinics)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })

    }, [])

    const handleSubmit = () => {

        if(!firstName) {
            toast.error(translations[lang]['first name is required'], { duration: 3000, position: 'top-right' })
            return setFirstNameError(translations[lang]['first name is required'])
        }

        if(!lastName) { 
            toast.error(translations[lang]['last name is required'], { duration: 3000, position: 'top-right' })
            return setLastNameError(translations[lang]['last name is required'])
        }

        if(!countryCode) { 
            toast.error(translations[lang]['country code is required'], { duration: 3000, position: 'top-right' })
            return setCountryCodeError(translations[lang]['country code is required'])
        }

        if(!phone) { 
            toast.error(translations[lang]['phone is required'], { duration: 3000, position: 'top-right' })
            return setPhoneError(translations[lang]['phone is required'])
        }

        if(!gender) { 
            toast.error(translations[lang]['gender is required'], { duration: 3000, position: 'top-right' })
            return setGenderError(translations[lang]['gender is required'])
        }

        if(!age) { 
            toast.error(translations[lang]['age is required'], { duration: 3000, position: 'top-right' })
            return setAgeError(translations[lang]['age is required'])
        }

        if(!cardId) { 
            toast.error(translations[lang]['card ID is required'], { duration: 3000, position: 'top-right' })
            return setCardIdError(translations[lang]['card ID is required'])
        }

        if(!cvc) {
            toast.error(translations[lang]['CVC is required'], { duration: 3000, position: 'top-right' })
            return setCvcError(translations[lang]['CVC is required'])
        }

        const patientData = {
            firstName,
            lastName,
            countryCode: Number.parseInt(countryCode),
            phone: Number.parseInt(phone),
            gender,
            socialStatus,
            dateOfBirth: String(getBirthYearByAge(age)),
            city,
            bloodGroup,
            cardId: Number.parseInt(cardId),
            cvc: Number.parseInt(cvc),
            healthHistory: {
                isSmokingPast,
                isSmokingPresent,
                isAlcoholPast,
                isAlcoholPresent,
                isHighBloodPressure,
                isDiabetic,
                isChronicHeart,
                isChronicNeurological,
                isChronicLiver,
                isChronicKidney,
                isCancerFamily,
                isGeneticIssue,
                isBloodDiseases,
                isBloodTransfusion,
                isAllergic,
                allergies,
                isImmuneDiseases,
                isSurgicalOperations,
                surgicalOperationsReason,
                isHospitalConfined,
                hospitalConfinedReason
            }
        }

        if(user.roles.includes('STAFF')) {
            patientData.clinicId = user.clinicId
        }

        if(user.roles.includes('DOCTOR')) {
            patientData.doctorId = user._id
            patientData.clinicId = clinic
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/patients`, patientData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            navigate(`/patients/${data.patient._id}/medical-profile`)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            if(error.response.data.field === 'mode') return dispatch(setIsShowModal(true)) 

            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }


    return <div>
        <NavigationBar pageName={translations[lang]["Patients"]} />
        <PageHeader pageName={translations[lang]['Create Patient']} />
            <div className="patient-profile-grid-container">
                <div className="patient-profile-page-navigator-container">
                    <ul>
                        <li>
                            <a href="#demographic-section">
                                {translations[lang]['Personal Information']}
                            </a>
                        </li>
                        <li>
                            <a href="#card-section">
                                {translations[lang]['Card Information']}
                            </a>
                        </li>
                        <li>
                            <a href="#bad-habits-section">
                                {translations[lang]['Bad Habits']}
                            </a>
                        </li>
                        <li>
                            <a href="#chronic-section">
                                {translations[lang]['Chronic Diseases']}
                            </a>
                        </li>
                        <li>
                            <a href="#genetic-section">
                                {translations[lang]['Genetic Issue']}
                            </a>
                        </li>
                        <li>
                            <a href="#blood-section">
                                {translations[lang]['Blood']}
                            </a>
                        </li>
                        <li>
                            <a href="#allergies-section">
                                {translations[lang]['Allergies']}
                            </a>
                        </li>
                        <li>
                            <a href="#immune-section">
                                {translations[lang]['Immune Diseases']}
                            </a>
                        </li>
                        <li>
                            <a href="#surgery-section">
                                {translations[lang]['Past Surgeries']}
                            </a>
                        </li>
                        <li>
                            <a href="#submit-section">
                                {translations[lang]['Submit']}
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <div className="cards-grey-container">
                        <PatientPersonalInformationForm
                        clinics={clinics}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        countryCode={countryCode}
                        setCountryCode={setCountryCode}
                        phone={phone}
                        setPhone={setPhone}
                        gender={gender}
                        setGender={setGender}
                        socialStatus={socialStatus}
                        setSocialStatus={setSocialStatus}
                        age={age}
                        setAge={setAge}
                        city={city}
                        setCity={setCity}
                        setClinic={setClinic}

                        firstNameError={firstNameError}
                        setFirstNameError={setFirstNameError}
                        lastNameError={lastNameError}
                        setLastNameError={setLastNameError}
                        countryCodeError={countryCodeError}
                        setCountryCodeError={setCountryCodeError}
                        phoneError={phoneError}
                        setPhoneError={setPhoneError}
                        genderError={genderError}
                        setGenderError={setGenderError}
                        socialStatusError={socialStatusError}
                        setSocialStatusError={setSocialStatusError}
                        ageError={ageError}
                        setAgeError={setAgeError}
                        cityError={cityError}
                        setCityError={setCityError}
                        clinicError={clinicError}
                        setClinicError={setClinicError}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientCardInformationForm 
                        cardId={cardId}
                        setCardId={setCardId}
                        cardIdError={cardIdError}
                        setCardIdError={setCardIdError}
                        cvc={cvc}
                        setCvc={setCvc}
                        cvcError={cvcError}
                        setCvcError={setCvcError}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientBadHabitsForm
                        isSmokingPast={isSmokingPast}
                        setIsSmokingPast={setIsSmokingPast}
                        isSmokingPresent={isSmokingPresent}
                        setIsSmokingPresent={setIsSmokingPresent}

                        isAlcoholPast={isAlcoholPast}
                        setIsAlcoholPast={setIsAlcoholPast}
                        isAlcoholPresent={isAlcoholPresent}
                        setIsAlcoholPresent={setIsAlcoholPresent}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientChronicDiseasesForm
                        isHighBloodPressure={isHighBloodPressure}
                        setIsHighBloodPressure={setIsHighBloodPressure}
                        isDiabetic={isDiabetic}
                        setIsDiabetic={setIsDiabetic}
                        isChronicHeart={isChronicHeart}
                        setIsChronicHeart={setIsChronicHeart}
                        isChronicNeurological={isChronicNeurological}
                        setIsChronicNeurological={setIsChronicNeurological}
                        isChronicLiver={isChronicLiver}
                        setIsChronicLiver={setIsChronicLiver}
                        isChronicKidney={isChronicKidney}
                        setIsChronicKidney={setIsChronicKidney}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientGeneticDiseasesForm
                        isCancerFamily={isCancerFamily}
                        setIsCancerFamily={setIsCancerFamily}
                        isGeneticIssue={isGeneticIssue}
                        setIsGeneticIssue={setIsGeneticIssue}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientBloodGroupForm
                        setBloodGroup={setBloodGroup}
                        setIsBloodDiseases={setIsBloodDiseases}
                        setIsBloodTransfusion={setIsBloodTransfusion}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientAllergiesForm
                        setIsAllergic={setIsAllergic}
                        allergies={allergies}
                        setAllergies={setAllergies}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientImmuneDiseasesForm
                        setIsImmuneDiseases={setIsImmuneDiseases}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="cards-grey-container">
                        <PatientSurgeryForm
                        setIsSurgicalOperations={setIsSurgicalOperations}
                        setSurgicalOperationsReason={setSurgicalOperationsReason}
                        surgicalOperationsReason={surgicalOperationsReason}
                        setIsHospitalConfined={setIsHospitalConfined}
                        setHospitalConfinedReason={setHospitalConfinedReason}
                        hospitalConfinedReason={hospitalConfinedReason}
                        />
                    </div>
                    <div className="margin-top-1"></div>
                    <div className="form-buttons-container" id="submit-section">
                        {
                            isSubmit ?
                            <TailSpin width="25" height="25" color="#4c83ee" />
                            :
                            <button 
                            form="patient-form"
                            onClick={e => handleSubmit()}
                            className="normal-button white-text action-color-bg"
                            >{translations[lang]['Create']}</button>
                        }
                        <button 
                        className="normal-button cancel-button"
                        onClick={e => {
                            setShowModalForm(false)
                        }}
                        >{translations[lang]['Close']}</button>
                        </div>
                        <div className="margin-top-1"></div>
                </div>
            </div>        
            </div>
}

export default PatientFormPage
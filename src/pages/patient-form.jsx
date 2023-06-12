import { useState, useEffect } from "react"
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
import { useSelector } from "react-redux"

const PatientFormPage = () => {

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)

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

    useEffect(() => {

        if(user.role === 'STAFF') {
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

        if(!firstName) return setFirstNameError('first name is required')

        if(!lastName) return setLastNameError('last name is required')

        if(!countryCode) return setCountryCodeError('country code is required')

        if(!phone) return setPhoneError('phone is required')

        if(!gender) return setGenderError('gender is required')

        if(!cardId) return setCardIdError('card Id is required')

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

        if(user.role === 'STAFF') {
            patientData.clinicId = user.clinicId
        }

        if(user.role === 'DOCTOR') {
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
            toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })
        })
    }


    return <div>
        <NavigationBar pageName="patinets Form" />
        <PageHeader pageName={'Create Patient'} />
        <div className="">
            <div>

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
            cardId={cardId}
            setCardId={setCardId}
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
            cardIdError={cardIdError}
            setCardIdError={setCardIdError}
            clinicError={clinicError}
            setClinicError={setClinicError}
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
                <div className="form-buttons-container">
                            {
                                isSubmit ?
                                <TailSpin width="25" height="25" color="#4c83ee" />
                                :
                                <button 
                                form="patient-form"
                                onClick={e => handleSubmit()}
                                className="normal-button white-text action-color-bg"
                                >Create</button>
                            }
                            <button 
                            className="normal-button cancel-button"
                            onClick={e => {
                                setShowModalForm(false)
                            }}
                            >Close</button>
                    </div>
                    <div className="margin-top-1"></div>
            </div>
        </div>
        
    </div>
}

export default PatientFormPage
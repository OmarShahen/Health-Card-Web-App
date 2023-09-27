import { useState, useEffect } from "react"
import { serverRequest } from '../../components/API/request'
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import format from "date-fns/format"
import { cities } from '../../utils/cities'
import CancelIcon from '@mui/icons-material/Cancel'
import { isRolesValid } from "../../utils/roles"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import translations from "../../i18n"
import { capitalizeFirstLetter } from "../../utils/formatString"

const ClinicProfilePage = ({ roles }) => {

    const pagePath = window.location.pathname
    const clinicId = pagePath.split('/')[2]

    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const [country, setCountry] = useState()
    const [city, setCity] = useState()
    const [creationDate, setCreationDate] = useState()
    const [speciality, setSpeciality] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState([])

    const [nameError, setNameError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [countryError, setCountryError] = useState()
    const [cityError, setCityError] = useState()
    const [specialityError, setSpecialityError] = useState([])

    useEffect(() => {
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpeciality(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/clinics/${clinicId}`)
        .then(response => {
            const data = response.data
            const clinic = data.clinic
            setName(clinic.name)
            setPhone(clinic.phone ? `0${clinic.phone}` : '')
            setChosenSpecialities(clinic.specialities)
            setCity(clinic.city)
            setCountry(clinic.country)
            setCreationDate(clinic.createdAt)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const handleUpdate = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!phone) return setPhoneError(translations[lang]['phone is required'])

        if(isNaN(phone)) return setPhoneError(translations[lang]['phone number must be entered'])
        
        if(!city) return setCityError(translations[lang]['city is required'])

        if(chosenSpecialities.length === 0) return setSpecialityError(translations[lang]['one speciality is required'])

        const updatedData = { 
            name,
            phone: parseInt(phone),
            countryCode: 20,
            city,
            country,
            speciality: chosenSpecialities.map(special => special._id),
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/clinics/${clinicId}`, updatedData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'name') return setNameError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'city') return setCityError(errorResponse.message)
            
                if(errorResponse.field === 'speciality') return setSpecialityError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }

    const addSpeciality = (value) => {
        for(let i=0;i<chosenSpecialities.length;i++) {
            if(value === chosenSpecialities[i].name) {
                return
            }
        }
        const chosenSpeciality = speciality.filter(special => special.name === value)
        setChosenSpecialities([...chosenSpecialities, chosenSpeciality[0]])
    }

    return <div className="profile-form-container">
        <div className="">
            <form id="profile-form" className="cards-2-list-wrapper body-text">
                <div>
                    <label>{translations[lang]['Name']}</label>
                    <div className="form-input-button-container">
                        <input 
                        type="text" 
                        className="form-input" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onClick={e => setNameError()}
                        />
                    </div>
                    <span className="red">{nameError}</span>
                </div>
                <div>
                    <label>{translations[lang]['Phone']}</label>
                    <div className="form-input-button-container">
                        <input 
                        type="tel" 
                        className="form-input" 
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        onClick={e => setPhoneError()}
                        />
                    </div>
                    <span className="red">{phoneError}</span>
                </div>
                <div>
                    <label>{translations[lang]['City']}</label>
                    <div className="form-input-button-container">
                        <select 
                        name="city" 
                        id="city"
                        onChange={e => setCity(e.target.value)}
                        onClick={e => setCityError()}
                        className="form-input"
                        >
                            {cities.map(cityTemp => {
                                if(cityTemp === city) {
                                    return <option value={cityTemp} selected>{translations[lang][capitalizeFirstLetter(city)]}</option>
                                }
                                return <option value={cityTemp}>{translations[lang][capitalizeFirstLetter(cityTemp)]}</option>
                            })}
                        </select>
                    </div>
                    <span className="red">{cityError}</span>
                </div>
                <div>
                    <label>{translations[lang]['Country']}</label>
                    <div className="form-input-button-container">
                        <input type="text" className="form-input" value={country} disabled />
                    </div>
                    <span className="red">{countryError}</span>
                </div>
                <div className="form-input-button-container">
                    <div>
                        <label>{translations[lang]['Speciality']}</label>
                        <select 
                        onChange={e => addSpeciality(e.target.value)}
                        onClick={e => setSpecialityError()}
                        className="form-input"
                        >
                            <option selected disabled>{translations[lang]['Select Specialities']}</option>
                            {speciality.map(special => <option value={special.name}>{special.name}</option>)}
                        </select>
                        <div className="drug-instruction-list-container">
                            {chosenSpecialities.map(special => <span className="status-btn pending">
                                {special.name}
                                <span 
                                onClick={e => setChosenSpecialities(chosenSpecialities.filter(chosenSpecial=> special._id !== chosenSpecial._id))}>
                                    <CancelIcon />
                                </span>
                                </span>)}
                        </div>
                        <span className="red">{specialityError}</span>
                    </div>
                </div>
                <div>
                    <label>{translations[lang]['Creation Date']}</label>
                    <div className="form-input-button-container">
                        <input 
                        type="text" 
                        className="form-input" 
                        value={creationDate ? format(new Date(creationDate), 'dd MMM yyyy') : null}
                        disabled
                        />
                    </div>
                </div>
                <div>
                    {
                        isSubmit ?
                        <TailSpin width="30" height="30" color="#22D172" />
                        :
                        <button onClick={handleUpdate} className="update-btn">
                            {translations[lang]['Update']}
                        </button>
                    }
                </div>
                
            </form>
        </div>
    </div>
}

export default ClinicProfilePage
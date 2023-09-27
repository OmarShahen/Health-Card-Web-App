import { useEffect, useState } from 'react'
import './modals.css'
import { serverRequest } from '../API/request'
import { useSelector, useDispatch } from 'react-redux'
import CancelIcon from '@mui/icons-material/Cancel'
import CircularLoading from '../loadings/circular'
import PageTransition from '../transitions/page-transitions'
import { cities } from '../../utils/cities'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { setUser } from '../../redux/slices/userSlice'
import { capitalizeFirstLetter } from '../../utils/formatString'
import CloseIcon from '@mui/icons-material/Close'
import { setMode } from '../../redux/slices/userSlice'
import translations from '../../i18n'

const ClinicFormModal = ({ setShowFormModal, setReload, reload, setIsShowServiceModal, setClinicId }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmit, setIsSubmit] = useState(false)

    const [name, setName] = useState()
    const [phone, setPhone] = useState()
    const [city, setCity] = useState()
    const [specialities, setSpecialities] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState([])


    const [nameError, setNameError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [cityError, setCityError] = useState()
    const [specialitiesError, setSpecialitiesError] = useState()

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get('/v1/specialities')
        .then(response => {
            setIsLoading(false)
            setSpecialities(response.data.specialities)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError(translations[lang]['name is required'])

        if(!phone) return setPhoneError(translations[lang]['phone is required'])

        if(isNaN(phone)) return setPhoneError(translations[lang]['phone number must be entered'])

        if(!city) return setCityError(translations[lang]['city is required'])

        if(chosenSpecialities.length === 0) return setSpecialitiesError(translations[lang]['specialities is required'])
        
        const clinicInfo = {
            ownerId: user._id,
            name,
            phone: Number.parseInt(phone),
            countryCode: 20,
            speciality: chosenSpecialities.map(speciality => speciality._id),
            city,
            country: 'EGYPT'
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/clinics`, clinicInfo)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            setClinicId(data.clinic._id)
            toast.success(data.message, { duration: 3000, position: 'top-right' })
            if(!user.roles.includes('OWNER')) {
                sessionStorage.setItem('user', JSON.stringify({ ...user, roles: [ ...user.roles, 'OWNER' ] }))
                dispatch(setUser({ ...user, roles: [ ...user.roles, 'OWNER' ] }))
            }

            if(data.clinic.mode === 'TEST') {
                dispatch(setMode('TEST'))
            }

            setReload(reload + 1)
            setShowFormModal(false)
            setIsShowServiceModal(true)

        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            const errorData = error.response.data

            if(errorData.field === 'name') return setNameError(errorData.message)

            if(errorData.field === 'phone') return setPhoneError(errorData.message)

            if(errorData.field === 'specialities') return setSpecialitiesError(errorData.message)

            if(errorData.field === 'city') return setCityError(errorData.message)

            toast.error(errorData.message, { position: 'top-right', duration: 3000 })

        })
    }

    const addSpeciality = (value) => {
        for(let i=0;i<chosenSpecialities.length;i++) {
            if(value === chosenSpecialities[i].name) {
                return
            }
        }
        const chosenSpeciality = specialities.filter(special => special.name === value)
        setChosenSpecialities([...chosenSpecialities, chosenSpeciality[0]])
    }

    return <PageTransition>
    <div className="modal">
            <div className="modal-container body-text">
                <div className="modal-header">
                    <h2>{translations[lang]['Create Clinic']}</h2>
                    <span className="hover" onClick={e => setShowFormModal(false)}>
                        <CloseIcon />
                    </span>
                </div>
                { 
                    isLoading ?
                    <CircularLoading />
                    :
                    <div>
                        <div className="modal-body-container">
                            <form 
                            id="clinic-form" 
                            className="modal-form-container responsive-form body-text" 
                            onSubmit={handleSubmit}
                            >
                                <div className="form-input-container">
                                    <label>{translations[lang]['Name']}</label>
                                    <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder=""
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onClick={e => setNameError()}
                                    />
                                    <span className="red">{nameError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>{translations[lang]['Phone']}</label>
                                    <input 
                                    type="tel" 
                                    className="form-input" 
                                    placeholder=""
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    onClick={e => setPhoneError()}
                                    />
                                    <span className="red">{phoneError}</span>
                                </div>
                                <div className="form-input-container">
                                    <label>{translations[lang]['Country']}</label>
                                    <input type="text" className="form-input" value={translations[lang]["Egypt"]} disabled />
                                        
                                </div>  
                                <div className="form-input-container">
                                    <label>{translations[lang]['City']}</label>
                                    <select
                                    className="form-input"
                                    onChange={e => setCity(e.target.value)}
                                    onClick={e => setCityError()}
                                    >
                                        <option selected disabled>{translations[lang]['Select City']}</option>
                                        {cities.map(city => <option value={city}>{translations[lang][capitalizeFirstLetter(city)]}</option>)}
                                    </select>
                                    <span className="red">{cityError}</span>
                                </div>  
                                <div className="form-input-container">
                                    <label>{translations[lang]['Speciality']}</label>
                                    <select
                                    className="form-input"
                                    onChange={e => addSpeciality(e.target.value)}
                                    onClick={e => setSpecialitiesError()}
                                    >
                                        <option selected disabled>{translations[lang]['Select Speciality']}</option>
                                        {specialities.map(special => <option value={special.name}>{special.name}</option>)}
                                    </select>
                                    <span className="red">{specialitiesError}</span>
                                </div>    
                                <div></div>
                                <div className="drug-instruction-list-container">
                                    {chosenSpecialities.map(special => <span className="status-btn pending">
                                    {special.name}
                                        <span 
                                        onClick={e => setChosenSpecialities(chosenSpecialities.filter(chosenSpecial=> special._id !== chosenSpecial._id))}>
                                            <CancelIcon />
                                        </span>
                                    </span>)}
                                </div>
                            </form>
                        </div>
                        <div className="modal-form-btn-container">
                            <div> 
                                {
                                    isSubmit ?
                                    <TailSpin width="25" height="25" color="#4c83ee" />
                                    :
                                    <button
                                    form="clinic-form"
                                    className="normal-button white-text action-color-bg"
                                    >{translations[lang]['Continue']}</button>
                                }  
                            </div>
                            <div>
                                <button 
                                className="normal-button cancel-button"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowFormModal(false)
                                }}
                                >{translations[lang]['Close']}</button>
                            </div>
                        </div>
                </div>
                } 
                
            </div>
    </div>
    </PageTransition>
}

export default ClinicFormModal
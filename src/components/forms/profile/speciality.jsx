import { useState, useEffect } from "react"
import './profile.css'
import { serverRequest } from "../../API/request"
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import { useSelector, useDispatch } from "react-redux"
import CancelIcon from '@mui/icons-material/Cancel'
import { setUserSpeciality } from "../../../redux/slices/userSlice"
import translations from "../../../i18n"

const SpecialityForm = ({ profile, reload, setReload }) => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [isSubmit, setIsSubmit] = useState(false)

    const [specialities, setSpecialities] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState(profile.speciality ? profile.speciality : [])

    const [specialityError, setSpecialityError] = useState()

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const addSpeciality = (value) => {
        for(let i=0;i<chosenSpecialities.length;i++) {
            if(value === chosenSpecialities[i].name) {
                return
            }
        }
        const chosenSpeciality = specialities.filter(special => special.name === value)
        setChosenSpecialities([...chosenSpecialities, chosenSpeciality[0]])
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(chosenSpecialities.length === 0) return setSpecialityError('Speciality is required')

        const updatedData = { 
            speciality: chosenSpecialities.map(special => special._id)
         }

        setIsSubmit(true)
        serverRequest.put(`/v1/users/${user._id}/speciality`, updatedData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            dispatch(setUserSpeciality(data.user.speciality))
            toast.success(data.message, { position: 'top-right', duration: 3000 })
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'speciality') return setSpecialityError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }


    return <div className="profile-form-container">
        <div className="cards-2-list-wrapper">
            <form id="profile-form" className="body-text">
                <div className="form-input-container">
                    <label>{translations[lang]['Speciality']}</label>
                    <select
                    className="form-input"
                    onChange={e => addSpeciality(e.target.value)}
                    onClick={e => setSpecialityError()}
                    >
                        <option selected disabled>{translations[lang]['Select Specialities']}</option>
                        {specialities.map(special => <option value={special.name}>{special.name}</option>)}
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

export default SpecialityForm
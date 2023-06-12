import { useState, useEffect } from 'react'
import './auth.css'
import { serverRequest } from '../../components/API/request'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../redux/slices/userSlice'
import CancelIcon from '@mui/icons-material/Cancel'


const SignUpSpecialityPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [doctorsSpecialities, setDoctorSpecialities] = useState([])

    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [specialities, setSpecialities] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState([])

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [specialitiesError, setSpecialitiesError] = useState()

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setDoctorSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!title) return setTitleError('title is required')

        if(!description) return setDescriptionError('description is required')

        if(chosenSpecialities.length === 0) return setSpecialitiesError('specialities is required') 

        const verifyData = {
            title,
            description,
            speciality: chosenSpecialities.map(special => special._id)
        }

        setIsSubmit(true)
        serverRequest.post('/v1/auth/verify/speciality-info', verifyData)
        .then(response => {
            setIsSubmit(false)
            dispatch(setUser({ ...user, ...verifyData }))
            navigate('/signup/email')  
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'title') return setTitleError(errorData.message)

                if(errorData.field === 'description') return setDescriptionError(errorData.message)

                if(errorData.field === 'speciality') return setSpecialitiesError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })

    }

    const addSpeciality = (value) => {
        for(let i=0;i<chosenSpecialities.length;i++) {
            if(value === chosenSpecialities[i].name) {
                return
            }
        }
        const chosenSpeciality = doctorsSpecialities.filter(special => special.name === value)
        setChosenSpecialities([...chosenSpecialities, chosenSpeciality[0]])
    }

    return <div className="form-page-center">
            <form className="login-form-container" onSubmit={handleSubmit}>
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Speciality Account
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>Title</label>
                        <input 
                        type="text" 
                        className="form-input"
                        onChange={e => setTitle(e.target.value)}
                        onClick={e => setTitleError()}
                        />
                        <span className="red">{titleError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Description</label>
                        <textarea 
                        className="form-input"
                        onChange={e => setDescription(e.target.value)}
                        onClick={e => setDescriptionError()}
                        ></textarea>
                        <span className="red">{descriptionError}</span>
                    </div>
                    
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>Speciality</label>
                        </div>
                        <select 
                        onChange={e => addSpeciality(e.target.value)}
                        onClick={e => setSpecialitiesError()}
                        >
                            <option selected disabled>Select Specialities</option>
                            {doctorsSpecialities.map(special => <option value={special.name}>{special.name}</option>)}
                        </select>
                        <span className="red">{specialitiesError}</span>
                    </div>
                    <div className="drug-instruction-list-container">
                        {chosenSpecialities.map(special => <span className="status-btn pending">
                            {special.name}
                            <span 
                            onClick={e => setChosenSpecialities(chosenSpecialities.filter(chosenSpecial=> special._id !== chosenSpecial._id))}>
                                <CancelIcon />
                            </span>
                            </span>)}
                    </div>
                    <div className="submit-btn-container">
                        {
                            isSubmit ?
                            <div className="flex-center">
                                <TailSpin width="40" height="40" color="#4c83ee" />
                            </div>
                            :
                            <input type="submit" className="action-color-bg white-text" value="Continue" />
                        }
                    </div>
                </div>
            </form>
    </div>
}

export default SignUpSpecialityPage
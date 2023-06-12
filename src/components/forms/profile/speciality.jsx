import { useState, useEffect } from "react"
import './profile.css'
import { serverRequest } from "../../API/request"
import { toast } from "react-hot-toast"
import { TailSpin } from "react-loader-spinner"
import { useSelector } from "react-redux"
import CancelIcon from '@mui/icons-material/Cancel'

const SpecialityForm = ({ profile, reload, setReload }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [title, setTitle] = useState(profile?.title)
    const [description, setDescription] = useState(profile?.description)
    const [specialities, setSpecialities] = useState([])
    const [chosenSpecialities, setChosenSpecialities] = useState(profile.speciality ? profile.speciality : [])

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
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

        if(!title) return setTitleError('Title is required')

        if(!description) return setDescriptionError('Description is required')
        
        if(chosenSpecialities.length === 0) return setSpecialityError('Speciality is required')

        const updatedData = { 
            title,
            description,
            speciality: chosenSpecialities.map(special => special._id)
         }

        setIsSubmit(true)
        serverRequest.put(`/v1/users/${user._id}/speciality`, updatedData)
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

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                if(errorResponse.field === 'speciality') return setSpecialityError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {}
        })
    }


    return <div className="profile-form-container">
        <div className="profile-form-wrapper">
            <form id="profile-form" className="body-text">
                <div>
                    <label>Title</label>
                    <div className="form-input-button-container">
                        <input 
                        type="text" 
                        className="form-input" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onClick={e => setTitleError()}
                        />
                    </div>
                    <span className="red">{titleError}</span>
                </div>
                <div>
                    <label>Description</label>
                    <div className="form-input-button-container">
                        <textarea 
                        className="form-input"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        onClick={e => setDescriptionError()}
                        ></textarea>
                    </div>
                    <span className="red">{descriptionError}</span>
                </div>
                <div className="form-input-container">
                        <label>Speciality</label>
                        <select 
                        onChange={e => addSpeciality(e.target.value)}
                        onClick={e => setSpecialitiesError()}
                        >
                            <option selected disabled>Select Specialities</option>
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
                                Update
                            </button>
                        }
                    </div>
                
            </form>
        </div>
    </div>
}

export default SpecialityForm
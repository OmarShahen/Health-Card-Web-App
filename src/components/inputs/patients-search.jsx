import translations from "../../i18n"
import SearchMenu from "../menus/search/search"
import { useState } from "react"
import { serverRequest } from "../API/request"
import { useSelector } from 'react-redux'


const SearchPatientInputField = ({ 
    setTargetPatient, 
    targetPatientError, 
    setTargetPatientError, 
    removeLabel=false,
    placeholder
 }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchName, setSearchName] = useState()
    const [patientsList, setPatientsList] = useState([])

    const searchPatient = (name) => {
        setSearchName(name)
        if(!name) {
            setPatientsList([])
            setTargetPatient()
            return
        }

        const endpointURL = user.roles.includes('STAFF') ?
        `/v1/clinics-patients/clinics/${user.clinicId}/search?firstName=${name}`
        :
        `/v1/clinics-patients-doctors/doctors/${user._id}/search?firstName=${name}`

        serverRequest.get(endpointURL)
        .then(response => {
            const patients = response.data.patients
            setPatientsList(patients)
        })
        .catch(error => {
            console.error(error)
        })
    }

    return <div className="form-input-container">
        {
            removeLabel ?
            null
            :
            <label>{translations[lang]['Patient']}</label>
        }
        <div className="quick-form-container">
            <input 
            type="text" 
            className="form-input" 
            value={searchName}
            onChange={e => searchPatient(e.target.value)}
            onClick={e => setTargetPatientError()}
            placeholder={placeholder ? placeholder : null}
            />
            {
                patientsList.length !== 0 ?
                <SearchMenu 
                patients={patientsList} 
                setPatients={setPatientsList}
                setPatient={setTargetPatient} 
                setSearchName={setSearchName}
                />
                :
                null
            }
            
        </div>
        <span className="red">{targetPatientError}</span>
        
    </div>
}

export default SearchPatientInputField
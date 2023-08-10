import CancelIcon from '@mui/icons-material/Cancel'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PatientAllergiesForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    const allergiesTypes = [
        'Food', 'Medication', 'Insect',
        'Latex', 'Environmental', 'Chemical',
        'Metal', 'Sun', 'Cold urticaria', 'Exercise-induced'
    ]

    return <div className="patient-form-wrapper" id="allergies-section" >
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Allergies']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>{translations[lang]['Allergic']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="allergies"
                    name="allergies"
                    onChange={e => props.setIsAllergic(true)}
                    />
                    <label for="allergies">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="allergies"
                    name="allergies"
                    onChange={e => props.setIsAllergic(false)}
                    />
                    <label for="allergies">{translations[lang]['No']}</label>
                </div>
            </div>
            <div className="form-input-container">
            <select 
            className="form-input"
            onChange={e => props.allergies.includes(e.target.value) ? 
                    null:
                    props.setAllergies([...props.allergies, e.target.value])
                    }>
                    <option>{translations[lang]['Select Allergy']}</option>
                    {allergiesTypes.map(type => <option value={type}>{translations[lang][type]}</option>)}
                </select>
                <div className="drug-instruction-list-container">
                    {props.allergies.map(allergy => <span className="status-btn pending">
                        {translations[lang][allergy]}
                        <span 
                        onClick={e => props.
                        setAllergies(props.allergies.filter((tempAllergy) => tempAllergy !== allergy))}>
                            <CancelIcon />
                        </span>
                    </span>)}
                </div>              
            </div>
        </div>
    </div>
}

export default PatientAllergiesForm
import CancelIcon from '@mui/icons-material/Cancel'

const PatientAllergiesForm = (props) => {

    const allergiesTypes = [
        'Food', 'Medication', 'Insect',
        'Latex', 'Environmental', 'Chemical',
        'Metal', 'Sun', 'Cold urticaria', 'Exercise-induced'
    ]

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Allergies
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>Allergic</h3>
                <div>
                    <input 
                    type="radio" 
                    id="allergies"
                    name="allergies"
                    onChange={e => props.setIsAllergic(true)}
                    />
                    <label for="allergies">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="allergies"
                    name="allergies"
                    onChange={e => props.setIsAllergic(false)}
                    />
                    <label for="allergies">No</label>
                </div>
            </div>
            <div className="form-input-container">
            <select onChange={e => props.allergies.includes(e.target.value) ? 
                    null:
                    props.setAllergies([...props.allergies, e.target.value])
                    }>
                    <option>Select Allergy</option>
                    {allergiesTypes.map(type => <option value={type}>{type}</option>)}
                </select>
                <div className="drug-instruction-list-container">
                    {props.allergies.map(allergy => <span className="status-btn pending">
                        {allergy}
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
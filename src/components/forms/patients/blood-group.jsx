

const PatientBloodGroupForm = (props) => {

    const bloodGroups = [
        'A', 'A-', 'A+',
        'B', 'B-', 'B+',
        'AB', 'AB-', 'AB+',
        'O', 'O-', 'O+',
    ]

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Blood
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <select onChange={e => props.setBloodGroup(e.target.value)}>
                    <option selected disabled>Select blood group</option>
                    {bloodGroups.map(group => <option value={group}>{group}</option>)}
                </select>
            </div>
            <div>
                <h3>Blood transfusion</h3>
                <div>
                    <input 
                    type="radio" 
                    id="transfusion" 
                    name="transfusion"
                    onChange={e => props.setIsBloodTransfusion(true)}
                    />
                    <label for="transfusion">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="transfusion"
                    name="transfusion"
                    onChange={e => props.setIsBloodTransfusion(false)}
                    />
                    <label for="transfusion">No</label>
                </div>
            </div>
            <div>
                <h3>Blood diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    id="blood-diseases"
                    name="blood-diseases"
                    onChange={e => props.setIsBloodDiseases(true)}
                    />
                    <label for="blood-diseases">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="blood-diseases"
                    name="blood-diseases"
                    onChange={e => props.setIsBloodDiseases(false)}
                    />
                    <label for="blood-diseases">No</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientBloodGroupForm
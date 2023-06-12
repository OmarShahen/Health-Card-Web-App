
const PatientBadHabitsForm = (props) => {

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Habits
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>Smoking Past</h3>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-past" 
                    id="smoke-past"
                    onChange={e => props.setIsSmokingPast(true)}
                    />
                    <label for="smoke-past">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-past" 
                    id="smoke-past"
                    onChange={e => props.setIsSmokingPast(false)}
                    />
                    <label for="smoke-past">No</label>
                </div>
            </div>
            <div>
                <h3>Smoking Present</h3>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-present" 
                    id="smoke-present"
                    onChange={e => props.setIsSmokingPresent(true)}
                    />
                    <label for="smoke-present">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-present" 
                    id="smoke-present"
                    onChange={e => props.setIsSmokingPresent(false)}
                    />
                    <label for="smoke-present">No</label>
                </div>
            </div>
            <div>
                <h3>Alcohol Past</h3>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-past" 
                    id="alcohol-past"
                    onChange={e => props.setIsAlcoholPast(true)}
                    />
                    <label for="alcohol-past">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-past" 
                    id="alcohol-past"
                    onChange={e => props.setIsAlcoholPast(false)}
                    />
                    <label for="alcohol-past">No</label>
                </div>
            </div>
            <div>
                <h3>Alcohol Present</h3>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-present" 
                    id="alcohol-present"
                    onChange={e => props.setIsAlcoholPresent(true)}
                    />
                    <label for="alcohol-present">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-present" 
                    id="alcohol-present"
                    onChange={e => props.setIsAlcoholPresent(false)}
                    />
                    <label for="alcohol-present">No</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientBadHabitsForm
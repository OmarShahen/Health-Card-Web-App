
const PatientChronicDiseasesForm = (props) => {

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Chronic Diseases
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>High Pressure</h3>
                <div>
                    <input 
                    type="radio" 
                    id="blood-pressure"
                    onChange={e => props.setIsHighBloodPressure(true)}
                    name="blood-pressure"
                    />
                    <label for="blood-pressure">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="blood-pressure"
                    onChange={e => props.setIsHighBloodPressure(false)}
                    name="blood-pressure"
                    />
                    <label for="blood-pressure">No</label>
                </div>
            </div>
            <div>
                <h3>Diabetes</h3>
                <div>
                    <input 
                    type="radio" 
                    id="diabetes"
                    onChange={e => props.setIsDiabetic(true)}
                    name="diabetes"
                    />
                    <label for="diabetes">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="diabetes"
                    onChange={e => props.setIsDiabetic(false)} 
                    name="diabetes"
                    />
                    <label for="diabetes">No</label>
                </div>
            </div>
            <div>
                <h3>Heart Diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    id="heart"
                    onChange={e => props.setIsChronicHeart(true)}
                    name="heart"
                    />
                    <label for="heart">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="heart"
                    onChange={e => props.setIsChronicHeart(false)}
                    name="heart"
                    />
                    <label for="heart">No</label>
                </div>
            </div>
            <div>
                <h3>Neurological Diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    id="neurons"
                    onChange={e => props.setIsChronicNeurological(true)}
                    name="neurons"
                    />
                    <label for="neurons">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="neurons"
                    onChange={e => props.setIsChronicNeurological(false)}
                    name="neurons"
                    />
                    <label for="neurons">No</label>
                </div>
            </div>
            <div>
                <h3>Liver Diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    id="liver"
                    onChange={e => props.setIsChronicLiver(true)}
                    name="liver"
                    />
                    <label for="liver">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="liver"
                    onChange={e => props.setIsChronicLiver(false)}
                    name="liver"
                    />
                    <label for="liver">No</label>
                </div>
            </div>
            <div>
                <h3>Kidney Diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    id="kidney"
                    onChange={e => props.setIsChronicKidney(true)}
                    name="kidney"
                    />
                    <label for="kidney">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="kidney"
                    onChange={e => props.setIsChronicKidney(false)}
                    name="kidney"
                    />
                    <label for="kidney">No</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientChronicDiseasesForm
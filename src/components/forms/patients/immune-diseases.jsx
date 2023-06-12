
const PatientImmuneDiseasesForm = (props) => {

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Immune Diseases
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>Immune diseases</h3>
                <div>
                    <input 
                    type="radio" 
                    name="immune" 
                    id="immune"
                    onChange={e => props.setIsImmuneDiseases(true)}
                    />
                    <label for="immune">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="immune" 
                    id="immune"
                    onChange={e => props.setIsImmuneDiseases(false)}
                    />
                    <label for="immune">No</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientImmuneDiseasesForm
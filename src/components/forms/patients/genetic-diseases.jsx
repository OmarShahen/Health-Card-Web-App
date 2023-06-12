
const PatientGeneticDiseasesForm = (props) => {

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Genetic Diseases
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>Cancer in family</h3>
                <div>
                    <input 
                    type="radio" 
                    name="cancer" 
                    id="cancer"
                    onChange={e => props.setIsCancerFamily(true)}
                    />
                    <label for="cancer">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="cancer" 
                    id="cancer"
                    onChange={e => props.setIsCancerFamily(false)}
                    />
                    <label for="cancer">No</label>
                </div>
            </div>
            <div>
                <h3>Genetic issue</h3>
                <div>
                    <input 
                    type="radio" 
                    id="gene"
                    name="gene"
                    onChange={e => props.setIsGeneticIssue(true)}
                    />
                    <label for="gene">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="gene"
                    name="gene"
                    onChange={e => props.setIsGeneticIssue(false)}
                    />
                    <label for="gene">No</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientGeneticDiseasesForm
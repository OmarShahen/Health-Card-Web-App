import translations from "../../../i18n"
import { useSelector } from "react-redux"

const PatientBloodGroupForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    const bloodGroups = [
        'A', 'A-', 'A+',
        'B', 'B-', 'B+',
        'AB', 'AB-', 'AB+',
        'O', 'O-', 'O+',
    ]

    return <div className="patient-form-wrapper" id="blood-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Blood']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <select className="form-input" onChange={e => props.setBloodGroup(e.target.value)}>
                    <option selected disabled>{translations[lang]['Select Blood Group']}</option>
                    {bloodGroups.map(group => {

                        if(group === props.bloodGroup) {
                            return <option value={group} selected>{group}</option>
                        }

                        return <option value={group}>{group}</option>
                    })}
                </select>
            </div>
            <div></div>
            <div>
                <h3>{translations[lang]['Blood Transfusion']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="transfusion" 
                    name="transfusion"
                    onChange={e => props.setIsBloodTransfusion(true)}
                    checked={props.isBloodTransfusion}
                    />
                    <label for="transfusion">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="transfusion"
                    name="transfusion"
                    onChange={e => props.setIsBloodTransfusion(false)}
                    checked={props.isBloodTransfusion === false}
                    />
                    <label for="transfusion">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Blood Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="blood-diseases"
                    name="blood-diseases"
                    onChange={e => props.setIsBloodDiseases(true)}
                    checked={props.isBloodDiseases}
                    />
                    <label for="blood-diseases">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="blood-diseases"
                    name="blood-diseases"
                    onChange={e => props.setIsBloodDiseases(false)}
                    checked={props.isBloodDiseases === false}
                    />
                    <label for="blood-diseases">{translations[lang]['No']}</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientBloodGroupForm
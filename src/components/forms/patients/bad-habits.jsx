import translations from "../../../i18n"
import { useSelector } from "react-redux"

const PatientBadHabitsForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="patient-form-wrapper" id="bad-habits-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Bad Habits']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>{translations[lang]['Smoking Past']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-past" 
                    id="smoke-past"
                    checked={props.isSmokingPast}
                    onChange={e => props.setIsSmokingPast(true)}
                    />
                    <label for="smoke-past">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-past" 
                    id="smoke-past"
                    checked={props.isSmokingPast === false}
                    onChange={e => props.setIsSmokingPast(false)}
                    />
                    <label for="smoke-past">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Smoking Present']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-present" 
                    id="smoke-present"
                    checked={props.isSmokingPresent}
                    onChange={e => props.setIsSmokingPresent(true)}
                    />
                    <label for="smoke-present">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="smoking-present" 
                    id="smoke-present"
                    checked={props.isSmokingPresent === false}
                    onChange={e => props.setIsSmokingPresent(false)}
                    />
                    <label for="smoke-present">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Alcohol Past']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-past" 
                    id="alcohol-past"
                    checked={props.isAlcoholPast}
                    onChange={e => props.setIsAlcoholPast(true)}
                    />
                    <label for="alcohol-past">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-past" 
                    id="alcohol-past"
                    checked={props.isAlcoholPast === false}
                    onChange={e => props.setIsAlcoholPast(false)}
                    />
                    <label for="alcohol-past">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Alcohol Present']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-present" 
                    id="alcohol-present"
                    checked={props.isAlcoholPresent}
                    onChange={e => props.setIsAlcoholPresent(true)}
                    />
                    <label for="alcohol-present">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="alcohol-present" 
                    id="alcohol-present"
                    checked={props.isAlcoholPresent === false}
                    onChange={e => props.setIsAlcoholPresent(false)}
                    />
                    <label for="alcohol-present">{translations[lang]['No']}</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientBadHabitsForm
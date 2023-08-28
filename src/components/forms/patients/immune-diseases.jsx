import { useSelector } from "react-redux"
import translations from "../../../i18n"

const PatientImmuneDiseasesForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="patient-form-wrapper" id="immune-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Immune Diseases']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>{translations[lang]['Immune Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="immune" 
                    id="immune"
                    onChange={e => props.setIsImmuneDiseases(true)}
                    checked={props.isImmuneDiseases}
                    />
                    <label for="immune">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="immune" 
                    id="immune"
                    onChange={e => props.setIsImmuneDiseases(false)}
                    checked={props.isImmuneDiseases === false}
                    />
                    <label for="immune">{translations[lang]['No']}</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientImmuneDiseasesForm
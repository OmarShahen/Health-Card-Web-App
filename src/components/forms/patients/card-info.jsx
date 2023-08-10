import translations from "../../../i18n"
import { useSelector } from "react-redux"

const PatientCardInformationForm = (props) => {

    const lang = useSelector(state => state.lang.lang)
    
    return <div className="patient-form-wrapper" id="card-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Card Information']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div className="form-input-container">
                <label>{translations[lang]['Card ID']}</label>
                <input 
                type="text" 
                className="form-input"
                onClick={e => props.setCardIdError()}
                onChange={e => props.setCardId(e.target.value)}
                />
                <span className="red">{props.cardIdError}</span>
            </div>
            <div className="form-input-container">
                <label>{translations[lang]['CVC']}</label>
                <input 
                type="text" 
                className="form-input"
                value={props.cvc}
                onClick={e => props.setCvcError()}
                onChange={e => props.setCvc(e.target.value)}
                />
                <span className="red">{props.cvcError}</span>
            </div>
        </div>
    </div>
}

export default PatientCardInformationForm
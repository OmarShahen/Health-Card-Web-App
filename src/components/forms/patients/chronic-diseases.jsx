import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PatientChronicDiseasesForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="patient-form-wrapper" id="chronic-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Chronic Diseases']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>{translations[lang]['High Pressure']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="blood-pressure"
                    onChange={e => props.setIsHighBloodPressure(true)}
                    name="blood-pressure"
                    checked={props.isHighBloodPressure}
                    />
                    <label for="blood-pressure">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="blood-pressure"
                    onChange={e => props.setIsHighBloodPressure(false)}
                    name="blood-pressure"
                    checked={props.isHighBloodPressure === false}
                    />
                    <label for="blood-pressure">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Diabetes']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="diabetes"
                    onChange={e => props.setIsDiabetic(true)}
                    name="diabetes"
                    checked={props.isDiabetic}
                    />
                    <label for="diabetes">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="diabetes"
                    onChange={e => props.setIsDiabetic(false)} 
                    name="diabetes"
                    checked={props.isDiabetic === false}
                    />
                    <label for="diabetes">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Heart Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="heart"
                    onChange={e => props.setIsChronicHeart(true)}
                    name="heart"
                    checked={props.isChronicHeart}
                    />
                    <label for="heart">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="heart"
                    onChange={e => props.setIsChronicHeart(false)}
                    name="heart"
                    checked={props.isChronicHeart === false}
                    />
                    <label for="heart">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Neurological Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="neurons"
                    onChange={e => props.setIsChronicNeurological(true)}
                    name="neurons"
                    checked={props.isChronicNeurological}
                    />
                    <label for="neurons">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="neurons"
                    onChange={e => props.setIsChronicNeurological(false)}
                    name="neurons"
                    checked={props.isChronicNeurological === false}
                    />
                    <label for="neurons">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Liver Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="liver"
                    onChange={e => props.setIsChronicLiver(true)}
                    name="liver"
                    checked={props.isChronicLiver}
                    />
                    <label for="liver">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="liver"
                    onChange={e => props.setIsChronicLiver(false)}
                    name="liver"
                    checked={props.isChronicLiver === false}
                    />
                    <label for="liver">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Kidney Diseases']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="kidney"
                    onChange={e => props.setIsChronicKidney(true)}
                    name="kidney"
                    checked={props.isChronicKidney}
                    />
                    <label for="kidney">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="kidney"
                    onChange={e => props.setIsChronicKidney(false)}
                    name="kidney"
                    checked={props.isChronicKidney === false}
                    />
                    <label for="kidney">{translations[lang]['No']}</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientChronicDiseasesForm
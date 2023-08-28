import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PatientGeneticDiseasesForm = (props) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="patient-form-wrapper" id="genetic-section">
        <div className="patient-form-header">
            <h2>
                {translations[lang]['Genetic Diseases']}
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>{translations[lang]['Cancer in Family']}</h3>
                <div>
                    <input 
                    type="radio" 
                    name="cancer" 
                    id="cancer"
                    onChange={e => props.setIsCancerFamily(true)}
                    checked={props.isCancerFamily}
                    />
                    <label for="cancer">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="cancer" 
                    id="cancer"
                    onChange={e => props.setIsCancerFamily(false)}
                    checked={props.isCancerFamily === false}
                    />
                    <label for="cancer">{translations[lang]['No']}</label>
                </div>
            </div>
            <div>
                <h3>{translations[lang]['Genetic Issue']}</h3>
                <div>
                    <input 
                    type="radio" 
                    id="gene"
                    name="gene"
                    onChange={e => props.setIsGeneticIssue(true)}
                    checked={props.isGeneticIssue}
                    />
                    <label for="gene">{translations[lang]['Yes']}</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    id="gene"
                    name="gene"
                    onChange={e => props.setIsGeneticIssue(false)}
                    checked={props.isGeneticIssue === false}
                    />
                    <label for="gene">{translations[lang]['No']}</label>
                </div>
            </div>
        </div>
    </div>
}

export default PatientGeneticDiseasesForm
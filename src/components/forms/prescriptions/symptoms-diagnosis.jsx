import CancelIcon from '@mui/icons-material/Cancel'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const SymptomsDiagnosisForm = ({ symptoms, setSymptoms, diagnosis, setDiagnosis, symptomsError, setSymptomsError, diagnosisError, setDiagnosisError }) => {

    const lang = useSelector(state => state.lang.lang)

    const handleSymptomsKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setSymptoms([...symptoms, value])

        e.target.value = ''
    }

    const handleDiagnosisKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setDiagnosis([...diagnosis, value])

        e.target.value = ''
    }

    return <div className="symptoms-diagnosis-form-container cards-2-list-wrapper margin-top-1">
    <div className="encounter-form-inputs-container">
        <div className="drug-list-item">
            <div className="form-input-container">
                <strong>{translations[lang]['Symptoms']} <span className="grey-text span-text">{translations[lang]['(press enter to register symptom)']}</span></strong>
                <input 
                type="text" 
                className="form-input" 
                placeholder={translations[lang]["Symptoms"]} 
                onKeyDown={handleSymptomsKeyDown}
                onClick={e => setSymptomsError()}
                />
                <div className="form-error-message">
                    {symptomsError}
                </div>
            </div>
        </div>
        <div className="symptoms-diagnosis-tags-container">
            <div className="drug-instruction-list-container">
                {symptoms.map((symptom, index) =>                 
                <span 
                className="status-btn pending"
                >
                    {symptom}
                    <span onClick={e => setSymptoms(symptoms.filter((savedSymptom, savedIndex) => savedIndex !== index))}>
                        <CancelIcon />
                    </span>
                </span>) 
                }
            </div>
        </div>
    </div>
    <div className="encounter-form-inputs-container">
        <div className="drug-list-item">
            <div className="prescription-form-icon-container">
            </div>
            <div className="form-input-container">
                <strong>{translations[lang]['Diagnosis']} <span className="grey-text span-text">{translations[lang]['(press enter to register diagnose)']}</span></strong>
                <input 
                type="text" 
                className="form-input" 
                placeholder={translations[lang]["Diagnosis"]} 
                onKeyDown={handleDiagnosisKeyDown}
                onClick={e => setDiagnosisError()}
                />
                <div className="form-error-message">
                    {diagnosisError}
                </div>
            </div>
        </div>
        <div className="symptoms-diagnosis-tags-container">
            <div className="drug-instruction-list-container">
                {diagnosis.map((diagnose, index) =>                 
                <span 
                className="status-btn pending"
                >
                    {diagnose}
                    <span onClick={e => setDiagnosis(diagnosis.filter((savedDiagnose, savedIndex) => savedIndex !== index))}>
                        <CancelIcon />
                    </span>
                </span>) 
                }
            </div>
        </div>
    </div>
</div>
}

export default SymptomsDiagnosisForm
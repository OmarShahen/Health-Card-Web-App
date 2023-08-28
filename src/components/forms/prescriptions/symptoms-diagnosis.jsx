import { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const SymptomsDiagnosisForm = ({ symptoms, setSymptoms, diagnosis, setDiagnosis, symptomsError, setSymptomsError, diagnosisError, setDiagnosisError }) => {

    const lang = useSelector(state => state.lang.lang)

    const [newSymptom, setNewSymptom] = useState()
    const [newDiagnose, setNewDiagnose] = useState()

    const handleSymptomsKeyDown = (e) => {

        if(e.key !== 'Enter') return
        
        if(!newSymptom) return setSymptomsError('no symptom is added')

        const value = newSymptom

        if(!value.trim()) return

        setSymptoms([...symptoms, value])

        setNewSymptom('')
    }

    const handleDiagnosisKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        if(!newDiagnose) return setDiagnosisError('no diagnose is added')

        const value = newDiagnose

        if(!value.trim()) return

        setDiagnosis([...diagnosis, value])

        setNewDiagnose('')
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
                value={newSymptom}
                onChange={e => setNewSymptom(e.target.value)}
                />
                <div className="form-error-message">
                    {symptomsError}
                </div>
                <div className="right padding-top-bottom">
                    <button 
                    className="normal-button action-color-bg white-text show-mobile"
                    onClick={e => {
                        if(!newSymptom) return setSymptomsError('no symptom is added')
                        if(!newSymptom.trim()) return
                        setSymptoms([...symptoms, newSymptom])
                        setNewSymptom('')
                    }}
                    >
                        Add
                    </button>
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
                value={newDiagnose}
                placeholder={translations[lang]["Diagnosis"]} 
                onKeyDown={handleDiagnosisKeyDown}
                onClick={e => setDiagnosisError()}
                onChange={e => setNewDiagnose(e.target.value)}
                />
                <div className="form-error-message">
                    {diagnosisError}
                </div>
                <div className="right padding-top-bottom">
                    <button 
                    className="normal-button action-color-bg white-text show-mobile"
                    onClick={e => {
                        if(!newDiagnose) return setDiagnosisError('no diagnose is added')
                        if(!newDiagnose.trim()) return
                        setDiagnosis([...diagnosis, newDiagnose])
                        setNewDiagnose('')
                    }}
                    >
                        Add
                    </button>
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
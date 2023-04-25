import { useState } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import translations from '../../../i18n'

const LabTestsAnalysisForm = ({ tests, setTests, analysis, setAnalysis }) => {


    const handleTestsKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setTests([...tests, value])

        e.target.value = ''
    }

    const handleAnalysisKeyDown = (e) => {

        if(e.key !== 'Enter') return 

        const value = e.target.value

        if(!value.trim()) return

        setAnalysis([...analysis, value])

        e.target.value = ''
    }

    return <div className="symptoms-diagnosis-form-container cards-2-list-wrapper">
    <div className="encounter-form-inputs-container">
        <div className="drug-list-item">
            <div className="form-input-container">
                <strong>Requested Lab Analysis</strong>
                <input 
                type="text" 
                className="form-input" 
                placeholder="lab analysis" 
                onKeyDown={handleAnalysisKeyDown}
                />
                <div className="form-error-message">
                    
                </div>
            </div>
        </div>
        <div className="symptoms-diagnosis-tags-container">
            <div className="drug-instruction-list-container">
                {analysis.map((labAnalysis) =>                 
                <span 
                className="status-btn pending"
                >
                    {labAnalysis}
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
                <strong>Requested Lab Tested</strong>
                <input 
                type="text" 
                className="form-input" 
                placeholder="lab tests"
                onKeyDown={handleTestsKeyDown} 
                />
                <div className="form-error-message">
                    
                </div>
            </div>
        </div>
        <div className="symptoms-diagnosis-tags-container">
            <div className="drug-instruction-list-container">
                {tests.map((test) =>                 
                <span 
                className="status-btn pending"
                >
                    {test}
                </span>) 
                }
            </div>
        </div>
    </div>
</div>
}

export default LabTestsAnalysisForm
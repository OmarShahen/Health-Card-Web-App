import { useState } from 'react'
import './modals.css'
import CancelIcon from '@mui/icons-material/Cancel'


const DrugFormModal = ({ drugs, setDrugs, setShowFormModal, mode, targetDrug }) => {

    const dosageTypes = [
        'tablet', 'capsule', 'sachet', 'lotion', 'gargle', 'drops', 'ointment', 'cream',
        'injections', 'suppository', 'transdermal patch', 'inhaler', 'pessary', 'enema'
    ]

    const [dosageTimes, setDosageTimes] = useState(['noon', 'morning', 'after eating', 'before eating' ,'when it is needed', 'before sleep', 'evening',])

    const [drugName, setDrugName] = useState(mode === 'EDITE' ? targetDrug?.name : '')
    const [amountNumber, setAmountNumber] = useState(mode === 'EDITE' ? targetDrug?.dosage?.amount : '')
    const [amountUnit, setAmountUnit] = useState(mode === 'EDITE' ? targetDrug?.dosage?.unit : "tablet")
    const [frequencyNumber, setFrequencyNumber] = useState(mode === 'EDITE' ? targetDrug?.frequency?.number : '')
    const [frequencyTime, setFrequencyTime] = useState(mode === 'EDITE' ? targetDrug?.frequency?.timeUnit : "day")
    const [periodNumber, setPeriodNumber] = useState(mode === 'EDITE' ? targetDrug?.duration?.number : '')
    const [periodTime, setPeriodTime] = useState(mode === 'EDITE' ? targetDrug?.duration?.timeUnit : "week")
    const [instructions, setInstructions] = useState(mode === 'EDITE' ? targetDrug?.instructions : [])

    const [drugNameError, setDrugNameError] = useState()
    const [amountNumberError, setAmountNumberError] = useState()
    const [amountUnitError, setAmountUnitError] = useState()
    const [frequencyNumberError, setFrequencyNumberError] = useState()
    const [frequencyTimeError, setFrequencyTimeError] = useState()
    const [periodNumberError, setPeriodNumberError] = useState()
    const [periodTimeError, setPeriodTimeError] = useState()


    const handleSubmit = (e) => {
        e.preventDefault()

        if(!drugName) return setDrugNameError('Drug name is required')

        if(!amountNumber) return setAmountNumberError('Amount number is required')
        
        if(!amountUnit) return setAmountUnitError('Amount unit is required')

        if(!frequencyNumber) return setFrequencyNumberError('Frequency number is required')

        if(!frequencyTime) return setFrequencyTimeError('Frequency time is required')

        if(!periodNumber) return setPeriodNumberError('Period number is required')
        
        if(!periodTime) return setPeriodTimeError('Period time is required')


        const newDrug = {
            name: drugName,
            dosage: { amount: Number.parseInt(amountNumber), unit: amountUnit },
            frequency: { number: Number.parseInt(frequencyNumber), timeUnit: frequencyTime },
            duration: { number: Number.parseInt(periodNumber), timeUnit: periodTime },
            instructions
        }

        setDrugs([...drugs, newDrug])

        resetForm()

    }

    const resetForm  = () => {

        setDrugName('')
        setAmountNumber('')
        setAmountUnit("tablet")
        setFrequencyNumber('')
        setFrequencyTime("day")
        setPeriodNumber('')
        setPeriodTime("week")
        setInstructions([])

        setDrugNameError()
        setAmountNumberError()
        setAmountUnitError()
        setFrequencyNumberError()
        setFrequencyTimeError()
        setPeriodNumberError()
        setPeriodTimeError()

    }

    return <div className="modal">
        <div className="modal-container body-text">
            <div className="modal-header">
                <h2>Add Drug</h2>
            </div>
            <div className="modal-body-container">
                <form className="modal-form-container body-text" id="drug-form" onSubmit={handleSubmit}>
                    <div className="form-input-container">
                        <label>Drug Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        value={drugName}
                        onChange={e => setDrugName(e.target.value)}
                        onClick={e => setDrugNameError()}
                        />
                        <span className="red">{drugNameError}</span>
                    </div>
                    <div></div>
                    <div className="form-input-container">
                        <label>Amount Number</label>
                        <input 
                        type="number"
                        min="0"
                        className="form-input" 
                        placeholder=""
                        value={amountNumber} 
                        onChange={e => setAmountNumber(e.target.value)}
                        onClick={e => setAmountNumberError()}
                        />
                        <span className="red">{amountNumberError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Amount Unit</label>
                        <select 
                        name="dosage-types" 
                        id="dosage-types"
                        onChange={e => setAmountUnit(e.target.value)}
                        onClick={e => amountUnitError()}
                        >
                            {
                                mode === 'EDITE' ?
                                dosageTypes.map(type => {
                                    if(type === amountUnit) {
                                        return <option selected value={type}>{type}</option>
                                    }
                                    return <option value={type}>{type}</option>
                                })
                                : 
                                dosageTypes.map(type => <option value={type}>{type}</option>)
                            }
                        </select>
                        <span className="red">{amountUnitError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Frequency Number</label>
                        <input 
                        type="number" 
                        min="0"
                        className="form-input" 
                        placeholder=""
                        value={frequencyNumber}
                        onChange={e => setFrequencyNumber(e.target.value)}
                        onClick={e => setFrequencyNumberError()}
                        />
                        <span className="red">{frequencyNumberError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Frequency Time</label>
                        <select 
                        name="frequency-time" 
                        id="frequency-time"
                        onChange={e => setFrequencyTime(e.target.value)}
                        >
                            { mode === 'EDITE' && frequencyTime === 'day' ? <option selected value="day">Day</option> : <option value="day">Day</option>}
                            { mode === 'EDITE' && frequencyTime === 'week' ? <option selected value="week">Week</option> : <option value="week">Week</option>}
                            { mode === 'EDITE' && frequencyTime === 'month' ? <option selected value="month">Month</option> : <option value="month">Month</option>}
                        </select>
                        <span className="red">{frequencyTimeError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Period Number</label>
                        <input 
                        type="number" 
                        min="0"
                        className="form-input" 
                        placeholder=""
                        value={periodNumber}
                        onChange={e => setPeriodNumber(e.target.value)}
                        onClick={e => setPeriodNumberError()}
                        />
                        <span className="red">{periodNumberError}</span>
                    </div>
                    <div className="form-input-container">
                        <label>Period Time</label>
                        <select 
                        name="period-time" 
                        id="period-time"
                        onChange={e => setPeriodTime(e.target.value)}
                        >
                            { mode === 'EDITE' && periodTime === 'day' ? <option selected value="day">Day</option> : <option value="day">Day</option>}
                            { mode === 'EDITE' && periodTime === 'week' ? <option selected value="week">Week</option> : <option value="week">Week</option>}
                            { mode === 'EDITE' && periodTime === 'month' ? <option selected value="month">Month</option> : <option value="month">Month</option>}
 
                        </select>
                        <span className="red">{periodTimeError}</span>
                    </div>
                </form>
                <div className="form-input-container">
                        <label>Dosage Times</label>
                        <div className="drug-instruction-list-container">
                            { instructions ? dosageTimes.map(time => {
                                if(instructions.includes(time)) {
                                    return <span 
                                    className="status-btn drug-instruction-tag"
                                    >
                                        {time}
                                        <span onClick={e => setInstructions(instructions.filter(instruction => instruction !== time))}>
                                            <CancelIcon />
                                        </span>
                                    </span>
                                } else {
                                    return <span 
                                    className="status-btn pending" 
                                    onClick={e => setInstructions([...instructions, time])}
                                    >
                                    {time}
                                    </span> 
                                }
                            })
                            :
                            null    
                            }
                        </div>
                    </div>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    <button 
                    form="drug-form"
                    className="normal-button white-text action-color-bg"
                    >Add Drug</button>
                </div>
                <div>
                    <button 
                    className="normal-button cancel-button"
                    onClick={e => setShowFormModal(false)}
                    >Close</button>
                </div>
            </div>
        </div>
    </div>
}

export default DrugFormModal
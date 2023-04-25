import { useState } from 'react'
import './modals.css'
import CancelIcon from '@mui/icons-material/Cancel'


const DrugFormModal = ({ drugs, setDrugs, setShowFormModal }) => {

    const dosageTypes = [
        'tablet', 'capsule', 'sachet', 'lotion', 'gargle', 'drops', 'ointment', 'cream',
        'injections', 'suppository', 'transdermal patch', 'inhaler', 'pessary', 'enema'
    ]

    const [dosageTimes, setDosageTimes] = useState(['noon', 'morning', 'after eating', 'before eating' ,'when it is needed', 'before sleep', 'evening',])

    const [drugName, setDrugName] = useState()
    const [amountNumber, setAmountNumber] = useState()
    const [amountUnit, setAmountUnit] = useState("tablet")
    const [frequencyNumber, setFrequencyNumber] = useState()
    const [frequencyTime, setFrequencyTime] = useState("day")
    const [periodNumber, setPeriodNumber] = useState()
    const [periodTime, setPeriodTime] = useState("week")
    const [instructions, setInstructions] = useState([])

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


        const drug = {
            name: drugName,
            dosage: { amount: Number.parseInt(amountNumber), unit: amountUnit },
            frequency: { number: Number.parseInt(frequencyNumber), timeUnit: frequencyTime },
            duration: { number: Number.parseInt(periodNumber), timeUnit: periodTime },
            instructions
        }

        setDrugs([ ...drugs, drug ])
        resetForm()

    }

    const resetForm  = () => {

        setDrugName('')
        setAmountNumber(0)
        setAmountUnit("tablet")
        setFrequencyNumber(0)
        setFrequencyTime("day")
        setPeriodNumber(0)
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
                    <div>
                        <label>Drug Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder=""
                        value={drugName}
                        onChange={e => setDrugName(e.target.value)}
                        onClick={e => setDrugNameError()}
                        />
                        <span className="red">{drugNameError}</span>
                    </div>
                    <div></div>
                    <div>
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
                    <div>
                        <label>Amount Unit</label>
                        <select 
                        name="dosage-types" 
                        id="dosage-types"
                        onChange={e => setAmountUnit(e.target.value)}
                        onClick={e => amountUnitError()}
                        >
                            {dosageTypes.map(type => <option value={type}>{type}</option>)}
                        </select>
                        <span className="red">{amountUnitError}</span>
                    </div>
                    <div>
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
                    <div>
                        <label>Frequency Time</label>
                        <select 
                        name="frequency-time" 
                        id="frequency-time"
                        onChange={e => setFrequencyTime(e.target.value)}
                        >
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                        <span className="red">{frequencyTimeError}</span>
                    </div>
                    <div>
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
                    <div>
                        <label>Period Time</label>
                        <select 
                        name="period-time" 
                        id="period-time"
                        onChange={e => setPeriodTime(e.target.value)}
                        >
                            <option value="day">Day</option>
                            <option value="week" selected>Week</option>
                            <option value="month">Month</option>
                        </select>
                        <span className="red">{periodTimeError}</span>
                    </div>
                    <div>
                        <label>Dosage Times</label>
                        <div className="drug-instruction-list-container">
                            { dosageTimes.map(time => {
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
                            }
                        </div>
                    </div>
                    <div></div>
                </form>
            </div>
            <div className="modal-form-btn-container">
                <div>
                    <button 
                    form="drug-form"
                    className="normal-button white-text purple-bg"
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
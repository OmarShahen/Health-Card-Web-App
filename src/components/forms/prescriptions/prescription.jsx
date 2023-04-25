import { useState } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import translations from '../../../i18n'

const PrescriptionForm = ({ drugs, setDrugs, index }) => {

    const dosageTypes = [
        'tablet', 'capsule', 'sachet', 'lotion', 'gargle', 'drops', 'ointment', 'cream',
        'injections', 'suppository', 'transdermal patch', 'inhaler', 'pessary', 'enema'
    ]

    const [dosageTimes, setDosageTimes] = useState([
        { name: 'noon', isChoose: false },
        { name:'morning', isChoose: false },
        { name: 'after eating', isChoose: false },
        { name: 'before eating', isChoose: false },
        { name: 'when it is needed', isChoose: false },
        { name: 'before sleep', isChoose: false },
        { name: 'evening', isChoose: false },
    ])


    return <div className="prescription-form-container">
    <div className="drug-list-container">
        <div className="drug-list-item">
            <div className="prescription-form-icon-container">
                <span className="icon" onClick={e => {
                    setDrugs(drugs.filter((drug, drugIndex) => { 

                        /*if(drugs.length === 1) {
                            return drug
                        }*/

                        if(drugIndex !== index) {
                            return drug   
                        }
                    }))
                }}>
                    <DeleteOutlineOutlinedIcon />
                </span>
            </div>
            <div className="form-input-container">
                <strong>اسم الدواء</strong>
                <input 
                type="text" 
                className="form-input" 
                placeholder="اكتب اسم الدواء" 
                onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                    if(index === drugIndex) {
                        return { ...drug, name: e.target.value }
                    }

                    return { ...drug }
                }
                ))}
                onClick={e => setDrugs(drugs.map((drug, drugIndex) => {
                    if(index === drugIndex) {
                        return { ...drug, nameError: '' }
                    }

                    return { ...drug }
                }
                ))}
                />
                <div className="form-error-message">
                    {drugs.map((drug, drugIndex) => {
                        if(index ===  drugIndex) {
                            return drug.nameError
                        }
                    })}
                </div>
            </div>
            <div className="drug-usage-container">
                <div>
                    <input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, dosage: { ...drug.dosage, amount: Number.parseInt(e.target.value) } }
                        }

                        return { ...drug }
                    }))}
                    />
                </div>
                <div>
                    <select 
                    name="dosage-types" 
                    id="dosage-types"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, dosage: { ...drug.dosage, unit: e.target.value } }
                        }

                        return { ...drug }
                    }))}
                    >
                        <option value="" selected disabled></option>
                        { dosageTypes.map(dosage => <option 
                        value={dosage}>
                        {translations['ar'][dosage]}
                        </option>) 
                        }
                    </select>
                </div>
                <div>
                    <span>X</span>
                </div>
                <div>
                    <input 
                    type="number" 
                    placeholder="0"
                    min="0"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, frequency: { ...drug.frequency, number: Number.parseInt(e.target.value) } }
                        }

                        return { ...drug }
                    }))}
                    />
                </div>
                <div>
                    <select 
                    name="frequency" 
                    id="frequency"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, frequency: { ...drug.frequency, timeUnit: e.target.value } }
                        }

                        return { ...drug }
                    }))}
                    >
                        <option value="" selected disabled></option>
                        <option value="day">يوم</option>
                        <option value="week">اسبوع</option>
                        <option value="month">شهر</option>
                    </select>
                </div>
                <div>
                    <span>X</span>
                </div>
                <div>
                    <input 
                    type="number" 
                    placeholder="0"
                    min="0"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, duration: { ...drug.duration, number: Number.parseInt(e.target.value) } }
                        }

                        return { ...drug }
                    }))}
                    />
                </div>
                <div>
                    <select 
                    name="durations" 
                    id="durations"
                    onChange={e => setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, duration: { ...drug.duration, timeUnit: e.target.value } }
                        }

                        return { ...drug }
                    }))}
                    >
                        <option value="" selected disabled></option>
                        <option value="day">يوم</option>
                        <option value="week">اسبوع</option>
                        <option value="month">شهر</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="drug-instructions-container">
            <div>
                <strong>
                    الارشادات
                </strong>
            </div>
            <div className="drug-instruction-list-container">
                { dosageTimes.map((time, timeIndex) => time.isChoose ?
                <span 
                className="status-btn drug-instruction-tag"
                onClick={e => {
                    setDosageTimes(dosageTimes.map((dosageTime, dosageTimeIndex) => {
                        if(dosageTimeIndex === timeIndex) {
                            setDrugs(drugs.map((drug, drugIndex) => {
                                if(index === drugIndex) {
                                    return { ...drug, instructions: drug.instructions.filter(instruction => instruction !== dosageTime.name) }
                                }

                                return { ...drug }
                            }))
                            return { ...dosageTime, isChoose: false }
                        }

                        return { ...dosageTime }
                    }))
                }}
                >
                    {translations['ar'][time.name]}
                    </span>
                :
                <span 
                className="status-btn pending"
                onClick={e => {
                    setDosageTimes(dosageTimes.map((dosageTime, dosageTimeIndex) => {
                        if(dosageTimeIndex === timeIndex) {
                            return { ...dosageTime, isChoose: true }
                        }

                        return { ...dosageTime }
                    }))

                    setDrugs(drugs.map((drug, drugIndex) => {
                        if(index === drugIndex) {
                            return { ...drug, instructions: [ ...drug.instructions, time.name ] }
                        }

                        return { ...drug }
                    }))
                }}
                >
                    {translations['ar'][time.name]}
                    </span>) 
            
            }
            </div>
        </div>
    </div>
</div>
}

export default PrescriptionForm
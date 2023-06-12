import CancelIcon from '@mui/icons-material/Cancel'


const PatientSurgeryForm = (props) => {

    const hospitalConfineReasons = [
        'Acute illnesses', 'Chronic illnesses', 'Surgical procedures',
        'Traumatic injuries', 'Mental health concerns', 'Serious infections',
        'Pregnancy', 'Complications from medical procedures or treatments',
        'End-of-life care and hospice services',
        'Observation and monitoring for potential health concerns'
    ]

    const surgeries = [
        'Orthopedic', 'Cardiovascular', 'Neurological',
        'Gastrointestinal', 'Gynecological', 'Urological',
        'Plastic and reconstructive', 'Ophthalmic', 'Otolaryngological',
        'Thoracic'
    ]

    return <div className="patient-form-wrapper">
        <div className="patient-form-header">
            <h2>
                Surgeries
            </h2>
        </div>
        <div className="cards-2-list-wrapper">
            <div>
                <h3>Hospital confined</h3>
                <div>
                    <input 
                    type="radio" 
                    name="hospital-confined" 
                    id="hospital-confined"
                    onChange={e => props.setIsHospitalConfined(true)}
                    />
                    <label for="hospital-confined">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="hospital-confined" 
                    id="hospital-confined"
                    onChange={e => props.setIsHospitalConfined(false)}
                    />
                    <label for="hospital-confined">No</label>
                </div>
            </div>
            <div className="form-input-container">
                <select onChange={e => props.hospitalConfinedReason.includes(e.target.value) ? 
                    null
                    :
                    props.setHospitalConfinedReason([...props.hospitalConfinedReason, e.target.value])}>
                    <option selected disabled>Select hospital confine reason</option>
                    {hospitalConfineReasons.map(reason => <option value={reason}>{reason}</option>)}
                </select>
                <div className="drug-instruction-list-container">
                    {props.hospitalConfinedReason.map(reason => <span className="status-btn pending">
                        {reason}
                        <span 
                        onClick={e => props.
                        setHospitalConfinedReason(props.hospitalConfinedReason.filter((tempReasons) => tempReasons !== reason))}>
                            <CancelIcon />
                        </span>
                    </span>)}
                </div>
            </div>
            <div>
                <h3>Surgery</h3>
                <div>
                    <input 
                    type="radio" 
                    name="surgey" 
                    id="surgey"
                    onChange={e => props.setIsSurgicalOperations(true)}
                    />
                    <label for="surgey">Yes</label>
                </div>
                <div>
                    <input 
                    type="radio" 
                    name="surgey" 
                    id="surgey"
                    onChange={e => props.setIsSurgicalOperations(false)}
                    />
                    <label for="surgey">No</label>
                </div>
            </div>
            <div className="form-input-container">
                <select onChange={e => props.surgicalOperationsReason.includes(e.target.value) ?
                null
                :
                props.setSurgicalOperationsReason([...props.surgicalOperationsReason, e.target.value])
                }>
                    <option selected disabled>Select surgeries</option>
                    {surgeries.map(type => <option value={type}>{type}</option>)}
                </select>
                <div className="drug-instruction-list-container">
                    {props.surgicalOperationsReason.map(reason => <span className="status-btn pending">
                        {reason}
                        <span 
                        onClick={e => props.
                            setSurgicalOperationsReason(props.surgicalOperationsReason.filter((tempReasons) => tempReasons !== reason))}>
                            <CancelIcon />
                        </span>
                    </span>)}
                </div>
            </div>
        </div>
    </div>
}

export default PatientSurgeryForm
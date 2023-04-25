import './patients.css'
const PatientBloodGroupSection = ({ setShowSection }) => {

    const groups = [
        { name: 'A+' },
        { name: 'A-' },
        { name: 'B+' },
        { name: 'B-' },
        { name: 'AB+' },
        { name: 'AB-' },
        { name: 'O+' },
        { name: 'O-' },
        
    ]

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h2>
                ماهي فصيلة دمك ؟
            </h2>
        </div>
        <div>
            <div className="choose-tags-container">
                { groups.map(group => <div onClick={e => setShowSection('DISEASES')}>{group.name}</div>)}
            </div>
            <div className="choose-tags-full-width">
                <span>
                    لااعلم / غير متاكد
                </span>
            </div>
        </div>
    </div>
}

export default PatientBloodGroupSection
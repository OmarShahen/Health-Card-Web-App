import './patients.css'
const PatientSocialStatusSection = ({ setShowSection }) => {

    const status = [
        { name: 'متزوجة' },
        { name: 'انسة' },
        { name: 'متزوجة و لدي اولاد' },
        { name: 'متزوج و لدي اولاد' },
        { name: 'اعزب' },
        { name: 'متزوج' },
        
    ]

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h2>
                ماهي الحالة الاجتماعية؟
            </h2>
        </div>
        <div>
            <ul className="patient-form-options-list">
                { status.map(stat => <li onClick={e => setShowSection('LOCATION')}>{stat.name}</li>)}
            </ul>
        </div>
    </div>
}

export default PatientSocialStatusSection
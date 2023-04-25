import './patients.css'
const PatientChronicSection = ({ setShowSection }) => {

    const diseases = [
        { name: 'امراض الجهاز الهضمي' },
        { name: 'امراض الضغط المنخفض' },
        { name: 'امراض السكر ' },
        { name: 'امراض القلب' },
        { name: 'امراض الغدة الدرقية' },
        { name: 'امراض الضغط المرتفع' },
        { name: 'مدخن سجائر او شيشة' },
        { name: 'لا اعاني من هذه الامراض' },
        
    ]

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                احكلنا اكتر عنك
            </h1>
            <p className="light-text-color">
            </p>
        </div>
        <div className="patients-form-tags-container">
            {
                diseases.map(disease => <span className="tag-item">
                    {disease.name}
                </span>)
            }
        </div>
        <div>
            <button className="button" onClick={e => setShowSection('EMERGENCY')}>
                التالي
            </button>
        </div>
    </div>
}

export default PatientChronicSection
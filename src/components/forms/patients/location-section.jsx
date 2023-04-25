import './patients.css'
const PatientLocationSection = ({ setShowSection }) => {

    const cities = [
        { name: 'الاسكندرية' },
        { name: 'اسوان' },
        { name: 'اسيوط' },
        { name: 'البحيرة' },
        { name: 'بني سويف' },
        { name: 'القاهرة' },
        { name: 'الدقهلية' },
        { name: 'دمياط' },
        { name: 'الفيوم' },
        { name: 'الغربية' },
        { name: 'الجيزة' },
        { name: 'الاسماعيلية' },
        { name: 'كفرالشيخ' },
        { name: 'الاقصر' },
        { name: 'مطروح' },
        { name: 'المنيا' },
        { name: 'المنوفية' },
        { name: 'الوادي الجديد' },
        { name: 'شمال سيناء' },
        { name: 'بورسعيد' },
        { name: 'القليوبية' },
        { name: 'قنا' },
        { name: 'البحر الاحمر' },
        { name: 'الشرقية' },
        { name: 'سوهاج' },
        { name: 'جنوب سينا' },
        { name: 'السويس' },
        
    ]

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                شاركنا موقعك
            </h1>
            <p className="light-text-color">
                شارك موقعك عشان نظهرلك شبكتنا الطبية حواليك
            </p>
        </div>
        <div>
            <ul className="patient-form-options-list">
                {
                    cities.map(city => <li onClick={e => setShowSection('BLOOD-GROUP')}>
                        {city.name}
                    </li>)
                }
            </ul>
        </div>
    </div>
}

export default PatientLocationSection
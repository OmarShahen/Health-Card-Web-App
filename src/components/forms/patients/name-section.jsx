import './patients.css'
const PatientNameSection = ({ setShowSection }) => {

    return <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                اهلا بيك!
            </h1>
            <p className="light-text-color">
                تسجيل حساب جديد في كارت المتابعة الصحية
            </p>
        </div>
        <div>
            <div className="form-input-container">
                <input type="text" className="form-input" placeholder="الاسم الاول" />
            </div>
            <div className="form-input-container">
                <input type="text" className="form-input" placeholder="اسم العائلة" />
            </div>
        </div>
        <div>
            <p className="light-text-color small-description-text">
                باستمراري في التسجيل. اكون قد وافقت علي سياسة الخصوصية و شروط الاستخدام
            </p>
            <button className="button" onClick={e => setShowSection('SOCIAL-STATUS')}>
                انشاء حساب جديد
            </button>
        </div>
    </div>
}

export default PatientNameSection
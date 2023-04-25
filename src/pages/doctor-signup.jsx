import './patients.css'
const DoctorSignUpPage = () => {

    return <div className="forms-page-container">
    <div className="patient-form-section-container">
        <div className="patient-form-section-header">
            <h1>
                انشاء حساب
            </h1>
        </div>
        <div>
            <div className="form-input-container">
                <label>اسم الطبيب</label>
                <input type="text" className="form-input" placeholder="الاسم" />
            </div>
            <div className="form-input-container">
                <label>لقب الطبيب</label>
                <div>
                    <select name="titles" id="titles">
                        <option value="اخصائي">اخصائي</option>
                        <option value="استاذ">استاذ</option>
                        <option value="استشاري">استشاري</option>
                        <option value="مدرس">مدرس</option>
                    </select>
                </div>
            </div>
            <div className="form-input-container">
                <label>رقم هاتف الطبيب</label>
                <input type="tel" className="form-input" placeholder="رقم الهاتف" />
            </div>
            <div className="form-input-container">
                <label>كلمة سر الطبيب</label>
                <input type="password" className="form-input" placeholder="كلمة السر" />
            </div>
            <div className="form-input-container">
                <label>تاكيد كلمة سر الطبيب</label>
                <input type="password" className="form-input" placeholder="تاكيد كلمة السر" />
            </div>
        </div>
        <div className="patient-form-btn-container">
            <p className="light-text-color small-description-text">
            </p>
            <button className="button">
                انشاء حساب
            </button>
        </div>
    </div>
    </div>
}

export default DoctorSignUpPage
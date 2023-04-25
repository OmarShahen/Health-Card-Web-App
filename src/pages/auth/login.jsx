import './auth.css'

const LoginPage = () => {

    return <div className="form-page-center">
            <form className="login-form-container">
                <div className="login-form-header-container subheader-text">
                    <h3>
                        Sign in to your account
                    </h3>
                </div>
                <div className="login-form-body-container body-text">
                    <div className="form-input-container">
                        <label>Email</label>
                        <input type="email" className="form-input" />
                    </div>
                    <div className="form-input-container">
                        <div className="password-and-forgot-password-container">
                            <label>Password</label>
                            <span className="purple">Forgot your password?</span>
                        </div>
                        <input type="password" className="form-input" />
                    </div>
                    <div className="submit-btn-container">
                        <input type="submit" className="purple-bg white-text" value="Continue" />
                    </div>
                </div>
            </form>
    </div>
}

export default LoginPage
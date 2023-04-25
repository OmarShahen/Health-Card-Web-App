import { NavLink } from "react-router-dom"
import './navigation-tabs.css'

const NavigationTabs = () => {

    return <div>
        <div className="navigation-tabs-links body-text">
            <ul>
                <NavLink to="/">
                    <li>
                        Home
                    </li>
                </NavLink>
                <NavLink to="/patients">
                    <li>
                        Patients
                    </li>
                </NavLink>
                <NavLink to="/encounters">
                    <li>
                        Encounters
                    </li>
                </NavLink>
                <NavLink to="/prescriptions">
                    <li>
                        Prescriptions
                    </li>
                </NavLink>
                <NavLink to="/appointments">
                    <li>
                        Appointments
                    </li>
                </NavLink>
                <NavLink to="/billing">
                    <li>
                        Billing
                    </li>
                </NavLink>
            </ul>
        </div>
    </div>
}

export default NavigationTabs
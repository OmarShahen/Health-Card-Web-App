import './layout.css'
import { NavLink, Outlet } from 'react-router-dom'


const PatientFormLayout = () => {

    return <div className="patient-form-layout-container">
        {/*<div className="patient-form-layout-list-container">
            <ul>
                <li>
                    <NavLink to="/patients/form/personal-information">Personal Information</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/bad-habits">Bad Habits</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/chronic-diseases">Chronic Diseases</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/genetic-diseases">Genetic Diseases</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/perso">Blood</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/person">Allergies</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/personal">Immune Diseases</NavLink>
                </li>
                <li>
                    <NavLink to="/patients/form/past-surgery">Past Surgery</NavLink>
                </li>
            </ul>

        </div>*/}
        <div className="patient-form-layout-body-container">
            <Outlet />
        </div>
    </div>
}

export default PatientFormLayout
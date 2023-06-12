import { NavLink } from "react-router-dom"
import './footer.css'
import CopyrightOutlinedIcon from '@mui/icons-material/CopyrightOutlined'


const FooterSection = () => {

    return <div className="page-footer-container body-text">
        <ul>
            <li>
                <NavLink to="/support">Support</NavLink>
            </li>
            <li className="show-large">
                <NavLink>Help Center</NavLink>
            </li>
            <li className="show-large">
                <NavLink>Privacy</NavLink>
            </li>
            <li className="show-large">
                <NavLink>Terms of service</NavLink>
            </li>
        </ul>
        <div className="copy-right-container">
            <CopyrightOutlinedIcon />
            <span>
                2023 - Agile
            </span>
        </div>
    </div>
}

export default FooterSection
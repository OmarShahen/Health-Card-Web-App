import './sections.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

const PageHeader = ({ pageName, addBtnText, setShowModalForm, formURL }) => {

    const navigate = useNavigate()

    return <div className="page-header-container">
        <div>
            <h1>
                {pageName}
            </h1>
        </div>
        {
            addBtnText ? 
            <div 
            className="btns-container subheader-text" 
            onClick={e => formURL ? navigate(formURL) : setShowModalForm(true)}
            >
                <button><AddOutlinedIcon /><strong>{addBtnText}</strong></button>
            </div>
            :
            null
        }
    </div>
}

export default PageHeader
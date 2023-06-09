import './sections.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CachedIcon from '@mui/icons-material/Cached'


const PageHeader = ({ 
    pageName, 
    addBtnText, 
    setShowModalForm, 
    formURL, 
    setReload, 
    reload, 
    isHideRefresh,
    isHideBackButton
}) => {

    const navigate = useNavigate()

    return <div className="page-header-wrapper">
        {
            isHideBackButton ?
            null
            :
            <div className="back-button-container">
                <ArrowBackIcon />
                <span onClick={e => navigate(-1)}>Back</span>
            </div>
        }
            <div className="page-header-container">
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

            {
                isHideRefresh ?
                null
                :
                <div className="header-mobile-icons-container">
                    <div onClick={e => setReload(reload + 1)}>
                        <CachedIcon />
                    </div>
                </div>
            }
        </div>
    </div>
}

export default PageHeader
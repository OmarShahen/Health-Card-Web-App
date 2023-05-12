import './buttons.css'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

const FloatingButton = ({ url, setIsShowForm }) => {

    const navigate = useNavigate()

    return <div 
    className="floating-button-container"
    onClick={ e => url ? navigate(url) : setIsShowForm(true) }
    >
        <AddIcon />
    </div>
}

export default FloatingButton
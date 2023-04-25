import './buttons.css'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'

const FloatingButton = ({ url }) => {

    const navigate = useNavigate()

    return <div 
    className="floating-button-container"
    onClick={e => navigate(url)}
    >
        <AddIcon />
    </div>
}

export default FloatingButton
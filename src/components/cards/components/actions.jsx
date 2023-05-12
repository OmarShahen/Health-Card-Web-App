import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import './actions.css'

const CardActions = ({ actions }) => {

    return <div className="small-description-text actions-container">
        <MoreHorizIcon />
        <div className="actions-dropdown-container">
            <ul>
                {actions.map(action => <li className="width" onClick={action.onAction}>
                    {action.icon}
                    {action.name}
                </li>)}
            </ul>
        </div>
    </div>
}

export default CardActions
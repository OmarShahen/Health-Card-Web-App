import { format } from 'date-fns'
import { getTime } from '../../../utils/time'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'


const CardDate = ({ date }) => {

    return <div className="card-date-container grey-text">
        <span>{format(new Date(date), 'dd MMM yyyy')}</span>
        <span>
            <FiberManualRecordIcon />
        </span>
        <span>{getTime(date)}</span>
    </div>
}

export default CardDate
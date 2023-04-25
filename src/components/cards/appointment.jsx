import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

const shortName = (name) => {

    let newName = ''

    for(let i=0;i<name.length;i++) {
        if(i > 30) {
            return newName + '...'
        }
        newName += name[i]
    }

    return newName
}


const AppointmentCard = () => {

    return <div className="appointment-card-container body-text">
        <div className="appointment-card-header">
            <div>
                <span className="grey-text body-text">تاريخ الحجز</span>
                <div className="date-container">
                    <AccessTimeOutlinedIcon />
                    <div className="body-text">
                        <span>12 Feb 2023</span>
                        <span className="grey-text"><FiberManualRecordIcon /></span>
                        <span>80:00 AM</span>
                    </div>
                </div>
            </div>
            <div className="grey-text">
                <MoreVertOutlinedIcon />
            </div>
        </div>
        <div className="appointment-card-body body-text">
            <div className="person-info-container">
                <div>
                    <img src={`https://avatars.dicebear.com/api/initials/${'Omar Reda'}.svg`} />
                </div>
                <div>
                    <strong>عمر رضا السيد</strong>
                    <span className="grey-text">+201065630331</span>
                </div>
            </div>
            <div>
                <span className="status-btn pending">Waiting</span>
            </div>
        </div>
    </div>
}

export default AppointmentCard
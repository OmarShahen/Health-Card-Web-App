import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined'

const Card = ({ cardHeader, icon, iconColor, number }) => {

    return <div className="card-container body-text">
        <div className="card-header-container">
            <span>
                {cardHeader}
            </span>
            <span>
                {icon}
            </span>
        </div>
        <div className="card-number-container">
            {number}
        </div>
        {/*<div className="card-footer">
            <div>
            <   span className="status-btn done"><NorthOutlinedIcon /> 12%</span>
            </div>
            <span className="grey-text">since last week</span>
        </div>*/}
    </div>
}

export default Card
import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined'

const Card = ({ cardHeader, icon, iconColor, number }) => {

    return <div className="card-container body-text">
        <div className="card-header-container">
            <div>
                <strong>
                    {cardHeader}
                </strong>
            </div>
            <div className="stat-card-icon-container" style={{ backgroundColor: iconColor }}>
                {icon}
            </div>
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
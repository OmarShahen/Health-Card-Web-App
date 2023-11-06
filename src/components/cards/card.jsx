import NorthOutlinedIcon from '@mui/icons-material/NorthOutlined'
import CountUp from 'react-countup'


const Card = ({ cardHeader, icon, isMoney=false, number, isShowStats }) => {

    <CountUp end={100} />

    return <div className="card-container body-text disable-hover cards-white-bg">
        <div className="card-header-container">
            <span>
                {cardHeader}
            </span>
            <span>
                {icon}
            </span>
        </div>
        <div className="card-number-container">
            {
                isMoney ?
                number
                :
                <CountUp 
                end={number}
                duration={1.5}
                />
            }
        </div>
        {/*
            isShowStats ? 
            <div className="card-footer">
                <div>
                <   span className="status-btn done"><NorthOutlinedIcon /> 12%</span>
                </div>
                <span className="grey-text">since last week</span>
            </div>
            :
            null
        */}
    </div>
}

export default Card
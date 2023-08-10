import { TailSpin } from "react-loader-spinner"
import './loadings.css'

const CircularLoading = ({ width="50", height="50" }) => {

    return <div className="loading-container">
        <TailSpin width={width} height={height} color="#4c83ee" />
    </div>
}

export default CircularLoading
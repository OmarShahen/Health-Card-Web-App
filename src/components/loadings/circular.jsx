import { TailSpin } from "react-loader-spinner"
import './loadings.css'

const CircularLoading = () => {

    return <div className="loading-container">
        <TailSpin width="50" height="50" color="#4c83ee" />
    </div>
}

export default CircularLoading
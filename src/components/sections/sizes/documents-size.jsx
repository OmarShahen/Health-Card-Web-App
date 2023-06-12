import './document-sizes.css'
import { formatNumber } from '../../../utils/numbers'

const DocumentsSizes = ({ size }) => {

    return <div className="documents-sizes-container">
        <span className="grey-bg">{size ? formatNumber(size) : 0}</span>
    </div>
}

export default DocumentsSizes
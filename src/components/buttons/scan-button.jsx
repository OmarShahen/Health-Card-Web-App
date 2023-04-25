import './buttons.css'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

const ScanButton = ({ url }) => {

    return <div 
    className="floating-scan-button-container"
    >
        <QrCodeScannerIcon />
    </div>
}

export default ScanButton
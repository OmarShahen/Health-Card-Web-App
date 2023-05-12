import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import PrescriptionDocument from './prescription-document'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'


const PrintPrescription = ({ prescription }) => {

    let componentRef = useRef()

    return (
        <div>
            <ReactToPrint
            trigger={() =><button className="action-button"><LocalPrintshopOutlinedIcon /><strong>Print Prescription</strong></button>}
            content={() => componentRef}
            />
            <div style={{ display: 'none' }}>
                <PrescriptionDocument prescription={prescription} ref={el => componentRef=el} />
            </div>
        </div>
    )
}

export default PrintPrescription
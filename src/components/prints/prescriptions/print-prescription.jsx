import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import PrescriptionDocument from '../prescriptions/prescription-document'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PrintPrescription = ({ prescription }) => {

    let componentRef = useRef()

    const lang = useSelector(state => state.lang.lang)

    return (
        <div>
            <ReactToPrint
            trigger={() =><button className="action-button"><LocalPrintshopOutlinedIcon /><strong>{translations[lang]['Print Prescription']}</strong></button>}
            content={() => componentRef}
            />
            <div style={{ display: 'none' }}>
                <PrescriptionDocument prescription={prescription} lang={lang} ref={el => componentRef=el} />
            </div>
        </div>
    )
}

export default PrintPrescription
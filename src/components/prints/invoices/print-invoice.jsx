import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import InvoiceDocument from '../invoices/invoice-document'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PrintInvoice = ({ invoice }) => {

    let componentRef = useRef()
    const lang = useSelector(state => state.lang.lang)

    return (
        <div>
            <ReactToPrint
            trigger={() =><button className="action-button"><LocalPrintshopOutlinedIcon /><strong>{translations[lang]['Print Invoice']}</strong></button>}
            content={() => componentRef}
            />
            <div style={{ display: 'none' }}>
                <InvoiceDocument invoice={invoice} lang={lang} ref={el => componentRef=el} />
            </div>
        </div>
    )
}

export default PrintInvoice
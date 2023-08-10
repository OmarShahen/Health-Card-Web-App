import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import InvoicesDocument from '../invoices/invoices-document'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PrintInvoices = ({ invoices, insurance, clinic }) => {

    let componentRef = useRef()
    const lang = useSelector(state => state.lang.lang)

    return (
        <div>
            <ReactToPrint
            trigger={() =><button className="action-button"><LocalPrintshopOutlinedIcon /><strong>{'Print Invoices'}</strong></button>}
            content={() => componentRef}
            />
            <div style={{ display: 'block' }}>
                <InvoicesDocument 
                invoices={invoices} 
                insurance={insurance}
                clinic={clinic}
                lang={lang} 
                ref={el => componentRef=el} 
                />
            </div>
        </div>
    )
}

export default PrintInvoices
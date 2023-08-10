import './print-table.css'
import { formatMoney } from '../../../utils/numbers'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'

const PrintInvoiceTable = ({ rows }) => {

    const lang = useSelector(state => state.lang.lang)

    return <div>
        <div className="print-table-container">
       <div className="print-table-container body-text">
            <table>
                <tr className="print-table-header-rows">
                    <th>{translations[lang]['Description']}</th>
                    <th>{translations[lang]['Cost']}</th>
                </tr>
                {
                    rows.map((row, index) => <tr>
                        <td>{row?.service?.name}</td>
                        <td>{formatMoney(row?.amount)}</td>
                    </tr>)
                }
            </table>
        </div>
    </div>
    </div>
}

export default PrintInvoiceTable
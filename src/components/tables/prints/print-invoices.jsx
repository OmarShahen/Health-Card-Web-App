import './print-table.css'
import { formatMoney, formatNumber } from '../../../utils/numbers'
import translations from '../../../i18n'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

const PrintInvoicesTable = ({ rows }) => {

    const lang = useSelector(state => state.lang.lang)

    const showServices = (services) => {
        let description = ''

        for(let i=0;i<services.length;i++) {
            description += services[i]
        }

        return description
    }

    return <div>
        <div className="print-table-container">
       <div className="print-table-container body-text">
            <table>
                <tr className="print-table-header-rows">
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Services</th>
                    <th>Total Amount</th>
                    <th>Insurance Coverage</th>
                    <th>Patient Paid</th>
                    <th>Date</th>
                </tr>
                {rows.map((row, index) => <tr>
                    <td>{row.invoiceId}</td>
                    <td>{row?.patient?.firstName + ' ' + row?.patient?.lastName}</td>
                    <td>{/*showServices(row.services)*/}</td>
                    <td>{formatNumber(row.totalCost)}</td>
                    <td>
                        {formatNumber((row.totalCost * (row.insuranceCoveragePercentage/100)))}
                    </td>
                    <td>{formatNumber(row.paid)}</td>
                    <td>{format(new Date(row.invoiceDate), 'dd MMMM yyyy')}</td>

                </tr>)}
            </table>
        </div>
    </div>
    </div>
}

export default PrintInvoicesTable
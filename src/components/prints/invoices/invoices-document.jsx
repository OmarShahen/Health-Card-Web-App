import React from 'react'
import './invoice.css'
import { format } from 'date-fns'
import { formatMoney } from '../../../utils/numbers'
import translations from '../../../i18n'
import PrintInvoicesTable from '../../tables/prints/print-invoices'


class InvoicesDocument extends React.Component {

    render() {

        const invoices = this.props.invoices
        const clinic = this.props.clinic
        const insurance = this.props.insurance
        const lang = this.props.lang

        const getTotalPatientPaid = (invoices) => {

            let total = 0

            for(let i=0;i<invoices.length;i++) {
                total += invoices[i].paid
            }

            return total
        }

        const getTotalInsuranceCoverage = (invoices) => {

            let total = 0

            for(let i=0;i<invoices.length;i++) {
                const invoice = invoices[i]
                total += invoice.totalCost * (invoice.insuranceCoveragePercentage/100)
            }

            return total
        }

        const getTotalCost = (invoices) => {

            let total = 0

            for(let i=0;i<invoices.length;i++) {
                total += invoices[i].totalCost
            }

            return total
        }

        return <div className="invoice-doc-container body-text">
            <div className="invoice-doc-header">
                <h1>
                    {'Invoices'}
                </h1>
                <h1>
                    {clinic?.name}
                </h1>
            </div>
            <div className="invoice-doc-info-container">
                <div className="print-cards-list-wrapper">
                    <ul>
                        <li>
                            <span>{'Issue Date'}</span>
                            <span>
                                {format(new Date(), 'MMMM dd, yyyy')}
                            </span>
                        </li>
                        <li>
                            <span>Insurance Company</span>
                            <span>{insurance.name}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="invoice-padding-section"></div>
            <div>
                <PrintInvoicesTable rows={invoices} />
            </div>
            <div className="margin-top-1"></div>
            <div className="cards-2-list-wrapper">
                <div></div>
                <div className="invoice-doc-price-container">
                    <ul>
                        <li className="bold-text">
                            <span>{translations[lang]['Total Amount']}</span>
                            <span>{formatMoney(getTotalCost(invoices))}</span>
                        </li>
                        <li>
                            <span>Insurance Coverage Amount</span>
                            <span>{formatMoney(getTotalInsuranceCoverage(invoices))}</span>
                        </li>
                        <li>
                            <span>Patients Paid Amount</span>
                            <span>{formatMoney(getTotalPatientPaid(invoices))}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="invoice-padding-section"></div>
            <div className="application-signature-container">
                <span>Powered by <strong>RA'AYA</strong></span>
            </div>
        </div>
    }
}

export default InvoicesDocument
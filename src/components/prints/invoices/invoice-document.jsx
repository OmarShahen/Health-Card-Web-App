import React from 'react'
import './invoice.css'
import { format } from 'date-fns'
import { formatMoney } from '../../../utils/numbers'
import PrintInvoiceTable from '../../tables/prints/print-invoice'
import translations from '../../../i18n'

class InvoiceDocument extends React.Component {

    render() {

        const invoice = this.props.invoice
        const lang = this.props.lang

        const insuranceCoveragePercentage = invoice?.insuranceCoveragePercentage ? invoice?.insuranceCoveragePercentage / 100 : 1
        const totalAmount = invoice.totalCost
        const totalAmountRemaining = invoice?.insuranceCoveragePercentage ? totalAmount - (totalAmount * insuranceCoveragePercentage) : 0


        return <div className="invoice-doc-container body-text">
            <div className="invoice-doc-header">
                <h1>
                    {translations[lang]['Invoice']}
                </h1>
                <h1>
                    {invoice?.clinic?.name}
                </h1>
            </div>
            <div className="invoice-doc-info-container">
                <div className="print-cards-list-wrapper">
                    <ul>
                        <li>
                            <span>{translations[lang]['Invoice Number']}</span>
                            <span>{invoice.invoiceId}</span>
                        </li>
                        <li>
                            <span>{translations[lang]['Invoice Date']}</span>
                            <span>
                                {
                                    invoice.invoiceDate ? 
                                    format(new Date(invoice.invoiceDate), lang === 'en' ? 'MMMM dd, yyyy' : 'MM/dd/yyyy') 
                                    : 
                                    format(new Date(invoice.createdAt), lang === 'en' ? 'MMMM dd, yyyy' : 'MM/dd/yyyy') 
                                }
                            </span>
                        </li>
                        <li>
                            <span>{translations[lang]['Date due']}</span>
                            <span>
                                {
                                invoice.dueDate ? 
                                format(new Date(invoice.dueDate), lang === 'en' ? 'MMMM dd, yyyy' : 'MM/dd/yyyy') 
                                : 
                                format(new Date(invoice.createdAt), lang === 'en' ? 'MMMM dd, yyyy' : 'MM/dd/yyyy') 
                                }</span>
                        </li>
                    </ul>
                    <ul>
                        {
                            invoice?.insuranceCoveragePercentage ?
                            <li>
                                <span>{translations[lang]['Insurance Company']}</span>
                                <span>{invoice?.insuranceCompany.name}</span>
                            </li>
                            :
                            null
                        }
                    </ul>
                </div>
                <div className="invoice-padding-section"></div>
                <div className="cards-2-list-wrapper">
                        <div>
                            <strong>{invoice.clinic.name}</strong>
                        </div>
                        <div>
                            <strong>{translations[lang]['Bill to']}</strong><br />
                            <span>{invoice.patient.firstName + ' ' + invoice.patient.lastName}</span>
                        </div>
                </div>
                <div className="invoice-padding-section"></div>
                <div className="invoice-doc-total-container">
                    <strong>
                        {formatMoney(invoice.totalCost)}
                            {
                                lang === 'en' ?
                                ` ${translations[lang]['due']} ${invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'MMMM dd, yyyy') : format(new Date(invoice.createdAt), 'MMMM dd, yyyy')}`
                                :
                                null
                        }
                    </strong>
                </div>
            </div>
            <div className="invoice-padding-section"></div>
            <div>
                <PrintInvoiceTable rows={invoice.invoiceServices} />
            </div>
            <div className="margin-top-1"></div>
            <div className="cards-2-list-wrapper">
                <div></div>
                <div className="invoice-doc-price-container">
                    <ul>
                        <li className="bold-text">
                            <span>{translations[lang]['Total Amount']}</span>
                            <span>{formatMoney(totalAmount)}</span>
                        </li>
                        {
                            invoice?.insuranceCoveragePercentage ?
                            <li>
                                <span>{`${translations[lang]['Insurance Coverage']} (${invoice.insuranceCoveragePercentage}%)`}</span>
                                <span>{formatMoney(totalAmount * (invoice.insuranceCoveragePercentage/100))}</span>
                            </li>
                            :
                            null
                        }
                        <li>
                            <span>{translations[lang]['Paid']}</span>
                            <span>{formatMoney(invoice.paid)}</span>
                        </li>
                        <li>
                            <span>{translations[lang]['Remaining Amount']}</span>
                            {
                                invoice.insuranceCoveragePercentage ?
                                <span>{formatMoney(totalAmountRemaining - invoice.paid)}</span>
                                :
                                <span>{formatMoney(totalAmount - invoice.paid)}</span>
                            }
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

export default InvoiceDocument
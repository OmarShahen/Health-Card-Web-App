import React from 'react'
import './banner.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatNumber, formatMoney } from '../../utils/numbers'
import { closeInvoice } from '../../redux/slices/invoiceSlice'
import translations from '../../i18n'

const CartBanner = () => {

    const dispatch = useDispatch()
    const invoice = useSelector(state => state.invoice)
    const lang = useSelector(state => state.lang.lang)
    const services = invoice.services
    const navigate = useNavigate()

    const getTotalInvoiceCost = () => {

        let total = 0
        for(let i=0;i<services.length;i++) {
            total += services[i].cost
        }

        return total
    }

    return (
        <div className="cart-banner-container">
            <div className="cart-banner-wrapper">
                <div className="cart-banner-main" onClick={e => navigate('/invoices/checkout')}>
                    <span>{formatNumber(invoice.services.length)}</span>
                    <p className="cart-banner-action">{translations[lang]['View Invoice']}</p>
                </div>
                <div>
                    <p>{formatMoney(getTotalInvoiceCost())}</p>
                </div>
                <div className="cart-banner-close" onClick={e => {
                    dispatch(closeInvoice())
                    navigate('/invoices')
                }}>
                    <i className="material-icons">{translations[lang]['Close']}</i>
                </div>
            </div>
        </div>
    )
}

export default CartBanner
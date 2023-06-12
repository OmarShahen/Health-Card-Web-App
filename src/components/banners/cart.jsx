import React from 'react'
import './banner.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatNumber, formatMoney } from '../../utils/numbers'
import { closeInvoice } from '../../redux/slices/invoiceSlice'

const CartBanner = () => {

    const dispatch = useDispatch()
    const invoice = useSelector(state => state.invoice)
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
                <div className="cart-banner-main" onClick={e => navigate('/inventory-checkout')}>
                    <span>{formatNumber(invoice.services.length)}</span>
                    <p className="cart-banner-action">View Invoice</p>
                </div>
                <div>
                    <p>{formatMoney(getTotalInvoiceCost())}</p>
                </div>
                <div className="cart-banner-close" onClick={e => {
                    dispatch(closeInvoice())
                    navigate('/invoices')
                }}>
                    <i className="material-icons">close</i>
                </div>
            </div>
        </div>
    )
}

export default CartBanner
import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular';
import FiltersSection from '../../components/sections/filters/filters'
import InvoiceCard from '../../components/cards/invoice'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchInvoices } from '../../utils/searches/search-invoices'
import { format } from 'date-fns'
import InvoiceFormModal from '../../components/modals/invoice-form'
import PayDebtFormModal from '../../components/modals/pay-debt-form'
import InvoiceDeleteConfirmationModal from '../../components/modals/confirmation/invoice-delete-confirmation-modal';
import InvoiceRefundConfirmationModal from '../../components/modals/confirmation/invoice-refund-confirmation-modal';
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import translations from '../../i18n'
import PageHeader from '../../components/sections/page-header';

const InsuranceInvoicesPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const insuranceCompanyId = pagePath.split('/')[2]

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowPayDebtForm, setIsShowPayDebtForm] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isShowRefundModal, setIsShowRefundModal] = useState(false)

    const [insurance, setInsurance] = useState({})
    const [clinic, setClinic] = useState({})
    const [targetInvoice, setTargetInvoice] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSelectMode, setIsSelectMode] = useState(false)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [selectedInvoices, setSelectedInvoices] = useState([])
    const [searchedInvoices, setSearchedInvoices] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()
    const monthDate = new Date()

    todayDate.setDate(todayDate.getDate() + 1)
    monthDate.setDate(monthDate.getDate() - 30)

    const [statsQuery, setStatsQuery] = useState({ from: monthDate, to: todayDate })

    useEffect(() => { 
        //scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        let endpointURL = `/v1/invoices/insurance-companies/${insuranceCompanyId}`

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setInvoices(response.data.invoices)
            setSearchedInvoices(response.data.invoices)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])

    useEffect(() => {
        serverRequest.get(`/v1/insurances/${insuranceCompanyId}`)
        .then(response => {
            setInsurance(response.data.insurance)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    useEffect(() => {

        if(!user.roles.includes('STAFF')) {
            return
        }
        
        serverRequest.get(`/v1/clinics/${user.clinicId}`)
        .then(response => {
            setClinic(response.data.clinic)
        })
        .catch(error => {
            console.error(error)
            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        })
    }, [])


    return <div className="page-container">
        { 
        isShowDeleteModal ? 
        <InvoiceDeleteConfirmationModal 
        invoice={targetInvoice}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        { 
        isShowRefundModal ? 
        <InvoiceRefundConfirmationModal 
        invoice={targetInvoice}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowRefundModal}
        /> 
        : 
        null 
        }

        { isShowForm ? <InvoiceFormModal setShowModalForm={setIsShowForm} /> : null }
        { 
            isShowPayDebtForm ? 
            <PayDebtFormModal 
            invoice={targetInvoice} 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setIsShowPayDebtForm}
            /> 
            : 
            null 
        }
        
        <div className="padded-container">
            <PageHeader
            pageName={translations[lang]['Invoices']}
            isHideBackButton={true} 
            />
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={false}
            defaultValue={'-30'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={invoices} 
                setRows={setSearchedInvoices}
                searchRows={searchInvoices}
                isHideClinics={user.roles.includes('STAFF') ? true : false}
                isShowInsuranceCompanies={false}
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedInvoices(invoices.filter(invoice => true))
                    }}>
                        {translations[lang]['All']}
                    </div>
                    <div style={ viewStatus === 'DRAFT' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('DRAFT')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'DRAFT'))
                    }}>
                        {translations[lang]['Draft']}
                    </div>
                    <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('PENDING')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PENDING'))
                    }}>
                        {translations[lang]['Pending']}
                    </div>
                    <div style={ viewStatus === 'PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PAID'))
                    }}>
                        {translations[lang]['Paid']}
                    </div>
                    <div style={ viewStatus === 'PARTIALLY-PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PARTIALLY-PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PARTIALLY_PAID'))
                    }}>
                        {translations[lang]['Partially Paid']}
                    </div>
                    <div style={ viewStatus === 'OVERDUE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('OVERDUE')
                        setSearchedInvoices(invoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !['PAID', 'REFUNDED'].includes(invoice.status)))
                    }}>
                        {translations[lang]['Overdue']}
                    </div>
                    <div style={ viewStatus === 'REFUNDED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('REFUNDED')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'REFUNDED'))
                    }}>
                        {translations[lang]['Refunded']}
                    </div>
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                searchedInvoices.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedInvoices.map(invoice => <InvoiceCard 
                        invoice={invoice} 
                        reload={reload} 
                        setReload={setReload} 
                        setTargetInvoice={setTargetInvoice}
                        setIsShowPayDebtForm={setIsShowPayDebtForm}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsShowRefundModal={setIsShowRefundModal}
                        setSelectedInvoices={setSelectedInvoices}
                        selectedInvoices={selectedInvoices}
                        isSelectMode={isSelectMode}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setIsShowForm} />
            }
        </div>
        
    </div>
}

export default InsuranceInvoicesPage
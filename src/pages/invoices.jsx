import { useState, useEffect } from 'react'
import './prescriptions.css'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import { serverRequest } from "../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../components/sections/page-header'
import AppointmentFormModal from '../components/modals/appointment-form'
import NavigationBar from '../components/navigation/navigation-bar';
import CircularLoading from '../components/loadings/circular';
import FiltersSection from '../components/sections/filters/filters'
import FloatingButton from '../components/buttons/floating-button'
import InvoiceCard from '../components/cards/invoice'
import EmptySection from '../components/sections/empty/empty'
import SearchInput from '../components/inputs/search'
import { searchAppointments } from '../utils/searches/search-appointments'
import { format } from 'date-fns'
import InvoiceFormModal from '../components/modals/invoice-form'

const InvoicesPage = () => {

    const [isShowForm, setIsShowForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showModalForm, setShowModalForm] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [searchedInvoices, setSearchedInvoices] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')
    const user = useSelector(state => state.user.user)

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => scroll(0,0), [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/invoices/clinics/${'6471132eed766b444dbaae78'}`, { params: statsQuery })
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


    return <div className="page-container">
        <NavigationBar pageName={'Invoices'} />
        { isShowForm ? <InvoiceFormModal setShowModalForm={setIsShowForm} /> : null }
        <div className="show-mobile">
            <FloatingButton setIsShowForm={setShowModalForm} />
        </div>
        <div className="padded-container">
            <PageHeader 
            pageName="Invoices" 
            setShowModalForm={setIsShowForm} 
            addBtnText={'Add Invoice'}
            setReload={setReload}
            reload={reload}
            /> 
            {/*<div className="cards-list-wrapper">
                <Card 
                icon={<CalendarMonthOutlinedIcon />}
                cardHeader={'All'}
                number={formatNumber(appointments.length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<UpcomingOutlinedIcon />}
                cardHeader={'Upcoming'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'UPCOMING').length)}
                iconColor={'#FF8C00'}
                />
                <Card 
                icon={<HourglassEmptyOutlinedIcon />}
                cardHeader={'Waiting'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'WAITING').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<MeetingRoomOutlinedIcon />}
                cardHeader={'Active'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'ACTIVE').length)}
                iconColor={'#5C60F5'}
                />
                <Card 
                icon={<CheckCircleOutlineOutlinedIcon />}
                cardHeader={'Done'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'DONE').length)}
                iconColor={'#00D4FF'}
                />
                <Card 
                icon={<CancelOutlinedIcon />}
                cardHeader={'Cancelled'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'CANCELLED').length)}
                iconColor={'#FF579A'}
                />
                <Card 
                icon={<TimerOffOutlinedIcon />}
                cardHeader={'Expired'}
                number={formatNumber(appointments.filter(appointment => appointment.status === 'EXPIRED').length)}
                iconColor={'#FF8C00'}
                />
        </div>*/}
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={true}
            defaultValue={'0'}
            />
            <div className="margin-top-1"></div>
            <div className="search-input-container">
                <SearchInput 
                rows={invoices} 
                setRows={setSearchedInvoices}
                searchRows={searchAppointments}
                />
            </div>
            <div className="appointments-categories-container">
                    <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                        setViewStatus('ALL')
                        setSearchedInvoices(invoices.filter(invoice => true))
                    }}>
                        All
                    </div>
                    <div style={ viewStatus === 'DRAFT' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('DRAFT')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'DRAFT'))
                    }}>
                        Draft
                    </div>
                    <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                        setViewStatus('PENDING')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PENDING'))
                    }}>
                        Pending
                    </div>
                    <div style={ viewStatus === 'PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PAID'))
                    }}>
                        Paid
                    </div>
                    <div style={ viewStatus === 'PARTIALLY-PAID' ? activeElementColor : null } onClick={e => {
                        setViewStatus('PARTIALLY-PAID')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'PARTIALLY_PAID'))
                    }}>
                        Partially Paid
                    </div>
                    <div style={ viewStatus === 'OVERDUE' ? activeElementColor : null } onClick={e => {
                        setViewStatus('OVERDUE')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'OVERDUE'))
                    }}>
                        Overdue
                    </div>
                    <div style={ viewStatus === 'REFUNDED' ? activeElementColor : null } onClick={e => {
                        setViewStatus('REFUNDED')
                        setSearchedInvoices(invoices.filter(invoice => invoice.status === 'REFUNDED'))
                    }}>
                        Refunded
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
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setShowModalForm} />
            }
        </div>
        
    </div>
}

export default InvoicesPage
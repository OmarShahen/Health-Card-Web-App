import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import CircularLoading from '../../components/loadings/circular';
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchInsurances } from '../../utils/searches/search-insurances'
import { format } from 'date-fns'
import InvoiceFormModal from '../../components/modals/invoice-form'
import PayDebtFormModal from '../../components/modals/pay-debt-form'
import InvoiceDeleteConfirmationModal from '../../components/modals/confirmation/invoice-delete-confirmation-modal';
import InvoiceRefundConfirmationModal from '../../components/modals/confirmation/invoice-refund-confirmation-modal';
import { isRolesValid } from '../../utils/roles';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../../utils/numbers'
import Card from '../../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import translations from '../../i18n'
import InsuranceCard from '../../components/cards/insurance';
import InsuranceFormModal from '../../components/modals/insurance-form';
import InsuranceDeleteConfirmationModal from '../../components/modals/confirmation/insurance-delete-confirmation-modal';


const InsurancesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowPayDebtForm, setIsShowPayDebtForm] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)


    const [targetInsurance, setTargetInsurance] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showFormModal, setShowFormModal] = useState(false)
    const [insurances, setInsurances] = useState([])
    const [searchedInsurances, setSearchedInsurances] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const todayDate = new Date()

    const [statsQuery, setStatsQuery] = useState({ specific: format(todayDate, 'yyyy-MM-dd') })

    useEffect(() => { 
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        let endpointURL = `/v1/insurances/owners/${user._id}`

        setIsLoading(true)
        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            setInsurances(response.data.insurances)
            setSearchedInsurances(response.data.insurances)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        <NavigationBar pageName={'Insurance Companies'} />
        { 
        isShowDeleteModal ? 
        <InsuranceDeleteConfirmationModal 
        insurance={targetInsurance}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        
        
        {
            user.roles.includes('STAFF') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setIsShowForm} />
            </div>
            :
            null
        }

        {
            showFormModal ? 
            <InsuranceFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setShowFormModal} 
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            insurance={targetInsurance}
            />
            :
            null
        }
        
        
        <div className="padded-container">
            <PageHeader 
            pageName={"Insurance Companies"} 
            setShowModalForm={setShowFormModal} 
            addBtnText={'Add Insurance Company'}
            setReload={setReload}
            reload={reload}
            /> 
            <div className="cards-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={'Insurance Companies'}
                number={formatNumber(insurances.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            
            <div className="search-input-container">
                <SearchInput 
                rows={insurances} 
                setRows={setSearchedInsurances}
                searchRows={searchInsurances}
                isHideClinics={user.roles.includes('STAFF') ? true : false}
                />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                searchedInsurances.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedInsurances.map(insurance => <InsuranceCard 
                        insurance={insurance} 
                        reload={reload} 
                        setReload={setReload} 
                        setTargetInsurance={setTargetInsurance}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setIsUpdate={setIsUpdate}
                        setShowFormModal={setShowFormModal}
                        />)}                    
                </div>
                :
                <EmptySection setIsShowForm={setIsShowForm} />
            }
        </div>
        
    </div>
}

export default InsurancesPage
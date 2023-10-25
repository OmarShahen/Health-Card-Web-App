import { useState, useEffect } from 'react'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import PageHeader from '../../components/sections/page-header'
import NavigationBar from '../../components/navigation/navigation-bar';
import CircularLoading from '../../components/loadings/circular'
import FloatingButton from '../../components/buttons/floating-button'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchInsurancePolicies } from '../../utils/searches/search-insurance-policies'
import { format } from 'date-fns'
import { isRolesValid } from '../../utils/roles'
import { useNavigate } from 'react-router-dom'
import { formatNumber } from '../../utils/numbers'
import Card from '../../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'
import InsurancePolicyCard from '../../components/cards/insurance-policy'
import InsurancePolicyFormModal from '../../components/modals/insurance-policy-form'
import InsurancePolicyDeleteConfirmationModal from '../../components/modals/confirmation/insurance-policy-confirmation-modal';
import InsurancePolicyStatusConfirmationModal from '../../components/modals/confirmation/insurance-policy-update-confirmation-modal';
import FiltersSection from '../../components/sections/filters/filters'

const InsurancePoliciesPage = ({ roles }) => {

    const navigate = useNavigate()

    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)


    const [targetInsurancePolicy, setTargetInsurancePolicy] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(1)
    const [showFormModal, setShowFormModal] = useState(false)
    const [insurancePolicies, setInsurancePolicies] = useState([])
    const [searchedInsurancePolicies, setSearchedInsurancePolicies] = useState([])
    const [viewStatus, setViewStatus] = useState('ALL')
    
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [statsQuery, setStatsQuery] = useState({})

    useEffect(() => { 
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {

        let endpointURL = `/v1/insurance-policies/owners/${user._id}`

        if(user.roles.includes('STAFF')) {
            endpointURL = `/v1/insurance-policies/clinics/${user.clinicId}`
        }

        setIsLoading(true)
        serverRequest.get(endpointURL, { params: statsQuery })
        .then(response => {
            setIsLoading(false)
            setInsurancePolicies(response.data.insurancePolicies)
            setSearchedInsurancePolicies(response.data.insurancePolicies)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload, statsQuery])


    return <div className="page-container">
        { 
        isShowDeleteModal ? 
        <InsurancePolicyDeleteConfirmationModal 
        insurancePolicy={targetInsurancePolicy}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        setViewStatus={setViewStatus}
        /> 
        : 
        null 
        }
        { 
        isUpdate ? 
        <InsurancePolicyStatusConfirmationModal 
        insurancePolicy={targetInsurancePolicy}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsUpdate}
        setViewStatus={setViewStatus}
        status={targetInsurancePolicy.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}
        /> 
        : 
        null 
        }
        
        {
            user.roles.includes('STAFF') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setShowFormModal} />
            </div>
            :
            null
        }

        {
            showFormModal ? 
            <InsurancePolicyFormModal 
            reload={reload} 
            setReload={setReload} 
            setShowFormModal={setShowFormModal} 
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            insurancePolicy={targetInsurancePolicy}
            />
            :
            null
        }
        
        
        <div className="padded-container">
            <PageHeader 
            pageName={translations[lang]["Insurance Policies"]} 
            addBtnText={user.roles.includes('STAFF') || user.roles.includes('OWNER') ? translations[lang]['Add Insurance Policy'] : null}
            setShowModalForm={setShowFormModal}
            setReload={setReload}
            reload={reload}
            /> 
            <div className="cards-list-wrapper">
                <Card 
                icon={<NumbersOutlinedIcon />}
                cardHeader={translations[lang]['Insurance Policies']}
                number={formatNumber(insurancePolicies.length)}
                iconColor={'#5C60F5'}
                />
            </div>
            <FiltersSection 
            statsQuery={statsQuery} 
            setStatsQuery={setStatsQuery} 
            isShowUpcomingDates={false}
            defaultValue={'LIFETIME'}
            />
            <div className="search-input-container">
                <SearchInput 
                rows={insurancePolicies} 
                setRows={setSearchedInsurancePolicies}
                searchRows={searchInsurancePolicies}
                isHideClinics={user.roles.includes('STAFF') ? true : false}
                />
            </div>
            
            {
                isLoading ?
                <CircularLoading />
                :
                searchedInsurancePolicies.length !== 0 ?
                <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedInsurancePolicies.map(insurancePolicy => <InsurancePolicyCard 
                        insurancePolicy={insurancePolicy} 
                        reload={reload} 
                        setReload={setReload} 
                        setTargetInsurancePolicy={setTargetInsurancePolicy}
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

export default InsurancePoliciesPage
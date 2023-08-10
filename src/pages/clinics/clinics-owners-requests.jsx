import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import { searchClinics } from '../../utils/searches/search-clinics'
import { serverRequest } from '../../components/API/request'
import ClinicRequestCard from '../../components/cards/clinic-request'
import PageHeader from '../../components/sections/page-header'
import ClinicRequestFormModal from '../../components/modals/clinic-request-form'
import RequestDeleteConfirmationModal from '../../components/modals/confirmation/request-delete-confirmtion-modal'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import FloatingButton from '../../components/buttons/floating-button'
import translations from '../../i18n'

const ClinicsOwnersRequestsPage = ({ roles }) => {

    const navigate = useNavigate()

    const activeElementColor = { border: '2px solid #4c83ee', color: '#4c83ee' }

    const [targetRequest, setTargetRequest] = useState({})
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)

    const [isShowForm, setIsShowForm] = useState(false)
    const [viewStatus, setViewStatus] = useState('ALL')
    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [requests, setRequests] = useState([])
    const [searchedRequests, setSearchedRequests] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics-requests/owners/${user._id}/owners`)
        .then(response => {
            setIsLoading(false)
            setRequests(response.data.clinicsRequests)
            setSearchedRequests(response.data.clinicsRequests)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        <PageHeader 
        pageName={translations[lang]["Owners Requests"]} 
        isHideBackButton={true} 
        setShowModalForm={setIsShowForm}
        addBtnText={translations[lang]['Invite Owner']}
        />
        {
            user.roles.includes('OWNER') || user.roles.includes('DOCTOR') ?
            <div className="show-mobile">
                <FloatingButton setIsShowForm={setIsShowForm} />
            </div>
            :
            null
        }
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Invitations']}
            number={formatNumber(requests.length)}
            iconColor={'#5C60F5'}
            />
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Accepted invitations']}
            number={formatNumber(requests.filter(request => request.status === 'ACCEPTED').length)}
            iconColor={'#5C60F5'}
            />
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Pending invitations']}
            number={formatNumber(requests.filter(request => request.status === 'PENDING').length)}
            iconColor={'#5C60F5'}
            />
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Rejected invitations']}
            number={formatNumber(requests.filter(request => request.status === 'REJECTED').length)}
            iconColor={'#5C60F5'}
            />
        </div>
        {
            isShowForm ?
            <ClinicRequestFormModal 
            reload={reload}
            setReload={setReload}
            role={'OWNER'}
            setShowModalForm={setIsShowForm}
            />
            :
            null
        }
        { 
        isShowDeleteModal ? 
        <RequestDeleteConfirmationModal 
        request={targetRequest}
        reload={reload}
        setReload={setReload} 
        setIsShowModal={setIsShowDeleteModal}
        /> 
        : 
        null 
        }
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                    <div className="search-input-container">
                        <SearchInput 
                        rows={requests} 
                        setRows={setSearchedRequests}
                        searchRows={searchClinics}
                        isHideClinics={true}
                        />
                    </div>
                    <div className="appointments-categories-container cards-list-wrapper">
                        <div style={ viewStatus === 'ALL' ? activeElementColor : null } onClick={e => {
                            setViewStatus('ALL')
                            setSearchedRequests(requests.filter(request => true))
                        }}>
                            {translations[lang]['All']}
                        </div>
                        <div style={ viewStatus === 'ACCEPTED' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('ACCEPTED')
                            setSearchedRequests(requests.filter(request => request.status === 'ACCEPTED'))
                        }}>
                            {translations[lang]['Accepted']}
                        </div>
                        <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('PENDING')
                            setSearchedRequests(requests.filter(request => request.status === 'PENDING'))
                        }}>
                            {translations[lang]['Pending']}
                        </div>
                        <div style={ viewStatus === 'REJECTED' ? activeElementColor : null } onClick={e => {
                            setViewStatus('REJECTED')
                            setSearchedRequests(requests.filter(request => request.status === 'REJECTED'))
                        }}>
                            {translations[lang]['Rejected']}
                        </div>
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedRequests.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedRequests.map(request => <ClinicRequestCard 
                        request={request} 
                        setReload={setReload} 
                        reload={reload}
                        isReceiverView={false}
                        isShowClinic={false}
                        setIsShowDeleteModal={setIsShowDeleteModal}
                        setTargetRequest={setTargetRequest}
                        />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsOwnersRequestsPage
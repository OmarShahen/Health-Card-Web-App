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


const ClinicsJoinRequestsPage = ({ roles }) => {

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

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics-requests/owners/${user._id}`)
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
        pageName="Requests" 
        isHideBackButton={true} 
        setShowModalForm={setIsShowForm}
        addBtnText={'Send Request'}
        />
        {
            isShowForm ?
            <ClinicRequestFormModal 
            reload={reload}
            setReload={setReload}
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
                            All
                        </div>
                        <div style={ viewStatus === 'ACCEPTED' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('ACCEPTED')
                            setSearchedRequests(requests.filter(request => request.status === 'ACCEPTED'))
                        }}>
                            Accepted
                        </div>
                        <div style={ viewStatus === 'PENDING' ?  activeElementColor : null } onClick={e => {
                            setViewStatus('PENDING')
                            setSearchedRequests(requests.filter(request => request.status === 'PENDING'))
                        }}>
                            Pending
                        </div>
                        <div style={ viewStatus === 'REJECTED' ? activeElementColor : null } onClick={e => {
                            setViewStatus('REJECTED')
                            setSearchedRequests(requests.filter(request => request.status === 'REJECTED'))
                        }}>
                            Rejected
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
                        isShowUser={true}
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

export default ClinicsJoinRequestsPage
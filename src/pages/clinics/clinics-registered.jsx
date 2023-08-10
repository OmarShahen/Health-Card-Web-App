import { useState, useEffect } from 'react'
import '../prescriptions.css'
import { serverRequest } from "../../components/API/request"
import { useSelector } from 'react-redux'
import CircularLoading from '../../components/loadings/circular'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { useNavigate } from 'react-router-dom'
import ClinicCard from '../../components/cards/clinic'
import { searchClinics } from '../../utils/searches/search-clinics'
import PageHeader from '../../components/sections/page-header'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'

const ClinicsRegisteredPage = ({ roles }) => {

    const navigate = useNavigate()

    const [reload, setReload] = useState(1)

    const [isLoading, setIsLoading] = useState(true)
    const [clinics, setClinics] = useState([])
    const [searchedClinics, setSearchedClinics] = useState([])

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    useEffect(() => {
        scroll(0,0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/clinics/doctors/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setClinics(response.data.clinics)
            setSearchedClinics(response.data.clinics)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div className="page-container">
        
        <PageHeader 
        pageName={translations[lang]['Registered']} 
        isHideBackButton={true} 
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Registered']}
            number={formatNumber(clinics.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                    <div className="search-input-container">
                        <SearchInput 
                        rows={clinics} 
                        setRows={setSearchedClinics}
                        searchRows={searchClinics}
                        isHideClinics={true}
                        />
                    </div>
                {
                    isLoading ?
                    <CircularLoading />
                    :
                    searchedClinics.length !== 0 ?
                    <div className="cards-grey-container cards-3-list-wrapper">
                        {searchedClinics.map(clinic => <ClinicCard clinic={clinic} setReload={setReload} reload={reload} disableOnClickView={true} />)}
                    </div>
                    :
                    <EmptySection />
                }
            </div>
        </div>
}

export default ClinicsRegisteredPage
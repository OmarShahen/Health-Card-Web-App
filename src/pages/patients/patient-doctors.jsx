import { useState, useEffect } from 'react'
import '../patient-medical.css'
import { serverRequest } from '../../components/API/request'
import CircularLoading from '../../components/loadings/circular'
import DoctorCard from '../../components/cards/doctor'
import EmptySection from '../../components/sections/empty/empty'
import SearchInput from '../../components/inputs/search'
import { searchDoctors } from '../../utils/searches/search-doctors'
import PageHeader from '../../components/sections/page-header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isRolesValid } from '../../utils/roles'
import Card from '../../components/cards/card'
import { formatNumber } from '../../utils/numbers'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import translations from '../../i18n'

const PatientDoctorsPage = ({ roles }) => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [reload, setReload] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [doctors, setDoctors] = useState([])
    const [searchedDoctors, setSearchedDoctors] = useState([])
    const [clinics, setClinics] = useState([])

    useEffect(() => {
        scroll(0, 0)
        isRolesValid(user.roles, roles) ? null : navigate('/login')
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/patients/${patientId}/doctors`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            setDoctors(data.doctors)
            setSearchedDoctors(data.doctors)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    return <div>
        <PageHeader 
        pageName={translations[lang]["Doctors"]}
        isHideBackButton={true}
        isHideRefresh={true}
        />
        <div className="cards-list-wrapper margin-bottom-1">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={translations[lang]['Doctors']}
            number={formatNumber(doctors.length)}
            iconColor={'#5C60F5'}
            />
        </div>
        <div>
            <div>
                <div>
                    <div className="search-input-container">
                        <SearchInput 
                        rows={doctors} 
                        setRows={setSearchedDoctors}
                        searchRows={searchDoctors}
                        isHideClinics={true}
                        isHideSpeciality={false}
                        isSpecialityNested={false}
                        />
                    </div>
                    {
                        isLoading ?
                        <CircularLoading />
                        :
                        searchedDoctors.length !== 0 ?
                        <div className="cards-grey-container cards-3-list-wrapper">
                            {searchedDoctors.map(doctor => <DoctorCard doctor={doctor} />)}
                        </div>
                        :
                        <EmptySection />
                    }
                </div> 
            </div>
        </div>
    </div>
}

export default PatientDoctorsPage
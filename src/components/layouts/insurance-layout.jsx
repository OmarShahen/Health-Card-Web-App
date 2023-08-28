import { useEffect, useState } from 'react'
import NavigationBar from '../navigation/navigation-bar'
import PageHeader from '../sections/page-header'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatNumber } from '../../utils/numbers'
import { serverRequest } from '../API/request'
import translations from '../../i18n'

const InsurancesLayout = ({ roles }) => {

    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const pagePath = window.location.pathname
    const insuranceCompanyId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [insurance, setInsurance] = useState()

    useEffect(() => {
        scroll(0,0)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/insurances/${insuranceCompanyId}`)
        .then(response => {
            setIsLoading(false)
            setInsurance(response.data.insurance)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])


    return <div className="page-container">
        <NavigationBar pageName={translations[lang]['Insurance']} />
        <div className="show-mobile">
        </div>
            <div className="padded-container">
                <PageHeader 
                pageName={!isLoading ? insurance.name : translations[lang]['Loading...']} 
                isHideRefresh={true} 
                />
                <div className="mini-page-navigator-container">
                    <ul>
                        <li><NavLink to={`/insurance-companies/${insuranceCompanyId}/invoices`}>{translations[lang]['Invoices']}</NavLink></li>
                        <li><NavLink to={`/insurance-companies/${insuranceCompanyId}/policies`}>{translations[lang]['Insurance Policies']}</NavLink></li> 
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
}

export default InsurancesLayout
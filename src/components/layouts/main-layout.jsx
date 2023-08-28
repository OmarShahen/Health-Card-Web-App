import { useState, useEffect } from 'react'
import { Outlet, useSearchParams } from "react-router-dom"
import SideBar from "../navigation/side-bar"
import './layout.css'
import { useDispatch, useSelector } from 'react-redux'
import FooterSection from '../sections/footers/footer'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import SuccessfulSignupModal from '../modals/successful-signup'


const MainLayout = () => {

    const dispatch = useDispatch()
    const sidebar = useSelector(state => state.sidebar)
    const user = useSelector(state => state.user.user)
    const lang = useSelector(state => state.lang.lang)

    const [searchParams, setSearchParams] = useSearchParams()
    const isUpgraded = searchParams.get('upgrade')

    const [isShowCelebration, setIsShowCelebration] = useState(user?.lastLoginDate  || isUpgraded || lang === 'ar' ? false : true)

    const [hideSideBar, setHideSideBar] = useState(false)

    const noSidebarStyle = { padding: window.innerWidth < 700 ? '0 .3rem' : '0 7rem' }

    useEffect(() => {

        const windowWidth = window.innerWidth


        if(windowWidth <= 950) {
            dispatch(setIsShowSidebar(false))
        }

        if(windowWidth <= 900) {
            setHideSideBar(true)
        }
        
      }, [])

    return <div className="main-layout-container">
        {
            isShowCelebration ?
            <SuccessfulSignupModal setIsShowModal={setIsShowCelebration} />
            :
            null
        }
             { 
             sidebar.isShowSidebar ? 
             <SideBar 
             width={'18vw'}
             isHideText={false} 
             setHideSideBar={setHideSideBar}
             />
             : 
             null 
             }
            <div className="page-main-container" style={sidebar.isShowSidebar ? { marginLeft: '19vw', paddingRight: '1rem' } : noSidebarStyle}>
                <Outlet />
                <FooterSection />
            </div>
    </div>
}

export default MainLayout
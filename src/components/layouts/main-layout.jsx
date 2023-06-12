import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import SideBar from "../navigation/side-bar"
import './layout.css'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'
import FooterSection from '../sections/footers/footer'

const MainLayout = () => {

    const dispatch = useDispatch()
    const sidebar = useSelector(state => state.sidebar)

    const noSidebarStyle = { marginLeft: '0', padding: '0 3rem' }

    useEffect(() => {

        const windowWidth = window.innerWidth

        if(windowWidth <= 600) {
            dispatch(setIsShowSidebar(false))
        }
        
      }, [])

    return <div className="main-layout-container">
             { sidebar.isShowSidebar ? <SideBar /> : null }
            <div className="page-main-container" style={sidebar.isShowSidebar ? { marginLeft: '16vw', paddingRight: '1rem' } : noSidebarStyle}>
                <Outlet />
                <FooterSection />
            </div>
    </div>
}

export default MainLayout
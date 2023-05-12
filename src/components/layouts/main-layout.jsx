import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom"
import SideBar from "../navigation/side-bar"
import './layout.css'
import { useSelector, useDispatch } from 'react-redux'
import { setIsShowSidebar } from '../../redux/slices/sidebarSlice'

const MainLayout = () => {

    const dispatch = useDispatch()
    const sidebar = useSelector(state => state.sidebar)

    useEffect(() => {

        const windowWidth = window.innerWidth

        if(windowWidth <= 600) {
            dispatch(setIsShowSidebar(false))
        }
        
      }, [])

    return <div className="main-layout-container">
             { sidebar.isShowSidebar ? <SideBar /> : null }
            <div style={sidebar.isShowSidebar ? { marginLeft: '14vw' } : { marginLeft: '0' }}>
                <Outlet />
            </div>
    </div>
}

export default MainLayout
import { useState } from 'react'
import OutputIcon from '@mui/icons-material/Output'
import CropDinIcon from '@mui/icons-material/CropDin'
import { formatNumber } from '../../../utils/numbers'
import './select.css'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'


const SelectSection = ({ selectedItems=[], setSelectedItems, isSelectMode, setIsSelectMode, rows }) => {

    const [isSelectAll, setIsSelectAll] = useState(false)

    return <div className="select-export-container">
        {
            isSelectMode ?
            <div 
            className="select-section-container body-text grey-text"
            onClick={e => {
                if(selectedItems.length === rows.length) {
                    setSelectedItems([])
                    return
                }
                setSelectedItems(rows)
                
            }}
            >
                <span className="hover">
                    { selectedItems.length === rows.length ? <CheckCircleIcon style={{color: 'green'}} /> : <CropDinIcon />}
                </span>
                <span>Select All</span>
            </div>
            :
            <button 
            className="normal-button action-color-bg white-text select-button"
            onClick={e => setIsSelectMode(true)}
            >
                <FactCheckOutlinedIcon />
                Start Selecting
            </button>
        }
        
        <div className="export-section-container">
            <div className="body-text grey-text">
                {formatNumber(selectedItems.length)} Selected | <span 
                onClick={e => {
                    setIsSelectMode(false)
                    setIsSelectAll(false)
                    setSelectedItems([])
                }} className="hover">Deselect</span>
            </div>
            <button className="normal-button action-color-bg white-text">
                <OutputIcon />
                Export
            </button>
        </div>
    </div>
}

export default SelectSection
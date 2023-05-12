import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import EncounterDocument from './encounter-document'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined'


const PrintEncounter = ({ encounter }) => {

    let componentRef = useRef()

    return (
        <div>
            <ReactToPrint
            trigger={() =><button className="action-button"><LocalPrintshopOutlinedIcon /><strong>Print Encounter</strong></button>}
            content={() => componentRef}
            />
            <div>
                <EncounterDocument encounter={encounter} ref={el => componentRef=el} />
            </div>
        </div>
    )
}

export default PrintEncounter
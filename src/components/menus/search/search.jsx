import './search.css'
import CloseIcon from '@mui/icons-material/Close'


const SearchMenu = ({ patients, setPatient, setPatients, setSearchName }) => {

    return <div className="search-menu-container">
        <div className="search-menu-header-container">
            <span>Patients</span>
            <div onClick={e => {
                setPatient()
                setSearchName()
                setPatients([])
            }}>
                <CloseIcon />
            </div>
        </div>
        <div className="search-list-container">
            <ul>
                {patients.map(patient => <li 
                onClick={e => { 
                    setPatient(patient) 
                    setSearchName(`${patient?.patient?.firstName} ${patient?.patient?.lastName ? patient?.patient?.lastName : ''}`)
                    setPatients([])
                }}
                className="search-list-item-container"
                >
                    <div>
                        <div className="image-container">
                            <img 
                            src={`https://avatars.dicebear.com/api/initials/${patient?.patient?.firstName}.svg`} 
                            alt="patient image" 
                            />
                        </div>
                        <div className="search-list-item-description">
                            <strong className="body-text">{`${patient?.patient?.firstName} ${patient?.patient?.lastName ? patient?.patient?.lastName : ''}`}</strong>
                            <span className="span-text bold-text">
                                {
                                    patient?.clinic ?
                                    `${patient?.clinic?.name}`
                                    :
                                    `+${patient?.patient?.countryCode}${patient?.patient?.phone}`
                                }
                                </span>
                        </div>
                    </div>
                </li>)}
            </ul>
        </div>
    </div>
}

export default SearchMenu
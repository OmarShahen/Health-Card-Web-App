import { format } from 'date-fns'

const DoctorCard = ({ doctor }) => {

    return <div className="doctor-card-container body-text">
        <div className="doctor-card-header">
            <div className="doctor-card-image-and-name">
                <img src={`https://avatars.dicebear.com/api/initials/${doctor.firstName} ${doctor.lastName}.svg`} />
                <div>
                    <strong>{`${doctor.firstName} ${doctor.lastName}`}</strong>
                    <br />
                    <span className="body-text grey-text">{`+${doctor.countryCode}${doctor.phone}`}</span>
                </div>
            </div>
            <span className="body-text grey-text">{format(new Date(doctor.createdAt), 'dd MMM yyyy')}</span>
        </div>
        <div className="doctor-card-body">
            <div className="instructions-codes-container">
                { doctor.speciality.map(special => <span className="status-btn pending">{special}</span>) }
            </div>
        </div>
    </div>
}

export default DoctorCard
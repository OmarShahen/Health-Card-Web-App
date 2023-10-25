import { useSelector } from 'react-redux'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import translations from '../../i18n'
import { formatPatientName } from '../../utils/formatString'


const Calender = ({ appointments, setTargetAppointment, setIsUpdate, setShowModalForm }) => {

    const localizer = momentLocalizer(moment)

    const lang = useSelector(state => state.lang.lang)

    const getBackgroundColor = (status) => {
        if(status === 'UPCOMING') {
            return '#4C83EE'
        } else if(status === 'WAITING') {
            return '#5C60F5'
        } else if(status === 'CANCELLED') {
            return '#DE350B'
        } else if(status === 'ACTIVE') {
            return '#20C997'
        } else if(status === 'EXPIRED') {
            return '#414552'
        } else if(status === 'DONE') {
            return '#3BB077'
        }
    }

    const formatAppointments = (appointments) => {
        appointments.forEach(appointment => {
            const title = formatPatientName(appointment)
            appointment.title = title
            appointment.start = new Date(appointment.reservationTime)
            let endDate = new Date(appointment.reservationTime)
            appointment.end = endDate.setHours(endDate.getHours() + 1)
        })

        return appointments
    }

    return <div>
            <Calendar
                localizer={localizer}
                events={formatAppointments(appointments)}
                onSelectEvent={event => {
                    setTargetAppointment(event)
                    setIsUpdate(true)
                    setShowModalForm(true)
                }}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 450 }}
                eventPropGetter={event => {
                    return { style: { backgroundColor: getBackgroundColor(event.status) } }
                }}
                messages={{
                    next: translations[lang]['next'],
                    previous: translations[lang]['previous'],
                    today: translations[lang]['today'],
                    month: translations[lang]['month'],
                    week: translations[lang]['week'],
                    day: translations[lang]['day'],
                    agenda: translations[lang]['agenda'],
                }}
                />            
    </div>
        
}

export default Calender
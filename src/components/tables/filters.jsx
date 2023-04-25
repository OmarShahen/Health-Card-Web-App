

const TableFilters = () => {

    return <div>
                <div className="category-search-container">
                    <span><SearchOutlinedIcon /></span>
                    <input 
                    type="search"
                    className="input"
                    placeholder="search appointments..."
                    onChange={e => setSearchedRows(appointments.filter(appointment => searchRows(appointment, e.target.value)))}
                    />
                </div>
                <div>
                    <span><ClassOutlinedIcon /></span>
                    <select 
                    name="appointment-types" 
                    id="appointment-types"
                    onChange={e => setSearchedRows(appointments.filter(appointment => {
                        if(appointment.status === e.target.value || e.target.value === 'ALL') {
                            return true
                        } 

                        return false
                    }))}
                    >
                        <option value="ALL">View All</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="WAITING">Waiting</option>
                        <option value="ACTIVE">Active</option>
                        <option value="DONE">Done</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
                <div>
                    <span><CalendarMonthOutlinedIcon /></span>
                    <select 
                    name="appointment-types" 
                    id="appointment-types"
                    >
                        <option value="day">Today</option>
                        <option value="week">Tommorow</option>
                        <option value="month">Waiting</option>
                        <option value="month">Active</option>
                        <option value="month">Done</option>
                        <option value="month">Cancelled</option>
                    </select>
                </div>
                <div onClick={e => setReload(reload+1)}>
                    <span className="reload-icon-container"><CachedOutlinedIcon /></span>
                </div>
    </div>
}

export default TableFilters
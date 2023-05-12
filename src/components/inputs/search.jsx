import SearchIcon from '@mui/icons-material/Search'
import './input.css'

const SearchInput = ({ rows, setRows, searchRows }) => {

    return <div className="table-search-input-container">
        <input 
        type="text" 
        className="form-input"
        placeholder="Search..."
        onChange={e => setRows(rows.filter(row => searchRows(row, e.target.value)))}
        />
    </div>
}

export default SearchInput
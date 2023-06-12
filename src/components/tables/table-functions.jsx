

const TableFunctions = ({ columns }) => {

    return <div>
        <div>
            <ul>
                {columns.map(column => <li>
                    {column.name}
                </li>)}
            </ul>
        </div>
        <div>

        </div>
    </div>
}

export default TableFunctions
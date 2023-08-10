import { format, formatDistance  } from 'date-fns'
import { useSelector } from 'react-redux'


const CardDate = ({ creationDate, updateDate }) => {

    const lang = useSelector(state => state.lang.lang)

    return <div className="card-date-container grey-text">
        <div>
            <span>{lang === 'en' ? format(new Date(creationDate), 'dd MMM yyyy') : format(new Date(creationDate), 'dd/MM/yyyy') }</span>
        </div>
        { lang === 'en' ?
            <div>
                {
                    !updateDate || new Date(creationDate).getTime() === new Date(updateDate).getTime() ?
                    <span>
                        {formatDistance(new Date(creationDate), new Date(), { addSuffix: true })}
                    </span>
                    :
                    <span>
                        last modified({formatDistance(new Date(updateDate), new Date(), { addSuffix: true })})
                    </span>
                }
            </div>
            :
            null
        }
    </div>
}

export default CardDate
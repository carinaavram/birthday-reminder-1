import classes from './BirthdayItem.module.css'

const BirthdayItem = (props) => {
    return (
        <li className={classes.birthday}>
            <div>
                <h3>{props.name}</h3>
                <div className={classes.date}>{props.date}</div>
                <div className={classes.gifts}>Gifts: {props.gifts}</div>
            </div>
        </li>
    )
}

export default BirthdayItem;
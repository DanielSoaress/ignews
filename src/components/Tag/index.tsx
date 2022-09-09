import styles from './styles.module.scss';

type TagProps = {
    value: string
}

export function Tag(props: TagProps) {
    const getTypeColor = (value) => {
        const type = value.toLowerCase();
        switch(type) {
            case 'html':
                return '#2B1725'
            case 'javascript':
                return '#2B2819';
            case 'css':
                return '#22142B';
            case 'react':
                return '#14122B';
            case 'vue':
                return '#142B10';
            default:
                return 'black';
        }
    }

    return (
        props.value ?
        <div
            className={styles.tagContainer}
            style={{backgroundColor: getTypeColor(props.value)}}
        >
            <span>{ props.value}</span>
        </div>
        : <></>
    )
}
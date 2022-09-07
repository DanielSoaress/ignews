import styles from './styles.module.scss';

type ButtonScrollTopProps = {
    show: boolean
}

export function ButtonScrollTop(props: ButtonScrollTopProps) {

    const scrollTop = function () {
        window.scrollTo(0, 0);
    };

    const isShow = function() {
        if(props.show) {
            return 'block';
        }
        return 'none';
    }

    return (
        <button style={{ display: isShow() }} className={styles.btnScrollTop} type="button" onClick={scrollTop}>
            <img src="/images/icons/arrow-up.svg" alt="search" />
        </button>
    )
}
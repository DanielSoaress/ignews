import styles from './styles.module.scss';

export function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.ldsEllipsis}>
                <div></div><div></div><div></div><div></div>
            </div>
        </div>
    );
}
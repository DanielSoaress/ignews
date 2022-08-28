import styles from './styles.module.scss';

export function SubscribeButton() {
    async function handleSubscribe() {
        console.log('handleSubscribe')
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Lorem ipsum

        </button>
    )
}
import styles from './styles.module.scss';

export function NotData() {
    return (
        <>
        <div className={styles.notData}>
            <img src="/images/icons/search.svg" alt="search" />
            <p >Sua pesquisa não encontrou nenhum documento correspondente.</p>
        </div>
    </>
    );
}
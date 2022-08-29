import { ActiveLink } from '../ActiveLink';
import styles from './styles.module.scss';
import Link from 'next/link';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <img src="/images/logo.svg" alt="lostCode" />
                </Link>
                <nav>
                    <ActiveLink href="/" activeClassName={styles.active}>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts" activeClassName={styles.active} prefetch>
                        <a>Posts</a>
                    </ActiveLink>
                </nav>
            </div>
        </header>
    );
}
import styles from './styles.module.scss';
import { useState } from 'react';

type SearchProps = {
    handleSearch: Function
}

export function Search(props: SearchProps) {
    const [search, setSearch] = useState('');

    const handleChange = (event) => {
        setSearch(event.target.value);
    }

    const handleSearch = () => {
        props.handleSearch(search);
    }
    
    return (
        <div
            className={styles.searchContainer}
        >
            <input type="text"
                value={search}
                onChange={handleChange}
                placeholder="Procurar..."
                aria-label="Procurar artigo"
             />
            <button type="button" onClick={handleSearch}>
                <img src="/images/icons/search.svg" alt="search" />
            </button>

        </div>
    )
}
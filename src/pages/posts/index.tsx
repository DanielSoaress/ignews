import { GetStaticProps } from 'next';
import { GET_STATIC_POST, LIST_POST_PRISMIC, PARAMS_DAFAULT_PRISMIC, SEARCH_LIST_POST_PRISMIC } from '../../services/prismic';
import { Search, ButtonScrollTop, Tag } from '../../components';
import { calcTimeOfRead, dateToPtbr, getImgUrl, getPreviewText, getTag, getTitle, getUid } from '../../helpers/util';
import styles from './styles.module.scss';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    tag: string;
    image: string;
    timeOfRead: string;
    updatedAt: string;
}

interface PostsProps {
    allPosts: Post[];
}

const handlerPosts = (posts) => {
    let countPost = 0;
    return posts.map(post => {
        countPost++;
        const isMultiple = countPost % PARAMS_DAFAULT_PRISMIC.pageSize === 0;

        return {
            slug: getUid(post),
            title: getTitle(post),
            excerpt: getPreviewText(post, isMultiple),
            image: getImgUrl(post),
            tag: getTag(post),
            timeOfRead: calcTimeOfRead(post),
            updatedAt: dateToPtbr(post.last_publication_date),
        }
    })
}

export default function Posts({ allPosts }: PostsProps) {
    const [currentPage, setCurrentPage] = useState(2);
    const [posts, setPosts] = useState(allPosts);
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const getMorePost = async () => {
        if (loadingSearch) return;

        let response = null;
        if (search) {
            response = await SEARCH_LIST_POST_PRISMIC({ currentPage }, search)
        } else {
            response = await LIST_POST_PRISMIC({ currentPage })
        }

        const postsResponse = handlerPosts(response.results);

        if (!response?.results_size) {
            setHasMore(false);
        } else {
            setCurrentPage(currentPage + 1);
            setPosts([...posts, ...postsResponse]);
        }
    };

    const searchPosts = async (searchText) => {
        setLoadingSearch(true);

        const response = await SEARCH_LIST_POST_PRISMIC({ currentPage: 1 }, searchText);
        const postsResponse = handlerPosts(response.results);

        setHasMore(!!response.results_size);
        setSearch(searchText);
        setCurrentPage(2);
        setPosts([...postsResponse]);
        setLoadingSearch(false);
    }

    const renderNotData = () => {
        if (!loadingSearch && !posts.length && !hasMore) {
            return (
                <>
                    <div className={styles.notData}>
                        <img src="/images/icons/search.svg" alt="search" />
                        <p >Sua pesquisa não encontrou nenhum documento correspondente.</p>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>Posts | lostCode</title>
            </Head>
            <main className={styles.container}>
                <ButtonScrollTop
                    show={posts.length > 4} />
                <div className={styles.posts}>
                    <Search
                        handleSearch={searchPosts}
                    />
                    {!loadingSearch ?
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={getMorePost}
                            hasMore={hasMore}
                            loader={<div className={styles.loadingContainer}><div className={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div></div>}
                        >
                            {
                                posts.map(post => (
                                    <div key={post.slug} className={styles.postContainer}>
                                        <div className={styles.imgContainer}>
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                layout="fill"
                                                objectFit="cover"
                                            >
                                            </Image>
                                        </div>
                                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                                            <a>
                                                <div className={styles.subTitle}>
                                                    <time>{post.updatedAt}</time>
                                                    <div>
                                                        <Image src="/images/icons/book.png" width={20} height={20} alt="livro aberto" />
                                                        <span>{post.timeOfRead} min</span></div>
                                                    <Tag value={post.tag}></Tag>
                                                </div>
                                                <strong>{post.title}</strong>
                                                <p>
                                                    {post.excerpt}
                                                </p>
                                            </a>
                                        </Link>
                                    </div>
                                ))
                            }
                        </InfiniteScroll>
                        :
                        <div className={styles.loadingContainer}>
                            <div className={styles.ldsEllipsis}>
                                <div></div><div></div><div></div><div></div>
                            </div>
                        </div>
                    }

                    {
                        renderNotData()
                    }

                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const response = GET_STATIC_POST();
    const allPosts = handlerPosts(response);

    return {
        props: {
            allPosts
        }
    }
}
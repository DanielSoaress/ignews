import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { api_id, GET_PRISMIC_CLIENT, LIST_POST_PRISMIC, PARAMS_DAFAULT_PRISMIC, SEARCH_LIST_POST_PRISMIC } from '../../services/prismic';
import { Search, ButtonScrollTop, Tag } from '../../components';
import { dateToPtbr, getImgUrl, getPreviewText, getTag, getTitle, getUid } from '../../helpers/util';
import styles from './styles.module.scss';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { RichText } from 'prismic-dom';


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

export const calcTimeOfRead = (post) => {
    const introduction = post.data.introduction;
    const image_banner = post.data.image_banner;

    const num_words = RichText.asText(introduction)?.split(' ').length;
    const num_imgs = 1;
    let height_imgs = 0;
    for (let i = 0; i < num_imgs; i++) {
        height_imgs += (i <= 9) ? 12 - i : 3;
    }
    const seconds = (num_words / 265 * 60) + height_imgs;
    return Math.round(seconds / 60);
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
                    show={posts.length > PARAMS_DAFAULT_PRISMIC.pageSize} />
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
    const prismic = GET_PRISMIC_CLIENT();

    const response = await prismic.query<any>(
        [Prismic.predicates.at('document.type', api_id.list_post)],
        {
            page: 1,
            fetch: PARAMS_DAFAULT_PRISMIC.fetch.split(','),
            pageSize: PARAMS_DAFAULT_PRISMIC.pageSize,
            orderings: `[document.${PARAMS_DAFAULT_PRISMIC.order} desc]`
        },
    )

    const allPosts = handlerPosts(response.results);

    return {
        props: {
            allPosts
        }
    }
}
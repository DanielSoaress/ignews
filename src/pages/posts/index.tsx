import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { api_id, GET_PRISMIC_CLIENT, LIST_POST_PRISMIC, PARAMS_DAFAULT_PRISMIC, SEARCH_LIST_POST_PRISMIC } from '../../services/prismic';
import { Search, ButtonScrollTop, NotData, Loading } from '../../components';
import { dateToPtbr, getImgUrl, getPreviewText, getTag, getTitle, getUid } from '../../helpers/util';
import styles from './styles.module.scss';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { PostCard } from '../../components/PostCard';

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
    const image_banner = !!post.data.image_banner ? 1 : 0;

    let num_words = RichText.asText(introduction)?.split(' ').length;
    let num_imgs = image_banner;
    

    post.data.content.map(el => {
        let img = !!el.image_content ? 1 : 0;
        let title =  RichText.asText(el.title).length;
        let content = RichText.asText(el.paragraph).length;

        num_imgs += img;
        num_words += title + content;
    })

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
            return <NotData/>
        }
    }

    return (
        <>
            <Head>
                <title>Posts | lostCode</title>
            </Head>
            <main className={styles.container}>
                <ButtonScrollTop
                    show={posts.length > PARAMS_DAFAULT_PRISMIC.pageSize}
                />
                <div className={styles.posts}>
                    <Search
                        handleSearch={searchPosts}
                    />
                    {!loadingSearch ?
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={getMorePost}
                            hasMore={hasMore}
                            loader={<Loading/>}
                        >
                            {
                                posts.map(post => (
                                    <PostCard
                                        key={post.slug}
                                        content={post}
                                    />
                                ))
                            }
                        </InfiniteScroll>
                        :
                        <Loading/>
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
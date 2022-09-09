import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient, listPostPrismic } from '../../services/prismic';
import { Search } from '../../components/Search';
import { ButtonScrollTop } from '../../components/ButtonScrollTop';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from 'next/image';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    updatedAt: string;
}

interface PostsProps {
    allPosts: Post[];
}

export default function Posts({ allPosts }: PostsProps) {
    const [currentPage, setCurrentPage] = useState(2);
    const [posts, setPosts] = useState(allPosts);
    const [search, setSearch] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);

    const pageSize = 4;
    const fetch = 'template-post.title,template-post.content,template-post.image';
    const q = '[at(document.type,"template-post")]';

    const getMorePost = async () => {
        if (loadingSearch) return;
        const params = { currentPage, pageSize, fetch, q };
        params.q += search ? '[fulltext(document,"' + search + '")]' : '';

        const response = await listPostPrismic(params);
        const postsResponse = handlerPosts(response.results);

        if (!response.results_size) {
            setHasMore(false);
        } else {
            setCurrentPage(currentPage + 1);
            setPosts([...posts, ...postsResponse]);
        }
    };

    const handlerPosts = (posts) => {
        let countPost = 0;
        return posts.map(post => {
            countPost++;
            const excerpt = post.data.content.find(content => content.type === 'paragraph')?.text ?? '';
            const isMultipleFour = countPost % 4 === 0;
            const previewText = isMultipleFour ? excerpt.slice(0, 600) : excerpt.slice(0, 200);
            return {
                slug: post.uid,
                title: RichText.asText(post.data.title),
                excerpt: excerpt.length > 200 ? `${previewText}...` : '',
                image: post.data.image.url ?? '',
                updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',
                    {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
            }
        })
    }

    const searchPosts = async (searchText) => {
        setLoadingSearch(true);
        const params = { currentPage: 1, pageSize, fetch, q };
        params.q += searchText ? '[fulltext(document,"' + searchText + '")]' : '';

        const response = await listPostPrismic(params);
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
                                                <time>{post.updatedAt}</time>
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
    const prismic = getPrismicClient();

    const response = await prismic.query<any>(
        [Prismic.predicates.at('document.type', 'template-post')],
        {
            fetch: ['template-post.title', 'template-post.content', 'template-post.image'],
            pageSize: 4,
            page: 1,
            orderings: '[document.first_publication_date desc]'
        },
    )

    let countPost = 0;
    const allPosts = response.results.map(post => {
        countPost++;
        const excerpt = post.data.content.find(content => content.type === 'paragraph')?.text ?? '';
        const isMultipleFour = countPost % 4 === 0;
        const previewText = isMultipleFour ? excerpt.slice(0, 600) : excerpt.slice(0, 200);
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: excerpt.length > 200 ? `${previewText}...` : '',
            image: post.data.image.url ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',
                {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
        }
    })

    return {
        props: {
            allPosts
        }
    }
}
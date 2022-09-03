import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient, listPostPrismic } from '../../services/prismic';

import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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
    const [hasMore, setHasMore] = useState(true);

    const getMorePost = async () => {
        const params = {
            currentPage,
            pageSize: 4,
            fetch: 'template-post.title,template-post.content,template-post.image',
            q: '[at(document.type,"template-post")]'
        }
        const response = await listPostPrismic(params);
        
        let countPost = 0;
        const postsResponse = response.results?.map(post => {
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
        if(!response.results_size){
            setHasMore(false);
        } else {
            setCurrentPage(currentPage + 1);
            setPosts([...posts, ...postsResponse]);
        }
    };

    return (
        <>
            <Head>
                <title>Posts | lostCode</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={getMorePost}
                        hasMore={hasMore}
                        loader={<div className={styles.loadingContainer}><div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div></div>}
                        endMessage={<div className={styles.loadingContainer}><div className={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div></div>}
                    >
                        {
                            posts.map(post => (
                                <div key={post.slug} className={styles.postContainer}>
                                    <img src={post.image} alt={post.image} />
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
        }
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
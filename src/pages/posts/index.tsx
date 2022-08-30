import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    updatedAt: string;
}
interface PostsProps {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | lostCode</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map(post => (
                            <div key={post.slug} className={styles.postContainer}>
                                <img src={post.image} alt={post.image}/>
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
            pageSize: 10,
        }
    )

    let countPost = 0;
    const posts = response.results.map(post => {
        countPost++;
        const excerpt = post.data.content.find(content => content.type === 'paragraph')?.text ?? '';
        const isMultipleFour = countPost%4 === 0;
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
            posts
        }
    }
}
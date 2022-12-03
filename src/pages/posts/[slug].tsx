import { GetServerSideProps } from "next";
import Head from "next/head";
import { dateToPtbr, getContent, getFooter, getImgUrl, getIntroduction, getTitle } from "../../helpers/util";
import { api_id, GET_PRISMIC_CLIENT } from "../../services/prismic";
import styles from './post.module.scss';

interface PostProps {
    post: {
        slug: string;
        title: string;
        introduction: string;
        content: Array<any>;
        image_banner: string;
        footer: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | lostCode</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <img src={post.image_banner} alt={post.title} />
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.introduction }} />

                    {post.content.map(content => (
                        <div key={post.title}>
                            <h3>{post.title}</h3>
                            <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: content.paragraph }} />
                        </div>
                    ))}

                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.footer }} />
                </article>
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const { slug } = params;

    const prismic = GET_PRISMIC_CLIENT(req);

    const response = await prismic.getByUID<any>(api_id.list_post, String(slug), {});

    const post = {
        slug,
        title: getTitle(response),
        introduction: getIntroduction(response),
        content: getContent(response),
        image_banner: getImgUrl(response),
        updatedAt: dateToPtbr(response.last_publication_date),
        footer: getFooter(response),
    }

    return {
        props: {
            post
        }
    }

}


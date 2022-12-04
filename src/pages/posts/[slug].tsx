import { GetServerSideProps } from "next";
import Head from "next/head";
import { dateToPtbr, getContent, getFooter, getImgUrl, getIntroduction, getKeywords, getPreviewText, getTitle } from "../../helpers/util";
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
        keywords: string;
        previewText: string;
    }
}

export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | lostCode</title>
                <meta name='description' content={post.previewText}/>
                <meta name='keywords' content={post.keywords}/>

            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <img className={post.image_banner} src={post.image_banner} alt={post.title} />
                    <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.introduction }} />

                    {post.content.map(content => (
                        <div key={content.title}>
                            <div>
                                <img src={content.image_content.url} height={content.image_content.dimensions.height} alt={content.image_content.alt} />
                                <p className={styles.caption}>{ content.image_content.alt }</p>
                            </div>
                            {content.title && <h4>{content.title}</h4>}
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
        keywords: getKeywords(response),
        previewText: getPreviewText(response),
    }

    return {
        props: {
            post
        }
    }

}


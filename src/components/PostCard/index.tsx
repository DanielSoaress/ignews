import Image from 'next/image';
import Link from 'next/link';
import { Tag } from '../Tag';
import styles from './styles.module.scss';

type PostCardProps = {
    content: {
        slug: string;
        title: string;
        excerpt: string;
        tag: string;
        image: string;
        timeOfRead: string;
        updatedAt: string;
    }
}


export function PostCard({ content }: PostCardProps) {
    const { slug, title, excerpt, tag, image, timeOfRead, updatedAt } = content;
    return (
        <div key={slug} className={styles.postContainer}>
            <div className={styles.imgContainer}>
                <Image
                    src={image}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                >
                </Image>
            </div>
            <Link href={`/posts/${slug}`} key={slug}>
                <a className={styles.linkContent}>
                    <div className={styles.subTitle}>
                        <time>{updatedAt}</time>
                        <div>
                            <Image src="/images/icons/book.png" width={20} height={20} alt="livro aberto" />
                            <span>{timeOfRead} min</span>
                        </div>
                        <Tag value={tag}></Tag>
                    </div>
                    <strong>{title}</strong>
                    <p>
                        {excerpt}
                    </p>
                </a>
            </Link>
        </div>
    );
}
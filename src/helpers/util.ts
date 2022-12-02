import { RichText } from 'prismic-dom';

export const calcTimeOfRead = (post) => {
    const num_words = RichText.asText(post.data.content)?.split(' ').length;
    const num_imgs = 1;
    let height_imgs = 0;
    for (let i = 0; i < num_imgs; i++) {
        height_imgs += (i <= 9) ? 12 - i : 3;
    }
    const seconds = (num_words / 265 * 60) + height_imgs;
    return Math.round(seconds / 60);
}

export const dateToPtbr = (date) => {
    return new Date(date).toLocaleDateString('pt-BR',
    {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

export const getTag = (post) => {
    return post.data?.tags ? RichText.asText(post.data.tags) : ''
}


export const getImgUrl = (post) => {
    return post.data.image.url ?? ''
}

export const getTitle = (post) => {
    return RichText.asText(post.data.title)
}

export const getUid = (post) => {
    return post.uid ?? ''
}

export const isToContinue = (text, limit = 200) => {
    return text.length > limit;
}

export const getPreviewText = (post, flag = false) => {
    const excerpt = post.data.introduction.find(content => content.type === 'paragraph')?.text ?? '';
    const toBeContinue = isToContinue(excerpt, 200) ? '...' : '';

    const previewText = flag ? excerpt.slice(0, 600) : excerpt.slice(0, 200);

   return `${previewText}${toBeContinue}`;
}

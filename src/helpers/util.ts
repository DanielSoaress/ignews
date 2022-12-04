import { RichText } from 'prismic-dom';

export const dateToPtbr = (date) => {
    return new Date(date).toLocaleDateString('pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
}

export const getTag = (post) => {
    return post.data?.tag ? RichText.asText(post.data.tag) : '';
}
  
export const getImgUrl = (post) => {
    return post.data.image_banner.url ?? '';
}

export const getTitle = (post) => {
    return RichText.asText(post.data.title);
}

export const getIntroduction = (post) => {
    return RichText.asHtml(post.data.introduction) ?? '';
}

export const getFooter = (post) => {
    return RichText.asHtml(post.data.footer) ?? '';
}

export const getKeywords = (post) => {
    return post.data.keywords ?? '';
}

export const getContent = (post) => {
    const content = post.data.content;
    return content.map(el => {
        return {
            ...el,
            paragraph: RichText.asHtml(el.paragraph) ?? '',
            title: RichText.asText(el.title) ?? '',
        }
    });
}

export const getUid = (post) => {
    return post.uid ?? '';
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

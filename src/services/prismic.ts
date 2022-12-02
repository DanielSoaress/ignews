import Prismic from '@prismicio/client'
import { env } from '../../env';

const PRISMIC_END_PONT = env.PRISMIC_END_PONT;
const ACCESS_TOKEN = encodeURIComponent(env.PRISMIC_ACCESS_TOKEN);

type Params = {
    currentPage: number;
    pageSize?: number;
    fetch?: string;
    q?: string;
}

export const api_id = {
    list_post: 'blog-post',
};

const blog_post = ['title', 'image_banner', 'introduction', 'tag', 'is_published', 'publication_date']

export const PARAMS_DAFAULT_PRISMIC = {
        pageSize:  4,
        fetch: getFetchByFieldName(blog_post, api_id.list_post),
        q: `[at(document.type,"${api_id.list_post}")]`,
        order: 'last_publication_date',

} 

export function GET_PRISMIC_CLIENT(req?: unknown) {
    return Prismic.client(
        process.env.PRISMIC_END_PONT,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )
}

async function GET_REF() {
    try {
        const URL_GET_REF = `${PRISMIC_END_PONT}?access_token=${ACCESS_TOKEN}`
        const response = await fetch(URL_GET_REF)
            .then((response) => response.json());
        return encodeURIComponent(response.refs[0].ref);
    } catch (error) {
        console.log('GET_REF', error);
        return false;
    }
}

export async function LIST_POST_PRISMIC(data?: Params) {
    const ref = await GET_REF();
    if(!ref) {
        return false;
    } 

    try {
        const params =  {
            q: getQueryEncoded(PARAMS_DAFAULT_PRISMIC.q),
            fetch: getFetchEncoded(PARAMS_DAFAULT_PRISMIC.fetch),
            order: getOrderEncoded(PARAMS_DAFAULT_PRISMIC.order),
            pageSize: `pageSize=${PARAMS_DAFAULT_PRISMIC.pageSize}`,
            page: `page=${data.currentPage}`,
            ref: `ref=${ref}`
        }
    
        const response = await fetch(toMountUrl(params)).then((response) => response.json());
        return response;
    } catch (error) {
        console.log('LIST_POST_PRISMIC', error);
        return false
    }
}

export async function SEARCH_LIST_POST_PRISMIC(data: Params, search: string) {
    const ref = await GET_REF();
    if(!ref) {
        return false;
    } 

    try {
        const params =  {
            q: getQueryEncoded(PARAMS_DAFAULT_PRISMIC.q, search),
            fetch: getFetchEncoded(PARAMS_DAFAULT_PRISMIC.fetch),
            order: getOrderEncoded(PARAMS_DAFAULT_PRISMIC.order),
            pageSize: `pageSize=${PARAMS_DAFAULT_PRISMIC.pageSize}`,
            page: `page=${data.currentPage}`,
            ref: `ref=${ref}`
        }

        const response = await fetch(toMountUrl(params)).then((response) => response.json());
        return response;
    } catch (error) {
        console.log('SEARCH_LIST_POST_PRISMIC', error);
        return false
    }
}

export const toMountUrl = (params) => {
    const accessToken = `access_token=${ACCESS_TOKEN}`;
    const urlBase = `${PRISMIC_END_PONT}/documents/search?${params.ref}&${accessToken}`;
    const urlParams = `&${params.q}&${params.fetch}&${params.pageSize}&${params.page}&${params.order}`;
    return urlBase + urlParams;
}

export const getQueryEncoded = (q: string, search = '') => {
    if(search) {
        search = '[fulltext(document,"' + search + '")]';
    }

    return "q=" + encodeURIComponent(`[${q}${search}]`);
}

export const getFetchEncoded = (fetch: string) => {
    return  encodeURIComponent(`fetch=[${fetch}]`);
}

export const getOrderEncoded = (order = 'last_publication_date') => {
    return `orderings=${encodeURIComponent(`[document.${order} desc]`)}`;
}

function getFetchByFieldName(field_name = [], id) {
    let fetch = '';
    field_name.forEach(f => {
        fetch = `${fetch},${id}.${f}`;
    })
    return fetch;
}

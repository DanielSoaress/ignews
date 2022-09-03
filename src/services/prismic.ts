import Prismic from '@prismicio/client'
import { env } from '../../env';

const PRISMIC_END_PONT = env.PRISMIC_END_PONT;
const ACCESS_TOKEN = encodeURIComponent(env.PRISMIC_ACCESS_TOKEN);

type Params = {
    currentPage: number;
    pageSize: number;
    fetch: string;
    q: string;
}

export function getPrismicClient(req?: unknown) {
    return Prismic.client(
        process.env.PRISMIC_END_PONT,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )
}

async function getRef() {
    try {
        console.log(ACCESS_TOKEN)
        const responseRef = await fetch(`${PRISMIC_END_PONT}?access_token=${ACCESS_TOKEN}`)
            .then((response) => response.json());
        return encodeURIComponent(responseRef.refs[0].ref);
    } catch (error) {
        console.log('getRef', error);
        return false;
    }
}

export async function listPostPrismic(data?: Params) {
    try {
        const q = encodeURIComponent(`q=[${data.q}]`);
        const fetchParams = encodeURIComponent(`fetch=[${data.fetch}]`);
        const pageSize = `pageSize=${data.pageSize}`;
        const page = `page=${data.currentPage}`;

        const resp = await getRef();
        if(!resp) return false;
        const ref = encodeURIComponent(resp);

        const url = `${PRISMIC_END_PONT}/documents/search?ref=${ref}&access_token=${ACCESS_TOKEN}&${q}&${fetchParams}&${pageSize}&${page}`;
        const response = await fetch(url).then((response) => response.json());
        return response;
    } catch (error) {
        console.log('listPostPrismic', error);
        return false
    }
}
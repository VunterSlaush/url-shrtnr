import { getUrlBySlug, trackUrl } from "@repo/api-client";
import { headers } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";

const getUrl = async (slug: string) => {
    const response = await getUrlBySlug({
        path: {
            slug: slug,
        },
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    });
    return response.data;
}


const trackVisit = async (urlId: string) => {
    try {
        const allHeaders = await headers();

        trackUrl({
            path: {
                urlId: urlId,
            },
            headers: Object.fromEntries(allHeaders),
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
        });
    } catch {
        // Do nothing
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const data = await getUrl(slug);

    if (!data) {
        notFound(); // <-- forces the 404 page

    } else {
        trackVisit(data.id);

        const url = data.url;

        if (url.includes("http://")) {

            redirect(data.url, RedirectType.replace);
        }
        else if (url.includes("https://")) {
            redirect(data.url, RedirectType.replace);
        }
        else {
            redirect(`https://${url}`, RedirectType.replace);
        }

    }


}
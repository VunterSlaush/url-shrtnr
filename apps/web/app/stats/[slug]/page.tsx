import { getUrlAnalytics, getUrlBySlug } from "@repo/api-client";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isLoggedIn } from "../../user";
import { TopBar, TopPie, VisitsPerDay } from "@repo/ui";
import { getTopByProperty } from "./stats";

const getUrl = async (slug: string) => {
    const response = await getUrlBySlug({
        path: {
            slug: slug,
        },
        baseUrl: process.env.NEXT_PUBLIC_API_URL,

    });

    console.log(response.data);
    return response.data;
}

const getData = async (urlId: string, from?: string, to?: string) => {
    const allHeaders = await headers();
    const response = await getUrlAnalytics({
        path: {
            urlId: urlId,
        },
        query: {
            from: from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || "",
            to: to || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] || "",
        },
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: Object.fromEntries(allHeaders),
    });
    return response.data;
}




export default async function Page({
    params,
    searchParams
}: {
    params: { slug: string },
    searchParams: { from?: string, to?: string }
}) {
    const { slug } = await params;
    const { from, to } = await searchParams;

    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        redirect('/');
    }

    const url = await getUrl(slug);

    if (!url) {
        notFound();
    }

    const data = await getData(url.id, from, to);


    if (!data || data.success === false || !data.data) {
        notFound(); // <-- forces the 404 page
    } else {
        const analytics = data.data;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen w-full py-16 sm:py-14 md:py-12 px-4 md:px-8 lg:px-32 xl:px-64 gap-2">
                <h1 className="text-2xl font-bold text-white">Your URL Analytics from last 30 days</h1>
                <h2 className="text-lg font-bold text-white mb-4">Slug: {url.slug}</h2>
                <VisitsPerDay data={analytics} />
                <div className="flex flex-row  justify-center gap-2 w-full">
                    <TopPie data={getTopByProperty(analytics, 'operatingSystem')} title="Top Operating Systems" />
                    <TopPie data={getTopByProperty(analytics, 'deviceType')} title="Top Device Types" />
                </div>
                <div className="flex flex-row  justify-center gap-2 w-full">
                    <TopBar data={getTopByProperty(analytics, 'browser')} title="Top Browsers" />
                    <TopBar data={getTopByProperty(analytics, 'referrerDomain')} title="Top Referrer Domains" />
                </div>
            </div>
        );
    }
}
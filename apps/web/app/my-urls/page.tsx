import { getUrlsByUser, Url } from "@repo/api-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isLoggedIn } from "../user";
import Link from "next/link";
import { UrlList } from "../components/UrlList";


const getUrls = async (): Promise<Url[]> => {
    const allHeaders = await headers();
    const response = await getUrlsByUser({
        headers: Object.fromEntries(allHeaders),
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    });
    return response.data || [];
}



export default async function Page() {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        redirect('/');
    }

    try {
        const urls = await getUrls();

        return (
            <div className="flex flex-col items-center justify-center min-h-screen min-w-1/2 py-24 sm:py-14 md:py-12 px-4 md:px-8 lg:px-32 xl:px-64">
                <h1 className="text-2xl font-bold text-white mb-8">My URLs</h1>

                {urls.length === 0 ? (
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-white text-lg">You haven&apos;t created any URLs yet :(</p>
                        <Link
                            href="/"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Create Your First URL
                        </Link>
                    </div>
                ) : (
                    <UrlList initialUrls={urls} />
                )}
            </div>
        )
    } catch (error) {
        return <div>Error: {(error as Error).message} </div>;
    }
}

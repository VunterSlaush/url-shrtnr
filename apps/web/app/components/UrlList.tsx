'use client';

import { UrlItem } from "@repo/ui";
import { deleteUrl, Url } from "@repo/api-client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface UrlListProps {
    initialUrls: Url[];
}

export const UrlList = ({ initialUrls }: UrlListProps) => {
    const [urls, setUrls] = useState<Url[]>(initialUrls);

    const onDelete = async (url: Url) => {
        if (confirm(`Are you sure you want to delete the URL ${url.slug}?`)) {
            const response = await deleteUrl({
                path: {
                    id: url.id
                },
                baseUrl: process.env.NEXT_PUBLIC_API_URL,
                credentials: "include",
            })
            if (response.data?.success) {
                setUrls(urls.filter((u) => u.id !== url.id));
            } else {
                toast.error("Failed to delete URL");
            }
        }
    }

    const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
            {urls.map((url) => (
                <UrlItem key={url.id} url={url} onDelete={onDelete} currentDomain={currentDomain} />
            ))}
        </div>
    )
}


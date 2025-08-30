"use client";

import React, { useState } from 'react';

import { CreateUrlDto, Url, createUrl } from '@repo/api-client';

import { Loader } from '@repo/ui';
import { toast } from 'react-hot-toast';
import { toErrorString } from './utils';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon, WhatsappShareButton
} from 'react-share';

const URL_VALIDATION_REGEX = /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))(:\d+)?(\/[^\s]*)?$/i;

interface Props {
    className?: string;
}

export const ShortenerForm: React.FC<Props> = ({ className }) => {

    const [url, setUrl] = useState('');
    const [validUrl, setValidUrl] = useState(false);
    const [loading, setLoading] = useState(false);
    const [slug, setSlug] = useState('');
    const [urlCreated, setUrlCreated] = useState<string>("");

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        setSlug(value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const body: CreateUrlDto = {
                url: url,
            }

            if (slug && slug.length > 0) {
                body.slug = slug;
            }

            const result = await createUrl({
                body,
                baseUrl: process.env.NEXT_PUBLIC_API_URL,
                credentials: "include",
            });

            if (result.data) {
                onSuccess(result.data);
            } else {
                toast.error(toErrorString(result.error));
            }
        } catch (error) {
            toast.error(toErrorString(error));
        } finally {
            setLoading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidUrl(isUrlValid(e.target.value));
        setUrl(e.target.value);
    };

    const isUrlValid = (url: string) => {
        return URL_VALIDATION_REGEX.test(url);
    };

    const onSuccess = (data: Url) => {
        const currentDomain = window.location.origin;
        const shortUrl = `${currentDomain}/${data.slug}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shortUrl).then(() => {
            toast.success(`Shortened URL copied to clipboard: ${shortUrl}`);
        }).catch(() => {
            toast.success(`Shortened URL: ${shortUrl}`);
        });

        setUrl('');
        setSlug('');
        setUrlCreated(shortUrl);
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(urlCreated).then(() => {
            toast.success('URL copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy URL');
        });
    }

    return (
        <div key={"shortenerForm"} className={`flex flex-col items-center justify-center text-black gap-4 min-h-[30rem] pb-10 px-4 sm:px-6 md:px-8 ${className || ''}`}>
            {loading ? <Loader /> :
                <>
                    <h2 className="text-2xl font-bold">Shorten your URL</h2>
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        <input
                            type="url"
                            placeholder="Enter your URL here..."
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={url}
                            onChange={handleUrlChange}
                        />
                        <input
                            type="text"
                            placeholder="Enter your custom slug here (optional)"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={slug}
                            onChange={handleSlugChange}
                            maxLength={8}
                        />

                        <button
                            type="button"
                            disabled={!validUrl}
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:shadow-none disabled:hover:scale-100 cursor-pointer active:scale-95 active:shadow-inner"
                        >
                            Shorten URL
                        </button>
                    </div>
                    {urlCreated && (
                        <div className="flex flex-col gap-4 w-full max-w-md text-center">
                            <p>Successs! Here is your shortened URL:</p>
                            <button
                                onClick={handleCopyToClipboard}
                                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-300 hover:bg-green-200 transition-colors duration-200 cursor-copy font-mono text-sm break-all"
                            >
                                {urlCreated}
                            </button>
                            <p>Share it with your friends!</p>
                            <div className="flex flex-row gap-2 justify-center">
                                <FacebookShareButton url={urlCreated} ><FacebookIcon round className="sm:w-16 sm:h-16 w-12 h-12" /></FacebookShareButton>
                                <TwitterShareButton url={urlCreated} ><TwitterIcon round className="sm:w-16 sm:h-16 w-12 h-12" /></TwitterShareButton>
                                <WhatsappShareButton url={urlCreated} ><WhatsappIcon round className="sm:w-16 sm:h-16 w-12 h-12" /></WhatsappShareButton>
                                <EmailShareButton url={urlCreated} ><EmailIcon round className="sm:w-16 sm:h-16 w-12 h-12" /></EmailShareButton>
                                <TelegramShareButton url={urlCreated} ><TelegramIcon round className="sm:w-16 sm:h-16 w-12 h-12" /></TelegramShareButton>
                            </div>
                        </div>
                    )}
                </>
            }
        </div>
    );

};

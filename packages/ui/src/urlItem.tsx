'use client';
import React from 'react';
import { Window } from './window';

export interface Url {
    id: string;
    slug: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    userId?: string;
}

interface UrlItemProps {
    url: Url;
    onDelete: (url: Url) => void;
    currentDomain: string;
}

export const UrlItem: React.FC<UrlItemProps> = ({ url, onDelete, currentDomain }) => {

    return (
        <Window key={url.id}>
            <div className="ui:flex ui:flex-col ui:items-start ui:text-black ui:text-left ui:py-4 ui:px-4">
                <div className="ui:flex ui:justify-between ui:items-start ui:w-full">
                    <div className="ui:flex-1">
                        <a href={`${currentDomain}/${url.slug}`} key={url.id} className="ui:text-lg ui:font-semibold ui:text-blue-600 ui:hover:text-blue-800">{currentDomain}/{url.slug}</a>
                        <div className="ui:text-sm ui:text-left">URL:
                            <a
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ui:inline ui:text-sm ui:text-blue-600 ui:hover:text-blue-800 ui:underline ui:hover:no-underline ui:transition-colors ui:duration-200 ui:ml-1"
                                title={url.url}
                            >
                                {url.url.length > 40 ? `${url.url.substring(0, 40)}...` : url.url}
                            </a>
                        </div>
                    </div>
                    <div className="ui:flex ui:space-x-0 ui:ml-2">
                        <a
                            className="ui:p-2 ui:text-gray-600 ui:hover:text-blue-600 ui:transition-colors ui:duration-200 ui:cursor-pointer"
                            href={`/stats/${url.slug}`}
                        >
                            <svg className="ui:w-6 ui:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </a>
                        <button
                            className="ui:p-2 ui:text-gray-600 ui:hover:text-red-600 ui:transition-colors ui:duration-200 ui:cursor-pointer"
                            onClick={() => onDelete(url)}
                        >
                            <svg className="ui:w-6 ui:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Window>
    );
};

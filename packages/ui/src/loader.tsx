import React, { useEffect, useState } from 'react';

const LoadingMessages = [
    'Loading...',
    'Downloading RAM...',
    'Negotiating...',
    'Converting bits..',
    'Shortening URLs..',
    'Compressing...',
    'Almost done...',
    'Just a moment...',
    'Still loading...',
];

export function Loader() {

    const [loadingMessage, setLoadingMessage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (loadingMessage >= LoadingMessages.length - 1) {
                setLoadingMessage(0);
            } else {
                setLoadingMessage(loadingMessage + 1);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [loadingMessage]);

    return (
        <div className="ui:flex ui:items-center ui:justify-center ui:w-full ui:h-auto">
            <div className="ui:relative ui:flex ui:items-center ui:justify-center">
                <p className="ui:text-blue-600 ui:text-xl ui:font-bold">{LoadingMessages[loadingMessage]}</p>
                <div className={`ui:animate-ping ui:rounded-full ui:border-2 ui:border-blue-600 ui:h-54 ui:w-54 ui:absolute ui:animation-delay-0`}></div>
                <div className={`ui:animate-ping ui:rounded-full ui:border-2 ui:border-blue-600 ui:h-42 ui:w-42 ui:absolute ui:animation-delay-200`}></div>
                <div className={`ui:animate-ping ui:rounded-full ui:border-2 ui:border-blue-600 ui:h-32 ui:w-32 ui:absolute ui:animation-delay-200`}></div>
                <div className={`ui:animate-ping ui:rounded-full ui:border-2 ui:border-blue-600 ui:h-22 ui:w-22 ui:absolute ui:animation-delay-400`}></div>
            </div>
        </div>
    );
};

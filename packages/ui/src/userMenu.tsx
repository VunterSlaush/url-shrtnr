'use client'

import React, { useState, useRef, useEffect } from 'react';

interface UserMenuProps {
    userName: string;
    avatarUrl: string;
    onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ userName, avatarUrl, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);


    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="ui:relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="ui:flex ui:items-center ui:space-x-2 ui:p-1 ui:rounded-full hover:ui:bg-gray-100 ui:transition-colors ui:duration-200"
            >
                <span className="ui:text-md">{userName}</span>
                <img
                    src={avatarUrl}
                    alt={`${userName}'s avatar`}
                    className="ui:w-12 ui:h-12 ui:rounded-full ui:object-cover"
                />
            </button>

            {/* Floating Menu */}
            {isOpen && (
                <div className="ui:absolute ui:right-0 ui:top-full ui:mt-2 ui:w-48 ui:bg-white ui:rounded-md ui:shadow-lg ui:ring-1 ui:ring-black ui:ring-opacity-5 ui:z-50">
                    <div className="ui:py-1">
                        {/* User Info */}
                        <div className="ui:px-4 ui:py-2 ui:border-b ui:border-gray-100">
                            <div className="ui:flex ui:items-center ui:space-x-2">
                                <img
                                    src={avatarUrl}
                                    alt={`${userName}'s avatar`}
                                    className="ui:w-6 ui:h-6 ui:rounded-full ui:object-cover"
                                />
                                <span className="ui:text-sm ui:font-medium ui:text-gray-900 ui:truncate">
                                    {userName}
                                </span>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <a
                            href={'/my-urls'}
                            className="ui:block ui:w-full ui:text-left ui:px-4 ui:py-2 ui:text-sm ui:text-gray-700 hover:ui:bg-gray-100 ui:transition-colors ui:duration-200"
                        >
                            My URLs
                        </a>

                        <button
                            onClick={onLogout}
                            className="ui:block ui:w-full ui:text-left ui:px-4 ui:py-2 ui:text-sm ui:text-gray-700 hover:ui:bg-gray-100 ui:transition-colors ui:duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

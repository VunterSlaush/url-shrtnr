'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Window } from '../window';

export interface TopBarItem {
    name: string;
    value: number;
}

interface TopBarProps {
    data: TopBarItem[];
    title: string;
    className?: string;
}


export const TopBar: React.FC<TopBarProps> = ({
    data,
    title,
    className = '',
}) => {

    if (data.length === 0) {
        return (
            <Window className={className}>
                <h1 className="ui:text-2xl ui:font-bold ui:text-blue-800 ui:mb-4 ui:text-center ui:pt-2">{title}</h1>
                <div className="ui:flex ui:items-center ui:justify-center ui:h-64 ui:text-gray-500 ui:bg-gray-50 ui:rounded-lg">
                    <p>No data available</p>
                </div>
            </Window>
        );
    }



    return (
        <Window className={className}>
            <h1 className="ui:text-2xl ui:font-bold ui:text-blue-800 ui:mb-4 ui:text-center ui:pt-2">{title}</h1>
            <div className="ui:w-full ui:h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <YAxis
                            dataKey="value"
                            type="number"
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <XAxis
                            type="category"
                            dataKey="name"
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#374151' }}
                            formatter={(value: number, name: string) => [value, name]}
                        />
                        <Bar
                            dataKey="value"
                            fill="#8884d8"
                            radius={[0, 4, 4, 0]}
                            barSize={20}

                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Window>
    );
};

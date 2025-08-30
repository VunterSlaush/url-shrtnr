
'use client';
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Window } from '../window';

export interface VisitItem {
    createdAt: string;
}

interface VisitsPerDayProps {
    data: VisitItem[];
    className?: string;
}

interface ChartDataPoint {
    date: string;
    visits: number;
}

export const VisitsPerDay: React.FC<VisitsPerDayProps> = ({ data, className = '' }) => {
    const chartData = useMemo(() => {
        // Group visits by day and count them
        const visitsByDay = new Map<string, number>();

        data.forEach(item => {
            const date = new Date(item.createdAt);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format

            if (dateKey) {
                visitsByDay.set(dateKey, (visitsByDay.get(dateKey) || 0) + 1);
            }
        });

        // Convert to array and sort by date
        const sortedData: ChartDataPoint[] = [];
        for (const [date, visits] of visitsByDay.entries()) {
            sortedData.push({
                date: new Date(date).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric'
                }),
                visits
            });
        }

        // Sort by date
        sortedData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedData;
    }, [data]);

    if (chartData.length === 0) {
        return (
            <Window className={className}>
                <h1 className="ui:text-2xl ui:font-bold ui:text-blue-800 ui:mb-4 ui:text-center ui:pt-2">Visits Per Day</h1>
                <div className="ui:flex ui:items-center ui:justify-center ui:h-64 ui:text-gray-500 ui:bg-gray-50 ui:rounded-lg">
                    <p>No data available</p>
                </div>
            </Window>
        );
    }

    return (
        <Window className={className}>

            <h1 className="ui:text-2xl ui:font-bold ui:text-blue-800 ui:mb-4 ui:text-center ui:pt-2">Visits Per Day</h1>
            <div className="ui:w-full ui:h-56 ui:p-1">
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={12}

                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => value.toString()}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#374151' }}

                        />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Window>
    );
};

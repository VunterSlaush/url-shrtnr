'use client';
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Window } from '../window';

export interface TopItem {
    name: string;
    value: number;
}

interface TopPieProps {
    data: TopItem[];
    title: string;
    className?: string;
    topCount?: number;
}

interface ChartDataPoint {
    name: string;
    value: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export const TopPie: React.FC<TopPieProps> = ({
    data,
    title,
    className = '',
    topCount = 8
}) => {
    const chartData = useMemo(() => {
        // Count occurrences of each name
        const nameCounts = new Map<string, number>();

        data.forEach(item => {
            if (item.name) {
                nameCounts.set(item.name, (nameCounts.get(item.name) || 0) + 1);
            }
        });

        // Convert to array, sort by count (descending), and take top items
        const sortedData: ChartDataPoint[] = Array.from(nameCounts.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, topCount);

        return sortedData;
    }, [data, topCount]);

    if (chartData.length === 0) {
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
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
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
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value, entry, index) => (
                                <span style={{ color: COLORS[index % COLORS.length] }}>
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Window>
    );
};

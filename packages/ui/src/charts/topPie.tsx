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

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

export const TopPie: React.FC<TopPieProps> = ({
    data,
    title,
    className = '',
}) => {



    return (
        <Window className={className}>
            <h1 className="ui:text-2xl ui:font-bold ui:text-blue-800  ui:text-center ui:pt-2">{title}</h1>
            <div className="ui:w-full ui:h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"

                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

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

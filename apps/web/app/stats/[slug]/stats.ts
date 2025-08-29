import { UrlTracking } from "@repo/api-client";

export const getTopByProperty = (analytics: UrlTracking[], property: keyof UrlTracking) => {
    const topMap = analytics.reduce((acc, item) => {
        if (item[property]) {
            acc[item[property]] = (acc[item[property]] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(topMap).map(([name, value]) => ({ name, value }));
}

export const getVisitsPerDay = (analytics: UrlTracking[]) => {
    const visitsPerDay = analytics.reduce((acc, item) => {
        const date = new Date(item.createdAt);
        const dateKey = date.toISOString().split('T')[0];
        if (dateKey) {
            acc[dateKey] = (acc[dateKey] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(visitsPerDay).map(([date, value]) => ({ date, value }));
}
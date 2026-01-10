"use client";

import { ActivityCalendar, type ThemeInput } from "react-activity-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapProps {
    data: Array<{ date: string; count: number; level: number }>;
}

const theme: ThemeInput = {
    dark: ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353'], 
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] 
};

export function ActivityHeatmap({ data }: HeatmapProps) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Ensure full year
    const fullData = [...data];
    const startDateStr = oneYearAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    if (!fullData.some(d => d.date === startDateStr)) {
        fullData.push({ date: startDateStr, count: 0, level: 0 });
    }
    if (!fullData.some(d => d.date === endDateStr)) {
        fullData.push({ date: endDateStr, count: 0, level: 0 });
    }

    return (
        <Card className="border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-[var(--text-primary)]">Contribution Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-start p-6 overflow-x-auto">
                <div className="min-w-[600px] w-full">
                    <ActivityCalendar 
                        data={fullData}
                        theme={theme}
                        colorScheme="dark"
                        blockSize={12}
                        blockMargin={4}
                        fontSize={12}
                        showWeekdayLabels
                        labels={{
                            legend: {
                                less: 'Less',
                                more: 'More',
                            },
                            months: [
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ],
                            totalCount: '{{count}} snippets in the last year',
                            weekdays: [
                                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
                            ]
                        }}
                        blockRadius={2}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

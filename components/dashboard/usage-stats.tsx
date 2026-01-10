"use client";

import { ActivityCalendar, type ThemeInput } from "react-activity-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Layers, Trophy } from "lucide-react";

interface StatsProps {
    stats: {
        totalSnippets: number;
        mostActiveTech: string;
        streak: number;
        heatmapData: Array<{ date: string; count: number; level: number }>;
    }
}

const theme: ThemeInput = {
    dark: ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353'], // GitHub dark mode colors
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] 
};

export function UsageStats({ stats }: StatsProps) {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Ensure the calendar spans the full year by adding start/end dates if missing
    const fullData = [...stats.heatmapData];
    const startDateStr = oneYearAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    // Note: react-activity-calendar sorts data automatically.
    if (!fullData.some(d => d.date === startDateStr)) {
        fullData.push({ date: startDateStr, count: 0, level: 0 });
    }
    if (!fullData.some(d => d.date === endDateStr)) {
        fullData.push({ date: endDateStr, count: 0, level: 0 });
    }

  return (
    <div className="space-y-6 mb-8">
        {/* Cards Grid */}
        <div className="grid gap-4 md:grid-cols-3">
            <StatsCard 
                title="Total Snippets" 
                value={stats.totalSnippets} 
                icon={<Layers className="h-4 w-4 text-blue-500" />} 
            />
            <StatsCard 
                title="Current Streak" 
                value={`${stats.streak} Days`} 
                icon={<Flame className="h-4 w-4 text-orange-500" />} 
            />
            <StatsCard 
                title="Top Technology" 
                value={stats.mostActiveTech} 
                icon={<Trophy className="h-4 w-4 text-yellow-500" />} 
            />
        </div>

        {/* Heatmap */}
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
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <Card className="border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
            </CardContent>
        </Card>
    )
}

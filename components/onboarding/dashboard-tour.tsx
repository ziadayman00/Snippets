"use client";

import { useEffect } from "react";
import { driver } from "driver.js"; 
import "driver.js/dist/driver.css";

export function DashboardTour() {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("snippets-tour-dashboard");
        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            steps: [
                { 
                    popover: { 
                        title: "Welcome to Snippets! 👋", 
                        description: "Let's take a quick tour of your new highly-efficient knowledge base." 
                    } 
                },
                { 
                    element: "#dashboard-quick-create", 
                    popover: { 
                        title: "Quick Create", 
                        description: "Found something cool? Save it instantly here. Just paste and save." 
                    } 
                },
                { 
                    element: "#dashboard-stats", 
                    popover: { 
                        title: "Your Activity", 
                        description: "Track your consistency with the Contribution Graph. Keep the streak alive!" 
                    } 
                },
                { 
                    element: "#dashboard-review", 
                    popover: { 
                        title: "Spaced Repetition", 
                        description: "The core feature. This card tells you what you're about to forget. Click it to review and retain knowledge forever." 
                    } 
                },
                { 
                    element: "#dashboard-collections", 
                    popover: { 
                        title: "Collections", 
                        description: "Group snippets into 'Courses'. Use the 'Learn' mode to study them sequentially." 
                    } 
                },
                { 
                    element: "#dashboard-ask", 
                    popover: { 
                        title: "AI Assistant", 
                        description: "Forget how you solved that bug? Ask your snippets. The AI searches your code semantically." 
                    } 
                },
            ],
            onDestroyStarted: () => {
                // If user clicks close or finishes
                localStorage.setItem("snippets-tour-dashboard", "true");
                driverObj.destroy();
            },
        });

        // Small delay to ensure DOM is fully ready
        const timer = setTimeout(() => {
             driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return null;
}

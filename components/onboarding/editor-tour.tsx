"use client";

import { useEffect } from "react";
import { driver } from "driver.js"; 
import "driver.js/dist/driver.css";

export function EditorTour() {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("snippets-tour-editor");
        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            steps: [
                 { 
                    popover: { 
                        title: "Editor Mode 📝", 
                        description: "This is where you craft your snippets. Everything saves automatically." 
                    } 
                },
                { 
                    element: "#editor-title", 
                    popover: { 
                        title: "Identify It", 
                        description: "Give your snippet a clear, descriptive title to make it easy to find later via AI search." 
                    } 
                },
                { 
                    element: "#editor-tags", 
                    popover: { 
                        title: "Tag It", 
                        description: "Add tags (e.g. 'hooks', 'auth') to categorize your knowledge." 
                    } 
                },
                 { 
                    element: "#editor-area", 
                    popover: { 
                        title: "Rich Editor", 
                        description: "This is a full rich-text environment. Write notes, paste code blocks, or add instructions comfortably." 
                    } 
                },
                { 
                    element: "#editor-save", 
                    popover: { 
                        title: "Save Changes", 
                        description: "Don't forget to save! Changes are NOT auto-saved. Click here to update your snippet." 
                    } 
                },
            ],
            onDestroyStarted: () => {
                localStorage.setItem("snippets-tour-editor", "true");
                driverObj.destroy();
            },
        });

        const timer = setTimeout(() => {
             driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return null;
}

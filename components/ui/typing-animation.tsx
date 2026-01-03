"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  className?: string; // Additional classes for the text
  cursorClassName?: string; // Additional classes for the cursor
  typingSpeed?: number; // Speed in ms per character
  startDelay?: number; // Delay before starting in ms (after visibility)
  hideCursorOnComplete?: boolean; // Whether to hide cursor after typing finishes
}

export function TypingAnimation({
  text,
  className,
  cursorClassName,
  typingSpeed = 50,
  startDelay = 200,
  hideCursorOnComplete = false,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasRun) {
          setHasRun(true);
          setTimeout(() => setStarted(true), startDelay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasRun, startDelay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        if (!hasRun) {
            // This case might need handling if we want to support reset, 
            // but for now hasRun is for the *start* trigger.
        }
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [started, text, typingSpeed]);

  return (
    <span ref={elementRef} className={cn("inline-block", className)}>
      {displayedText}
      {(!hideCursorOnComplete || (displayedText.length < text.length)) && (
        <span
          className={cn(
            "inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle animate-pulse",
            cursorClassName
          )}
        />
      )}
    </span>
  );
}

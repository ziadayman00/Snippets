"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ConditionalNavbarProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export function ConditionalNavbar({ user, onSignOut }: ConditionalNavbarProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href?: string }[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Hide navbar on editor pages
  const isEditorPage = pathname.includes("/edit/") || pathname.endsWith("/new") || (pathname.startsWith("/plans/") && pathname.split("/").length > 2);
  
  // Fetch user role
  useEffect(() => {
    async function fetchUserRole() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (data && !error) {
        setUserRole(data.role);
      }
    }
    fetchUserRole();
  }, [user.id, pathname]); // Re-fetch when pathname changes (after redirect from Stripe)
  
  useEffect(() => {
    // Generate breadcrumbs based on pathname
    const generateBreadcrumbs = () => {
      const crumbs: { label: string; href?: string }[] = [];
      
      // Technology pages
      if (pathname.startsWith("/technology/")) {
        const parts = pathname.split("/");
        if (parts.length >= 3) {
          // Get technology name from URL or page title
          const techId = parts[2];
          // We'll show the ID for now, but ideally this would be fetched
          crumbs.push({ label: "Technology", href: "/dashboard" });
        }
      }
      // Collections
      else if (pathname.startsWith("/collections")) {
        crumbs.push({ label: "Collections" });
      }
      // Ask AI
      else if (pathname === "/ask") {
        crumbs.push({ label: "Ask AI" });
      }
      // Review
      else if (pathname === "/review") {
        crumbs.push({ label: "Review" });
      }
      // Stats
      else if (pathname === "/stats") {
        crumbs.push({ label: "Stats" });
      }
      // Tags
      else if (pathname.startsWith("/tags/")) {
        const tagName = pathname.split("/")[2];
        crumbs.push({ label: decodeURIComponent(tagName) });
      }
      
      setBreadcrumbs(crumbs);
    };
    
    generateBreadcrumbs();
  }, [pathname]);
  
  if (isEditorPage) {
    return null;
  }
  
  return <Navbar user={user} userRole={userRole || undefined} onSignOut={onSignOut} breadcrumbs={breadcrumbs} />;
}

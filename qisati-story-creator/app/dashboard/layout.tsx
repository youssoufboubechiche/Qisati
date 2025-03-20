"use client";

import type React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Home,
  PenLine,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if the current path matches the nav item path or is a subpath
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#faf8f5]">
          <Sidebar className="border-r border-orange-200">
            <SidebarHeader className="border-b border-orange-200 px-6 py-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/Qisati.png"
                  alt="Qisati Logo"
                  width={120}
                  height={40}
                />
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-4 py-6">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.label}
                      className="h-12 rounded-xl text-lg font-medium data-[active=true]:bg-red-500 data-[active=true]:text-white"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-6 w-6" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-orange-200 p-4">
              <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-orange-100">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>KD</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-base font-medium">Khalid Doe</p>
                  <p className="truncate text-sm text-muted-foreground">
                    parent@example.com
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-red-500 hover:bg-red-100"
                  onClick={() => router.push("/")}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1">
            <header className="flex h-16 items-center gap-4 border-b border-orange-200 bg-white px-6 lg:h-[70px]">
              <SidebarTrigger className="h-10 w-10 rounded-full text-red-500 hover:bg-red-100" />
              <div className="w-full flex-1">
                <h1 className="text-2xl font-bold text-red-500">
                  {navItems.find((item) => isActive(item.href))?.label ||
                    "Dashboard"}
                </h1>
              </div>
            </header>
            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Create Story",
    href: "/dashboard/create",
    icon: PenLine,
  },
  {
    label: "My Stories",
    href: "/dashboard/stories",
    icon: BookOpen,
  },
  {
    label: "Friends' Stories",
    href: "/dashboard/community",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

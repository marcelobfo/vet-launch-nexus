import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDarkTheme: boolean) => void;
}

export function NavBar({ isDarkTheme, setIsDarkTheme }: NavBarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userEmail = localStorage.getItem("userEmail") || "Usuário";

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("companyCode");

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });

    navigate('/login');
  };

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-semibold">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/pricing" className="hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="/blog" className="hover:underline underline-offset-4">
              Blog
            </Link>
            <Link href="/docs" className="hover:underline underline-offset-4">
              Docs
            </Link>
          </nav>
          <ModeToggle isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userEmail}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {localStorage.getItem("companyCode") || "Empresa"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Dashboard
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Icons.menu className="h-5 w-5 rotate-90 sm:rotate-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="sm:top-20 sm:h-[calc(100vh-80px)]">
              <div className="grid gap-4 py-4">
                <Link href="/" className="flex items-center space-x-2 font-medium">
                  <Icons.logo className="h-4 w-4" />
                  <span>{siteConfig.name}</span>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" className="w-full justify-start">
                    Pricing
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" className="w-full justify-start">
                    Blog
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="ghost" className="w-full justify-start">
                    Docs
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

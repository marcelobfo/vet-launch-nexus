
import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { UserCircle, LogOut, Sun, Moon, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

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

  const ModeToggle = ({ isDarkTheme, setIsDarkTheme }: { isDarkTheme: boolean; setIsDarkTheme: (value: boolean) => void }) => {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        aria-label="Toggle theme"
      >
        {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    );
  };

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white font-bold">V</div>
          <span className="font-semibold">Vet Pro 360</span>
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/pricing" className="hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link to="/blog" className="hover:underline underline-offset-4">
              Blog
            </Link>
            <Link to="/docs" className="hover:underline underline-offset-4">
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
                <Menu className="h-5 w-5 rotate-90 sm:rotate-0" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="sm:top-20 sm:h-[calc(100vh-80px)]">
              <div className="grid gap-4 py-4">
                <Link to="/" className="flex items-center space-x-2 font-medium">
                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">V</div>
                  <span>Vet Pro 360</span>
                </Link>
                <Link to="/pricing">
                  <Button variant="ghost" className="w-full justify-start">
                    Pricing
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="ghost" className="w-full justify-start">
                    Blog
                  </Button>
                </Link>
                <Link to="/docs">
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


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock } from "lucide-react";

interface PasswordProtectionProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children, enabled = true }) => {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    // Verifica se há uma senha ou se a proteção está desativada
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        // Se não estiver protegido ou não tiver senha configurada, desbloqueia
        if (!enabled || !config.adminPassword) {
          setIsLocked(false);
          return;
        }
        
        // Verifica se já está autenticado na sessão
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
          setIsLocked(false);
          return;
        }
        
        // Se chegou aqui, está bloqueado e precisa de senha
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Erro ao verificar proteção por senha:", error);
        setIsLocked(false); // Em caso de erro, desbloqueie para evitar problemas
      }
    } else {
      // Se não há configuração, desbloqueia
      setIsLocked(false);
    }
  }, [enabled]);
  
  const handlePasswordSubmit = () => {
    const storedConfig = localStorage.getItem('siteConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        if (passwordInput === config.adminPassword) {
          // Senha correta
          setIsLocked(false);
          setIsDialogOpen(false);
          sessionStorage.setItem('adminAuthenticated', 'true');
          toast({
            title: "Acesso desbloqueado",
            description: "Bem-vindo ao painel administrativo.",
          });
        } else {
          // Senha incorreta
          toast({
            title: "Senha incorreta",
            description: "Por favor, tente novamente.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao verificar senha:", error);
      }
    }
    setPasswordInput("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };
  
  // Fix: Ensure that closing the dialog doesn't allow access when locked
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    // If dialog is being closed and still locked, show it again
    if (!open && isLocked) {
      setTimeout(() => setIsDialogOpen(true), 100);
    }
  };
  
  if (!enabled) return <>{children}</>;
  
  return (
    <>
      {isLocked ? (
        <div className="flex items-center justify-center min-h-screen bg-vet-dark p-4">
          <div className="text-center">
            <Lock className="w-16 h-16 mx-auto text-vet-accent mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Área Protegida</h2>
            <p className="text-gray-400 mb-4">Esta área requer autenticação.</p>
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="bg-vet-secondary hover:bg-vet-secondary/90"
            >
              Desbloquear Acesso
            </Button>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="bg-vet-primary/95 text-white border-vet-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Área Protegida</DialogTitle>
            <DialogDescription className="text-gray-300">
              Insira a senha para acessar o painel administrativo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Lock className="text-vet-accent h-5 w-5" />
              <Input
                type="password"
                placeholder="Senha de acesso"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-white/10 border-white/20 text-white"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handlePasswordSubmit} 
                className="bg-vet-accent hover:bg-vet-accent/90 text-white"
              >
                Desbloquear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PasswordProtection;

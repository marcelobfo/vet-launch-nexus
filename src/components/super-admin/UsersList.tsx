
import React from 'react';
import { User, X, Check } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UsersListProps {
  companyUsers: any[];
  onToggleUserStatus: (userId: string, currentStatus: boolean) => void;
}

const UsersList: React.FC<UsersListProps> = ({ companyUsers, onToggleUserStatus }) => {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuário</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cargo</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="p-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {companyUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-800/20">
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700">
                      <User className="h-4 w-4 text-gray-300" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="text-sm">{user.role}</div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <Badge className={user.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleUserStatus(user.id, user.is_active)}
                  >
                    {user.is_active ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Ativar
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;


import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { FacebookCampaign } from '@/hooks/useFacebookCampaign';

interface CampaignsTableProps {
  campaigns: FacebookCampaign[];
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
  formatNumber: (value: number) => string;
}

const CampaignsTable: React.FC<CampaignsTableProps> = ({
  campaigns,
  formatCurrency,
  formatDate,
  formatNumber
}) => {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-600">Ativa</Badge>;
      case 'paused':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-500">Pausada</Badge>;
      case 'completed':
        return <Badge variant="secondary">Concluída</Badge>;
      case 'archived':
        return <Badge variant="destructive">Arquivada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCampaignIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <span className="text-blue-500">FB</span>;
      case 'instagram':
        return <span className="text-pink-500">IG</span>;
      case 'both':
        return <span>FB/IG</span>;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableCaption>Lista de campanhas do Facebook/Instagram</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plataforma</TableHead>
          <TableHead>Período</TableHead>
          <TableHead>Investimento</TableHead>
          <TableHead>Alcance</TableHead>
          <TableHead>Conversões</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
            <TableCell className="whitespace-nowrap">
              <div className="flex items-center gap-1">
                {getCampaignIcon(campaign.platform)}
                <span className="text-xs text-gray-400 ml-1">
                  {campaign.platform === 'both' 
                    ? 'FB/IG' 
                    : campaign.platform === 'facebook' 
                      ? 'Facebook' 
                      : 'Instagram'}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs">
                  {formatDate(campaign.start_date)}
                  {campaign.end_date ? ` - ${formatDate(campaign.end_date)}` : ''}
                </span>
              </div>
            </TableCell>
            <TableCell>{formatCurrency(campaign.spent)}</TableCell>
            <TableCell>{formatNumber(campaign.reach)}</TableCell>
            <TableCell>{formatNumber(campaign.conversions)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CampaignsTable;

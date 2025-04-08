
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedSettingsProps {
  dbConfig: {
    tablePrefix: string;
    charset: string;
    collation: string;
  };
  handleChange: (field: string, value: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ dbConfig, handleChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tablePrefix">Prefixo das Tabelas</Label>
          <Input
            id="tablePrefix"
            value={dbConfig.tablePrefix}
            onChange={(e) => handleChange('tablePrefix', e.target.value)}
            placeholder="vp_"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="charset">Charset</Label>
          <Select
            value={dbConfig.charset}
            onValueChange={(value) => handleChange('charset', value)}
          >
            <SelectTrigger id="charset">
              <SelectValue placeholder="Selecione o charset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utf8mb4">utf8mb4</SelectItem>
              <SelectItem value="utf8">utf8</SelectItem>
              <SelectItem value="latin1">latin1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="collation">Collation</Label>
        <Select
          value={dbConfig.collation}
          onValueChange={(value) => handleChange('collation', value)}
        >
          <SelectTrigger id="collation">
            <SelectValue placeholder="Selecione a collation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</SelectItem>
            <SelectItem value="utf8mb4_general_ci">utf8mb4_general_ci</SelectItem>
            <SelectItem value="utf8_unicode_ci">utf8_unicode_ci</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdvancedSettings;

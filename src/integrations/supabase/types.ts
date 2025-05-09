export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string
          company_id: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          is_used: boolean | null
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          is_used?: boolean | null
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "access_codes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_codes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_leads: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          created_at: string | null
          id: string
          lead_id: string
          opened_at: string | null
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          lead_id: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string
          opened_at?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          company_id: string
          content: string
          created_at: string | null
          id: string
          name: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string | null
          id?: string
          name: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          allow_signup: boolean | null
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          smtp_from: string | null
          smtp_host: string | null
          smtp_pass: string | null
          smtp_port: number | null
          smtp_user: string | null
          webhook_url: string | null
          whatsapp_webhook_url: string | null
        }
        Insert: {
          allow_signup?: boolean | null
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          smtp_from?: string | null
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          webhook_url?: string | null
          whatsapp_webhook_url?: string | null
        }
        Update: {
          allow_signup?: boolean | null
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          smtp_from?: string | null
          smtp_host?: string | null
          smtp_pass?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          webhook_url?: string | null
          whatsapp_webhook_url?: string | null
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          company_id: string
          content: Json
          created_at: string | null
          id: string
          published: boolean | null
          slug: string
          template_id: string | null
          title: string
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          company_id: string
          content: Json
          created_at?: string | null
          id?: string
          published?: boolean | null
          slug: string
          template_id?: string | null
          title: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          company_id?: string
          content?: Json
          created_at?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          template_id?: string | null
          title?: string
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_pages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_pages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company_id: string
          created_at: string | null
          custom_fields: Json | null
          email: string
          id: string
          landing_page_id: string | null
          name: string | null
          phone: string | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          custom_fields?: Json | null
          email: string
          id?: string
          landing_page_id?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          custom_fields?: Json | null
          email?: string
          id?: string
          landing_page_id?: string | null
          name?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          start_date: string | null
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          start_date?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string
          created_at: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          role: string
          whatsapp: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          role?: string
          whatsapp?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          role?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_with_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_with_users: {
        Row: {
          allow_signup: boolean | null
          code: string | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          smtp_from: string | null
          smtp_host: string | null
          smtp_pass: string | null
          smtp_port: number | null
          smtp_user: string | null
          users: Json | null
          webhook_url: string | null
          whatsapp_webhook_url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

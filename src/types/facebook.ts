
export interface FacebookConfig {
  id?: string;
  company_id: string;
  app_id: string;
  app_secret: string;
  access_token: string;
  pixel_id: string;
  ad_account_id: string;
  enable_tracking: boolean;
  advanced_matching: boolean;
  campaign_id?: string;
  is_connected: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TutorialStep {
  title: string;
  content: string;
}

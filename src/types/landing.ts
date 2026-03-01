export interface HtmlBlock {
  id: string;
  name: string;
  html: string;
}

export interface LandingPageData {
  companyName: string;
  tagline: string;
  blocks: HtmlBlock[];
}

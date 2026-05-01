export interface ForgeryDetection {
  class_id: number;
  class_name: string;
  category: string;
  confidence: number;
  status: 'pass' | 'fail' | 'conditional';
  x: number;
  y: number;
  w: number;
  h: number;
  source_region?: { x: number; y: number; w: number; h: number };
}

export interface ForgeryPage {
  file_name: string;
  link?: string;
  Category_ID: string;
  category_labels: string[];
  detections: ForgeryDetection[];
  yaml: string;
  page: number; // normalized on ingest (array index)
}

export interface ForgeryFileResult {
  fileName: string;
  link: string;       // stable HTTP URL to the file on the server
  totalPages: number;
  pages: ForgeryPage[];
}

export interface ForgeryApiResponse {
  results: Array<Omit<ForgeryFileResult, 'pages'> & { pages: Omit<ForgeryPage, 'page'>[] }>;
}

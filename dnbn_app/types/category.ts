export interface FileItem {
  originalName: string;
  fileUrl: string;
  order: number;
}

export interface FileMasterResponse {
  files: FileItem[];
}

export interface CategoryResponse {
  categoryIdx: number;
  categoryNm: string;
  fileMasterResponse: FileMasterResponse;
  isActive: boolean;
}

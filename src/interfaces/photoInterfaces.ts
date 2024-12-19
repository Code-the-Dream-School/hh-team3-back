export interface UploadOptions {
  folder: "avatars" | "covers";
  width: number;
  height: number;
}

export interface UploadResult {
  public_id: string;
  url: string;
  secure_url: string;
}

export interface UploadResponse {
  uploadResult: UploadResult;
  optimizeUrl: string;
  cropUrl: string;
}

export type StegoMethod = 'color' | 'gray' | 'pattern' | 'strings';

export interface EncodeRequest {
  image: File;
  message: string;
  method: StegoMethod;
}

export interface DecodeRequest {
  image: File;
  method: StegoMethod;
}

export interface ApiError {
  detail: string;
}

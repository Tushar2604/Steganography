import { StegoMethod } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const encodeImage = async (
  image: File,
  message: string,
  method: StegoMethod
): Promise<Blob> => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('message', message);

  const response = await fetch(`${API_BASE_URL}/encode/${method}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Encoding failed' }));
    throw new Error(error.detail || 'Failed to encode image');
  }

  return response.blob();
};

export const decodeImage = async (
  image: File,
  method: StegoMethod
): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${API_BASE_URL}/decode/${method}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Decoding failed' }));
    throw new Error(error.detail || 'Failed to decode image');
  }

  const data = await response.json();
  return data.message || data.text || '';
};

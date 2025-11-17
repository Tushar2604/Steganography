import { useState } from 'react';
import { Upload, Lock, Download, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { StegoMethod } from '../types';
import { encodeImage } from '../services/api';

interface EncodeProps {
  onNavigate: (page: 'home') => void;
}

export default function Encode({ onNavigate }: EncodeProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<StegoMethod>('color');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [encodedImageUrl, setEncodedImageUrl] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setSuccess(false);
    setEncodedImageUrl('');
  };

  const handleEncode = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message to encode');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const blob = await encodeImage(selectedFile, message, method);
      const url = URL.createObjectURL(blob);
      setEncodedImageUrl(url);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode image');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!encodedImageUrl) return;

    const a = document.createElement('a');
    a.href = encodedImageUrl;
    a.download = `encoded_${selectedFile?.name || 'image.png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setMessage('');
    setError('');
    setSuccess(false);
    setEncodedImageUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-100 p-3 rounded-xl">
              <Lock className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Encode Message</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">Message encoded successfully! Download your image below.</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Select Steganography Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as StegoMethod)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-colors bg-white"
              >
                <option value="color">Color Steganography (stego_color)</option>
                <option value="gray">Grayscale Steganography (stego_gray)</option>
                <option value="pattern">Pattern-Based Bit Shifting (stego_pattern)</option>
                <option value="strings">String Steganography (stego_strings)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-slate-400" />
                  <div>
                    <p className="text-slate-700 font-medium">
                      {selectedFile ? selectedFile.name : 'Click to upload an image'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG, or other image formats</p>
                  </div>
                </label>
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-xl border-2 border-slate-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message here..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-colors resize-none"
              />
              <p className="text-sm text-slate-500 mt-2">
                {message.length} characters
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleEncode}
                disabled={loading || !selectedFile || !message.trim()}
                className="flex-1 bg-slate-800 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Encoding...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Encode Message
                  </>
                )}
              </button>

              {success && encodedImageUrl && (
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </button>
              )}
            </div>

            {(selectedFile || message) && (
              <button
                onClick={handleReset}
                className="w-full text-slate-600 py-2 hover:text-slate-900 transition-colors"
              >
                Reset Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

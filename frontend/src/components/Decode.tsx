import { useState } from 'react';
import { Upload, Unlock, ArrowLeft, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { StegoMethod } from '../types';
import { decodeImage } from '../services/api';

interface DecodeProps {
  onNavigate: (page: 'home') => void;
}

export default function Decode({ onNavigate }: DecodeProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [method, setMethod] = useState<StegoMethod>('color');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [copied, setCopied] = useState(false);

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
    setDecodedMessage('');
  };

  const handleDecode = async () => {
    if (!selectedFile) {
      setError('Please select an encoded image');
      return;
    }

    setLoading(true);
    setError('');
    setDecodedMessage('');

    try {
      const message = await decodeImage(selectedFile, method);
      setDecodedMessage(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode image');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!decodedMessage) return;

    try {
      await navigator.clipboard.writeText(decodedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    setDecodedMessage('');
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
              <Unlock className="w-8 h-8 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Decode Message</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {decodedMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800">Message decoded successfully!</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Select Decoding Method
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
              <p className="text-sm text-slate-500 mt-2">
                Use the same method that was used to encode the image
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                Upload Encoded Image
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
                      {selectedFile ? selectedFile.name : 'Click to upload an encoded image'}
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

            <button
              onClick={handleDecode}
              disabled={loading || !selectedFile}
              className="w-full bg-slate-800 text-white py-3 px-6 rounded-xl font-medium hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Decoding...
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  Decode Message
                </>
              )}
            </button>

            {decodedMessage && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-slate-900">
                    Extracted Message
                  </label>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                  <p className="text-slate-900 whitespace-pre-wrap break-words">
                    {decodedMessage}
                  </p>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {decodedMessage.length} characters
                </p>
              </div>
            )}

            {selectedFile && (
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

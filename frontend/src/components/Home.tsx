import { Lock, Unlock, Image as ImageIcon, Shield, Sparkles } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: 'encode' | 'decode') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-emerald-800 to-teal-900 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full blur-2xl opacity-50"></div>
            </div>
            <div className="relative">
              <Shield className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-emerald-300 to-cyan-300 mb-4 drop-shadow-lg">
            Image Steganography Toolkit
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Hide secret messages inside images using advanced steganographic techniques.
            Secure, reliable, and easy to use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <button
            onClick={() => onNavigate('encode')}
            className="group relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-blue-400 hover:border-cyan-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-transparent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity -z-10"></div>

            <div className="flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="relative bg-gradient-to-br from-blue-400 to-cyan-400 p-4 rounded-xl group-hover:from-cyan-300 group-hover:to-blue-300 transition-all shadow-lg">
                <Lock className="w-12 h-12 text-blue-900" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 relative">Encode Message</h2>
            <p className="text-blue-100 leading-relaxed relative">
              Hide your secret message inside an image using one of our advanced steganographic methods
            </p>
            <div className="absolute top-4 right-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('decode')}
            className="group relative bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-emerald-400 hover:border-cyan-300 transform hover:scale-105 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-transparent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity -z-10"></div>

            <div className="flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-300 to-emerald-300 rounded-xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              </div>
              <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-400 p-4 rounded-xl group-hover:from-cyan-300 group-hover:to-emerald-300 transition-all shadow-lg">
                <Unlock className="w-12 h-12 text-emerald-900" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 relative">Decode Message</h2>
            <p className="text-emerald-100 leading-relaxed relative">
              Extract hidden messages from encoded images using the appropriate decoding method
            </p>
            <div className="absolute top-4 right-4 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-6 h-6" />
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-800 to-teal-800 rounded-2xl p-8 shadow-2xl border-2 border-cyan-400 backdrop-blur-sm">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-transparent opacity-10"></div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative">
            <div className="p-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-900" />
            </div>
            Available Methods
          </h3>
          <div className="grid md:grid-cols-2 gap-6 relative">
            <div className="border-l-4 border-cyan-400 pl-4 p-4 rounded-lg bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-cyan-300 mb-2">Color Steganography</h4>
              <p className="text-blue-100 text-sm">
                Embeds data by modifying the least significant bits of color channels in RGB images
              </p>
            </div>
            <div className="border-l-4 border-emerald-400 pl-4 p-4 rounded-lg bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-emerald-300 mb-2">Grayscale Steganography</h4>
              <p className="text-blue-100 text-sm">
                Optimized for grayscale images, hiding information in intensity values
              </p>
            </div>
            <div className="border-l-4 border-cyan-400 pl-4 p-4 rounded-lg bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-cyan-300 mb-2">Pattern-Based Bit Shifting</h4>
              <p className="text-blue-100 text-sm">
                Uses dynamic bit patterns for enhanced security and reduced detectability
              </p>
            </div>
            <div className="border-l-4 border-emerald-400 pl-4 p-4 rounded-lg bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
              <h4 className="font-bold text-emerald-300 mb-2">String Steganography</h4>
              <p className="text-blue-100 text-sm">
                Specialized method for efficiently encoding text strings within images
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [assetId, setAssetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    if (!assetId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/download?assetId=${assetId}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'module.rbxm';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message || 'Errore durante il download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#121212] to-[#0a0a0a]">
      {/* Animated background particles */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-stripes.png')] opacity-20 mix-blend-soft-light animate-pulse-slow" />
      
      <motion.div
        className="relative bg-white/5 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 hover:border-white/20 transition-all"
        animate={{ y: isHovered ? -5 : 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Hover gradient effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
            🔽 Roblox Asset Downloader
          </h1>

          <motion.input
            type="text"
            placeholder="Inserisci ID asset"
            className="w-full p-3 mb-4 rounded-xl bg-white/10 focus:outline-none ring-2 ring-transparent focus:ring-blue-400 placeholder-gray-400 text-white transition-all"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            whileFocus={{ 
              borderColor: 'rgba(96, 165, 250, 0.5)',
              scale: 1.02
            }}
            transition={{ duration: 0.4 }}
          />

          <motion.button
            onClick={handleDownload}
            disabled={loading}
            className={`w-full p-3 rounded-xl font-semibold relative overflow-hidden transition-all
              ${loading ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-500'}`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-blue-500/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )}
            <span className="relative z-10">
              {loading ? 'Scaricamento...' : 'Scarica'}
            </span>
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-sm mt-3 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p 
            className="text-xs text-center mt-6 text-gray-400 hover:text-gray-200 transition-colors cursor-default"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            by @tuoUsername <motion.span className="inline-block">✨</motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
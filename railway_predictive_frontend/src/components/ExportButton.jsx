import { useState } from 'react';
import { exportToExcel, exportToPDF } from '../utils/export';
import { motion, AnimatePresence } from 'framer-motion';

const ExportButton = ({ predictions }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Export Data
      </button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10"
          >
            <button
              onClick={() => {
                exportToExcel(predictions);
                setShowOptions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Export to Excel
            </button>
            <button
              onClick={() => {
                exportToPDF(predictions);
                setShowOptions(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Export to PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton; 
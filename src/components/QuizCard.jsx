// src/components/QuizCard.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizCard({ html, questionNumber, total, duration }) {
  return (
    <div className="flex flex-col h-full bg-gray-800 p-2 sm:p-4 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold mb-3 text-center text-white">
        Question {questionNumber} of {total}
      </h2>

      <div className="relative flex-1">
        {/* Always center content, even when scrollable */}
        <div className="overflow-x-auto">
          <AnimatePresence>
            <div className="flex justify-center">
              <motion.div
                key={html}
                initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration, ease: 'linear' }}
                className="prose prose-white max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

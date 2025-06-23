// src/components/QuizCard.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizCard({ html, questionNumber, total, duration }) {
  return (
    <div className="flex flex-col h-full bg-gray-800 p-0 sm:p-4 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold mb-3 text-center text-white">
        Question {questionNumber} of {total}
      </h2>

      <div className="relative flex-1">
        {/* horizontal scroll, but never let content drift left */}
        <div className="overflow-x-auto">
          <AnimatePresence>
            <motion.div
              key={html}
              initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration, ease: 'linear' }}
              className="
                prose prose-white 
                min-w-full       /* at least container width */
                max-w-none       /* no upper limit */
                break-words 
                mx-auto          /* center when narrower */
              "
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

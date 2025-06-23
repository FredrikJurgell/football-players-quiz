// src/components/QuizCard.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizCard({ html, questionNumber, total, duration }) {
  return (
    <div
      className="
        flex flex-col
        bg-gray-800 p-0 sm:p-4
        rounded-2xl shadow-xl
        max-h-[80vh] overflow-auto
      "
    >
      <h2 className="text-xl font-semibold mb-3 text-center text-white">
        Question {questionNumber} of {total}
      </h2>

      {/* Här scrollar vi både vertikalt (overflow-auto på parent)
          och horisontellt (overflow-x-auto på detta element) */}
      <div className="overflow-x-auto">
        <AnimatePresence>
          <motion.div
            key={html}
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration, ease: 'linear' }}
            className="
              prose prose-white
              min-w-full
              max-w-none
              break-words
              px-4 py-2
            "
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

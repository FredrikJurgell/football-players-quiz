// src/components/AnswerList.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnswerList({ sections = [], scores = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = idx => setOpenIndex(prev => (prev === idx ? null : idx));

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => {
        const name   = section.player.full_name;
        const pts    = scores[idx] ?? 0;
        const isOpen = openIndex === idx;

        return (
          <div key={section.id || idx} className="space-y-2">
            <button
              onClick={() => toggle(idx)}
              className="
                w-full flex justify-between items-start
                text-gray-200 hover:text-white focus:outline-none
              "
            >
              {/* Left side: question + name, wrapping */}
              <div className="flex-1 pr-4 text-left">
                <p className="whitespace-normal">
                  <span>Question {idx + 1}: </span>
                  <span className="font-medium text-white break-words">
                    {name}
                  </span>
                </p>
              </div>

              {/* Right side: score fixed width and top‐aligned */}
              <div className="flex-shrink-0">
                <span className="font-semibold text-green-400">
                  {pts} pts
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-white p-4 rounded-lg prose prose-white overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

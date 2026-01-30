import React, { useState } from 'react';
import { useContact } from '../../amazon/contexts/ContactContext';
import { questionsAndAnswers, type QAItem } from '../../data/portfolioData';

/**
 * QuestionsAndAnswersSection Component
 * 
 * Displays FAQ in Amazon's Q&A format with easter egg responses.
 * Features:
 * - Amazon Q&A styling
 * - Expandable/collapsible answers
 * - Witty and engaging responses
 * - Professional yet entertaining content
 * 
 * Data Source: src/data/portfolioData.ts (questionsAndAnswers)
 * 
 * Requirements: 13.2
 */

interface QuestionsAndAnswersSectionProps {
  /** Optional custom Q&A items */
  customQAs?: QAItem[];
}

/**
 * Individual Q&A item component
 */
const QAItem: React.FC<{ qa: QAItem; isExpanded: boolean; onToggle: () => void }> = ({
  qa,
  isExpanded,
  onToggle,
}) => {
  // Handle both Date objects and serialized date strings
  const qaDate = qa.date ? (typeof qa.date === 'string' ? new Date(qa.date) : qa.date) : null;
  
  const formattedDate = qaDate?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="qa-item border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      {/* Question */}
      <button
        onClick={onToggle}
        className="w-full text-left group focus:outline-none focus:ring-2 focus:ring-amazon-orange rounded p-2 -m-2"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-6 h-6 bg-amazon-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
              Q
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amazon-dark group-hover:text-amazon-orange transition-colors">
              {qa.question}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Answer (collapsible) */}
      {isExpanded && (
        <div className="mt-4 ml-9 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-amazon-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                A
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed mb-3">
                {qa.answer}
              </p>
              <div className="text-sm text-gray-500">
                {qa.answeredBy && (
                  <span className="font-medium">{qa.answeredBy}</span>
                )}
                {qa.answeredBy && formattedDate && <span> • </span>}
                {formattedDate && <span>{formattedDate}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuestionsAndAnswersSection: React.FC<QuestionsAndAnswersSectionProps> = ({
  customQAs,
}) => {
  const qas = customQAs || questionsAndAnswers;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { openContactSidebar } = useContact();

  const toggleQA = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section 
      id="questions-and-answers" 
      className="questions-and-answers-section py-12 px-4"
      aria-labelledby="questions-and-answers-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
          {/* Section Header */}
          <h2 
            id="questions-and-answers-heading"
            className="text-2xl font-bold text-amazon-dark mb-2"
          >
            Questions & Answers
          </h2>
          <p className="text-gray-600 mb-8">
            Have a question? Here are some common ones (with a twist)
          </p>

          {/* Q&A List */}
          <div>
            {qas.map((qa, index) => (
              <QAItem
                key={index}
                qa={qa}
                isExpanded={expandedIndex === index}
                onToggle={() => toggleQA(index)}
              />
            ))}
          </div>

          {/* Ask Question CTA */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-700 mb-4">
              Have a different question?
            </p>
            <button 
              onClick={openContactSidebar}
              className="px-6 py-3 bg-amazon-orange text-white rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:ring-offset-2"
              aria-label="Contact me - open contact sidebar"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default QuestionsAndAnswersSection;

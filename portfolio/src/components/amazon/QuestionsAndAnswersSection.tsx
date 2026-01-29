import React, { useState } from 'react';
import { useContact } from '../../amazon/contexts/ContactContext';

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
 * Requirements: 13.2
 */

interface QA {
  /** Question text */
  question: string;
  
  /** Answer text */
  answer: string;
  
  /** Optional answerer name */
  answeredBy?: string;
  
  /** Optional answer date */
  date?: Date;
}

interface QuestionsAndAnswersSectionProps {
  /** Optional custom Q&A items */
  customQAs?: QA[];
}

/**
 * Default Q&A items with easter eggs
 */
const DEFAULT_QAS: QA[] = [
  {
    question: "What's your availability?",
    answer: "Immediate - Ready to start on your next project! I'm currently available for full-time positions, contract work, or consulting engagements. Think of me as Amazon Prime for developers: fast, reliable, and always delivering quality.",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-15'),
  },
  {
    question: "Do you work remotely?",
    answer: "Yes! I've been working with distributed teams globally for years. I'm comfortable with async communication, different time zones, and have a home office setup that would make Jeff Bezos jealous (okay, maybe not that nice, but it's pretty good).",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-14'),
  },
  {
    question: "What's your preferred tech stack?",
    answer: "I'm fluent in React, TypeScript, Node.js, Python, and AWS - but I'm not married to any particular stack. I believe in using the right tool for the job. That said, if you're still using jQuery in 2025, we need to talk.",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-13'),
  },
  {
    question: "Can you work on legacy codebases?",
    answer: "Absolutely! I've refactored more spaghetti code than an Italian restaurant. I approach legacy code with respect (someone wrote it under pressure) and pragmatism (let's make it better, not perfect). No judgment, just improvements.",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-12'),
  },
  {
    question: "Do you do code reviews?",
    answer: "Yes, and I promise to be constructive, not destructive. My code reviews focus on knowledge sharing, not ego crushing. I believe in 'praise in public, critique in private' - though I'll definitely celebrate clever solutions publicly!",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-11'),
  },
  {
    question: "What's your rate?",
    answer: "Let's discuss your project first! My rates are competitive and depend on the scope, duration, and complexity. I'm happy to work within your budget and can offer flexible arrangements. Contact me and we'll figure out something that works for both of us.",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-10'),
  },
  {
    question: "Can you add this to my cart?",
    answer: "You're already thinking like an Amazon customer! Yes, click the 'Add to Cart' button on any skill or project card. Then proceed to checkout to get in touch. It's like shopping, but instead of getting a package, you get a developer!",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-09'),
  },
  {
    question: "Is this portfolio really Amazon-themed?",
    answer: "You caught that! Yes, this entire portfolio is styled like Amazon's e-commerce platform. It's my way of showing creativity while demonstrating technical skills. Plus, if Amazon recruiters visit, they'll feel right at home. (Disclaimer: Not affiliated with Amazon.com, Inc.)",
    answeredBy: "Dheeraj Kumar",
    date: new Date('2025-01-08'),
  },
];

/**
 * Individual Q&A item component
 */
const QAItem: React.FC<{ qa: QA; isExpanded: boolean; onToggle: () => void }> = ({
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
  const qas = customQAs || DEFAULT_QAS;
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

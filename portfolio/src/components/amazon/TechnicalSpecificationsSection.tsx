import React from 'react';
import type { Skill, SkillCategory } from '../../amazon/types';

/**
 * TechnicalSpecificationsSection Component
 * 
 * Displays technical skills in a table format organized by category.
 * Features:
 * - Amazon product specifications styling
 * - Skills grouped by category (Frontend, Backend, AI/ML, Cloud, DevOps, Database)
 * - Table format with skill names and experience levels
 * - Responsive design
 * 
 * Requirements: 4.4
 */

interface TechnicalSpecificationsSectionProps {
  /** Array of all skills to display */
  skills: Skill[];
}

/**
 * Category display names
 */
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  'frontend': 'Frontend Development',
  'backend': 'Backend Development',
  'ai-ml': 'AI/ML & Data Science',
  'cloud': 'Cloud & Infrastructure',
  'devops': 'DevOps & Deployment',
  'database': 'Databases & Storage',
};

/**
 * Category order for display
 */
const CATEGORY_ORDER: SkillCategory[] = [
  'frontend',
  'backend',
  'ai-ml',
  'cloud',
  'devops',
  'database',
];

const TechnicalSpecificationsSection: React.FC<TechnicalSpecificationsSectionProps> = ({
  skills,
}) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  // Sort skills within each category by years of experience (descending)
  Object.keys(skillsByCategory).forEach(category => {
    skillsByCategory[category as SkillCategory].sort(
      (a, b) => b.yearsOfExperience - a.yearsOfExperience
    );
  });

  return (
    <section 
      id="all-skills" 
      className="technical-specifications-section py-12 px-4 bg-gray-50"
      aria-labelledby="technical-specifications-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
          {/* Section Header */}
          <h2 
            id="technical-specifications-heading"
            className="text-2xl font-bold text-amazon-dark mb-6 pb-4 border-b border-gray-200"
          >
            Technical Specifications
          </h2>

          {/* Specifications Table */}
          <div className="space-y-6">
            {CATEGORY_ORDER.map(category => {
              const categorySkills = skillsByCategory[category];
              
              // Skip if no skills in this category
              if (!categorySkills || categorySkills.length === 0) {
                return null;
              }

              return (
                <div key={category} className="specification-row">
                  {/* Category Label */}
                  <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 pb-4 border-b border-gray-200">
                    <div className="md:w-1/3 flex-shrink-0">
                      <h3 className="font-bold text-amazon-dark text-base md:text-lg">
                        {CATEGORY_LABELS[category]}
                      </h3>
                    </div>
                    
                    {/* Skills List */}
                    <div className="md:w-2/3 flex-1">
                      <div className="flex flex-wrap gap-2 md:gap-2">
                        {categorySkills.map(skill => (
                          <div
                            key={skill.id}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 md:py-1.5 rounded-full text-sm min-h-[44px] md:min-h-0 transition-colors"
                          >
                            {/* Skill Icon */}
                            <img 
                              src={skill.icon} 
                              alt={`${skill.name} icon`}
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                            <span className="font-medium text-gray-800">
                              {skill.name}
                            </span>
                            <span className="text-gray-500">
                              •
                            </span>
                            <span className="text-gray-600">
                              {skill.yearsOfExperience}+ yrs
                            </span>
                            {skill.isPrime && (
                              <>
                                <span className="text-gray-500">
                                  •
                                </span>
                                <span className="text-[#00A8E1] font-bold text-xs">
                                  prime
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Frameworks/Tools (if available) */}
                      {categorySkills.some(s => s.specifications.frameworks.length > 0) && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span className="font-medium">Includes:</span>{' '}
                          {Array.from(
                            new Set(
                              categorySkills.flatMap(s => s.specifications.frameworks)
                            )
                          )
                            .slice(0, 5)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Details */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-bold text-gray-800">Certifications:</span>{' '}
                {Array.from(
                  new Set(
                    skills.flatMap(s => s.specifications.certifications)
                  )
                ).join(', ') || 'AWS Certified, Multiple industry certifications'}
              </p>
              <p>
                <span className="font-bold text-gray-800">Languages:</span>{' '}
                TypeScript, JavaScript, Python, Go, Java
              </p>
              <p>
                <span className="font-bold text-gray-800">Methodologies:</span>{' '}
                Agile, Scrum, Test-Driven Development, CI/CD
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecificationsSection;

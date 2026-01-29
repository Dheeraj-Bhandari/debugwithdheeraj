/**
 * Skill Documentation URL Mapping Service
 * 
 * Maps skill names to their official documentation URLs.
 * Supports case-insensitive lookups for flexible skill name matching.
 */

/**
 * Comprehensive mapping of skills to their official documentation URLs
 */
const skillDocsUrls: Record<string, string> = {
  // Frontend Frameworks & Libraries
  'react': 'https://react.dev',
  'reactjs': 'https://react.dev',
  'react.js': 'https://react.dev',
  'nextjs': 'https://nextjs.org',
  'next.js': 'https://nextjs.org',
  'next': 'https://nextjs.org',
  'vue': 'https://vuejs.org',
  'vuejs': 'https://vuejs.org',
  'vue.js': 'https://vuejs.org',
  'redux': 'https://redux.js.org',
  'materialui': 'https://mui.com',
  'material-ui': 'https://mui.com',
  'mui': 'https://mui.com',
  'vite': 'https://vitejs.dev',
  'vitejs': 'https://vitejs.dev',
  
  // Backend Frameworks & Runtime
  'nodejs': 'https://nodejs.org',
  'node.js': 'https://nodejs.org',
  'node': 'https://nodejs.org',
  'express': 'https://expressjs.com',
  'expressjs': 'https://expressjs.com',
  'express.js': 'https://expressjs.com',
  'django': 'https://www.djangoproject.com',
  'flask': 'https://flask.palletsprojects.com',
  'fastapi': 'https://fastapi.tiangolo.com',
  'graphql': 'https://graphql.org',
  
  // Programming Languages
  'typescript': 'https://www.typescriptlang.org',
  'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'js': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'python': 'https://www.python.org',
  'java': 'https://docs.oracle.com/en/java/',
  'sql': 'https://www.w3schools.com/sql/',
  'bash': 'https://www.gnu.org/software/bash/manual/',
  
  // Cloud & DevOps
  'aws': 'https://aws.amazon.com',
  'amazon web services': 'https://aws.amazon.com',
  'ec2': 'https://aws.amazon.com/ec2/',
  'lambda': 'https://aws.amazon.com/lambda/',
  's3': 'https://aws.amazon.com/s3/',
  'eks': 'https://aws.amazon.com/eks/',
  'docker': 'https://www.docker.com',
  'kubernetes': 'https://kubernetes.io',
  'k8s': 'https://kubernetes.io',
  'cicd': 'https://www.atlassian.com/continuous-delivery',
  'ci/cd': 'https://www.atlassian.com/continuous-delivery',
  
  // Databases
  'mongodb': 'https://www.mongodb.com',
  'mongo': 'https://www.mongodb.com',
  'postgresql': 'https://www.postgresql.org',
  'postgres': 'https://www.postgresql.org',
  'mysql': 'https://www.mysql.com',
  'redis': 'https://redis.io',
  'dynamodb': 'https://aws.amazon.com/dynamodb/',
  'pinecone': 'https://www.pinecone.io',
  
  // AI/ML Technologies
  'tensorflow': 'https://www.tensorflow.org',
  'langchain': 'https://www.langchain.com',
  'openai': 'https://platform.openai.com/docs',
  'vectordb': 'https://www.pinecone.io/learn/vector-database/',
  'vector dbs': 'https://www.pinecone.io/learn/vector-database/',
  'rag': 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
};

/**
 * Retrieves the official documentation URL for a given skill name.
 * Performs case-insensitive lookup and handles various skill name formats.
 * 
 * @param skillName - The name of the skill to look up
 * @returns The documentation URL if found, null otherwise
 * 
 * @example
 * getSkillDocUrl('React') // Returns 'https://react.dev'
 * getSkillDocUrl('NODEJS') // Returns 'https://nodejs.org'
 * getSkillDocUrl('Unknown Skill') // Returns null
 */
export function getSkillDocUrl(skillName: string): string | null {
  if (!skillName || typeof skillName !== 'string') {
    return null;
  }
  
  // Normalize the skill name: lowercase and remove extra whitespace
  const normalized = skillName.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Try exact match first
  if (skillDocsUrls[normalized]) {
    return skillDocsUrls[normalized];
  }
  
  // Try without spaces (e.g., "Node.js" -> "nodejs")
  const noSpaces = normalized.replace(/\s+/g, '');
  if (skillDocsUrls[noSpaces]) {
    return skillDocsUrls[noSpaces];
  }
  
  // Try without dots (e.g., "Node.js" -> "nodejs")
  const noDots = normalized.replace(/\./g, '');
  if (skillDocsUrls[noDots]) {
    return skillDocsUrls[noDots];
  }
  
  // Try without spaces and dots
  const noSpacesOrDots = normalized.replace(/[\s.]/g, '');
  if (skillDocsUrls[noSpacesOrDots]) {
    return skillDocsUrls[noSpacesOrDots];
  }
  
  return null;
}

/**
 * Checks if a skill has a documentation URL available.
 * 
 * @param skillName - The name of the skill to check
 * @returns True if documentation URL exists, false otherwise
 */
export function hasSkillDocUrl(skillName: string): boolean {
  return getSkillDocUrl(skillName) !== null;
}

/**
 * Gets all available skill names that have documentation URLs.
 * 
 * @returns Array of skill names with documentation
 */
export function getAvailableSkills(): string[] {
  return Object.keys(skillDocsUrls);
}

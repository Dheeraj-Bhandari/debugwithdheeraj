/**
 * Company/Project URLs
 * Maps project IDs to their official company pages
 */

export const projectUrls: Record<string, string> = {
  'neuraltalk-ai-platform': 'https://neuraltalk.ai',
  'monster-api-integration': 'https://www.npmjs.com/package/monsterapi',
  'neo-autonomous-ml-platform': 'https://heyneo.so',
  'amazon-ml-data-projects': 'https://www.amazon.com',
};

/**
 * Get company/project URL
 * @param projectId - The project ID (kebab-case)
 * @returns The company/project URL or null if not found
 */
export function getProjectUrl(projectId: string): string | null {
  return projectUrls[projectId] || null;
}

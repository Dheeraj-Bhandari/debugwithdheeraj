import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchOverlay from './SearchOverlay';
import type { Skill, Project } from '../../amazon/types';

describe('SearchOverlay Component', () => {
  const mockSkills: Skill[] = [
    {
      id: 'react',
      name: 'React',
      category: 'frontend',
      proficiencyLevel: 5,
      yearsOfExperience: 5,
      description: 'React development',
      icon: '/icons/react.svg',
      isPrime: true,
      specifications: {
        frameworks: ['Next.js', 'Redux'],
        tools: ['Vite', 'Webpack'],
        certifications: [],
      },
      relatedProjects: [],
      reviews: [],
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      proficiencyLevel: 5,
      yearsOfExperience: 5,
      description: 'Node.js backend development',
      icon: '/icons/nodejs.svg',
      isPrime: true,
      specifications: {
        frameworks: ['Express', 'Fastify'],
        tools: ['PM2', 'Docker'],
        certifications: [],
      },
      relatedProjects: [],
      reviews: [],
    },
  ];

  const mockProjects: Project[] = [
    {
      id: 'neuraltalk',
      name: 'NeuralTalk AI Platform',
      tagline: 'Privacy-first AI customer support',
      description: 'AI platform for customer support',
      techStack: ['React', 'Node.js', 'Python'],
      images: ['/projects/neuraltalk.jpg'],
      rating: 5,
      metrics: { users: 100 },
      links: { live: 'https://neuraltalk.ai' },
      isPrime: true,
      reviews: [],
      relatedSkills: ['react', 'nodejs'],
    },
  ];

  const mockOnClose = vi.fn();
  const mockOnItemClick = vi.fn();
  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnItemClick.mockClear();
    mockOnAddToCart.mockClear();
    localStorage.clear();
  });

  it('renders when open', () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search skills, projects...')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <SearchOverlay
        isOpen={false}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows autocomplete suggestions when typing', async () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const input = screen.getByPlaceholderText('Search skills, projects...');
    fireEvent.change(input, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });
  });

  it('performs search and displays results', async () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const input = screen.getByPlaceholderText('Search skills, projects...');
    fireEvent.change(input, { target: { value: 'React' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const skillsElements = screen.getAllByText(/Skills \(/);
      expect(skillsElements.length).toBeGreaterThan(0);
    });
  });

  it('shows no results message when search returns nothing', async () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const input = screen.getByPlaceholderText('Search skills, projects...');
    fireEvent.change(input, { target: { value: 'NonexistentSkill' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText(/No results found for/)).toBeInTheDocument();
    });
  });

  it('closes when close button is clicked', () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const closeButton = screen.getByLabelText('Close search');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when ESC key is pressed', () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('filters results by category', async () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const input = screen.getByPlaceholderText('Search skills, projects...');
    fireEvent.change(input, { target: { value: 'Node' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const skillsElements = screen.getAllByText(/Skills \(/);
      expect(skillsElements.length).toBeGreaterThan(0);
    });

    // Click on Skills filter button (the first one in the filter section)
    const filterButtons = screen.getAllByText(/Skills \(/);
    const skillsFilterButton = filterButtons.find(el => el.tagName === 'BUTTON' && el.className.includes('rounded-full'));
    if (skillsFilterButton) {
      fireEvent.click(skillsFilterButton);
    }

    // Projects heading (h2) should not be visible after filtering, but filter button is still there
    await waitFor(() => {
      const projectsElements = screen.queryAllByText(/Projects \(/);
      const projectsHeading = projectsElements.find(el => el.tagName === 'H2');
      expect(projectsHeading).toBeUndefined();
    });
  });

  it('saves and displays recent searches', async () => {
    render(
      <SearchOverlay
        isOpen={true}
        onClose={mockOnClose}
        skills={mockSkills}
        projects={mockProjects}
        onItemClick={mockOnItemClick}
        onAddToCart={mockOnAddToCart}
      />
    );

    const input = screen.getByPlaceholderText('Search skills, projects...');
    fireEvent.change(input, { target: { value: 'React' } });

    const form = input.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const stored = localStorage.getItem('amazon-portfolio-recent-searches');
      expect(stored).toBeTruthy();
      if (stored) {
        const searches = JSON.parse(stored);
        expect(searches).toContain('React');
      }
    });
  });
});

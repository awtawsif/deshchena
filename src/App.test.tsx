import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App Smoke Test', () => {
  it('renders title and tagline', () => {
    render(<App />);
    expect(screen.getByText('Bangladesh 64')).toBeInTheDocument();
    expect(screen.getByText('দেশ চেনা')).toBeInTheDocument();
    expect(screen.getByText('Can you find all 64?')).toBeInTheDocument();
  });
});

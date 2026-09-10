import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';

describe('Bangladesh 64 - Full App Flow', () => {
  it('renders home screen with game options', () => {
    render(<App />);

    expect(screen.getAllByText('Bangladesh 64').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('দেশ চেনা').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/PLAY NOW/i)).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('switches language between English and Bangla', () => {
    render(<App />);

    const langButton = screen.getByRole('button', { name: /Toggle language/i });
    expect(langButton).toBeInTheDocument();

    // Click to switch to Bangla
    fireEvent.click(langButton);
    expect(screen.getByText('খেলা শুরু করুন')).toBeInTheDocument();

    // Click to switch back to English
    fireEvent.click(langButton);
    expect(screen.getByText(/PLAY NOW/i)).toBeInTheDocument();
  });

  it('starts a game session and renders map and question card', async () => {
    render(<App />);

    // Click 10 questions option
    const tenButton = screen.getByRole('button', { name: '10' });
    fireEvent.click(tenButton);

    // Click PLAY NOW
    const playButton = screen.getByRole('button', { name: /PLAY NOW/i });
    fireEvent.click(playButton);

    // Question card should be visible
    expect(screen.getByText(/Find the District/i)).toBeInTheDocument();
    // Scoreboard should show Question: 1 / 10
    expect(screen.getByText(/1 \/ 10/)).toBeInTheDocument();

    // Map should have 64 clickable districts
    const mapRegion = screen.getByRole('region', {
      name: /Interactive Map of Bangladesh Districts/i,
    });
    expect(mapRegion).toBeInTheDocument();
    const districtButtons = screen.getAllByRole('button', {
      name: /district/i,
    });
    expect(districtButtons).toHaveLength(64);
  });

  it('evaluates answers on map click and displays feedback', async () => {
    render(<App />);

    // Start game
    fireEvent.click(screen.getByRole('button', { name: /PLAY NOW/i }));

    // Click any district on the map
    const firstDistrict = screen.getAllByRole('button', {
      name: /district/i,
    })[0];

    act(() => {
      fireEvent.click(firstDistrict);
    });

    // Feedback banner (Correct or Incorrect) should appear
    const feedbackText = screen.getByText(/✓ Correct!|✕ Incorrect!/i);
    expect(feedbackText).toBeInTheDocument();
  });

  it('completes a game and triggers practice mistakes mode', async () => {
    render(<App />);

    // Select 10 questions
    fireEvent.click(screen.getByRole('button', { name: '10' }));
    // Start game
    fireEvent.click(screen.getByRole('button', { name: /PLAY NOW/i }));

    // Answer questions until game completes
    for (let i = 0; i < 10; i++) {
      const districts = screen.getAllByRole('button', { name: /district/i });
      act(() => {
        // Intentionally click the first district (which may or may not be correct)
        fireEvent.click(districts[0]);
      });

      // Advance immediately using the Next button
      const nextButton = screen.queryByRole('button', { name: /Next/i });
      if (nextButton) {
        act(() => {
          fireEvent.click(nextButton);
        });
      }
    }

    // Results screen should now be displayed
    expect(screen.getByText(/GAME COMPLETE!|PERFECT GAME!/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Score/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Again/i })).toBeInTheDocument();

    // If there are mistakes, practice mistakes button should work
    const practiceButton = screen.queryByRole('button', {
      name: /Practice Mistakes/i,
    });
    if (practiceButton) {
      act(() => {
        fireEvent.click(practiceButton);
      });
      // Should return to Game screen with the practice session
      expect(screen.getByText(/Find the District/i)).toBeInTheDocument();
    }
  });
});

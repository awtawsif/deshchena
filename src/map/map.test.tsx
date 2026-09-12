import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BangladeshMap } from './BangladeshMap';

describe('BangladeshMap Component', () => {
  it('renders all 64 district path elements', () => {
    const { container } = render(<BangladeshMap />);
    const paths = container.querySelectorAll('#bangladesh-districts path');
    expect(paths).toHaveLength(64);
  });

  it('triggers onDistrictClick when a district is clicked', () => {
    const handleClick = vi.fn();
    render(<BangladeshMap onDistrictClick={handleClick} />);

    const gazipur = screen.getByLabelText(/Gazipur district/i);
    fireEvent.click(gazipur);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('BD-GAZ');
  });

  it('handles keyboard navigation (Enter key)', () => {
    const handleClick = vi.fn();
    render(<BangladeshMap onDistrictClick={handleClick} />);

    const dhaka = screen.getByLabelText(/Dhaka district/i);
    fireEvent.keyDown(dhaka, { key: 'Enter', code: 'Enter' });

    expect(handleClick).toHaveBeenCalledWith('BD-DHK');
  });

  it('applies correct visual state classes for correct and incorrect answers', () => {
    const { container } = render(
      <BangladeshMap
        districtStates={{
          'BD-GAZ': 'correct',
          'BD-DHK': 'incorrect',
        }}
      />
    );

    const gazipurPath = container.querySelector('#district-BD-GAZ');
    const dhakaPath = container.querySelector('#district-BD-DHK');

    expect(gazipurPath?.getAttribute('class')).toContain('fill-emerald-500');
    expect(dhakaPath?.getAttribute('class')).toContain('fill-rose-500');
  });

  it('renders Bangla labels when language is bn', () => {
    render(<BangladeshMap language="bn" />);
    const gazipurBn = screen.getByLabelText(/গাজীপুর district/i);
    expect(gazipurBn).toBeInTheDocument();
  });

  it('renders zoom overlay controls and handles zoom in/out', () => {
    render(<BangladeshMap />);
    const zoomInBtn = screen.getByLabelText(/Zoom In/i);
    const zoomOutBtn = screen.getByLabelText(/Zoom Out/i);
    const resetBtn = screen.getByLabelText(/Reset View/i);

    expect(zoomInBtn).toBeInTheDocument();
    expect(zoomOutBtn).toBeInTheDocument();
    expect(resetBtn).toBeInTheDocument();

    // Zoom out is initially disabled at scale 1.0
    expect(zoomOutBtn).toBeDisabled();
    expect(resetBtn).toBeDisabled();

    // Clicking zoom in enables zoom out
    fireEvent.click(zoomInBtn);
    expect(zoomOutBtn).not.toBeDisabled();
    expect(resetBtn).not.toBeDisabled();
  });

  it('shows hover name badge on hover by default', () => {
    render(<BangladeshMap />);
    const gazipur = screen.getByLabelText(/Gazipur district/i);
    fireEvent.mouseEnter(gazipur);
    expect(screen.getByText('Gazipur')).toBeInTheDocument();
  });

  it('hides hover name badge when showHoverNames is disabled', () => {
    render(<BangladeshMap showHoverNames={false} />);
    const gazipur = screen.getByLabelText(/Gazipur district/i);
    fireEvent.mouseEnter(gazipur);
    expect(screen.queryByText('Gazipur')).not.toBeInTheDocument();
  });
});

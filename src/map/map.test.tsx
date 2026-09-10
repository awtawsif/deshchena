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
});

import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-emerald-400 mb-2">Bangladesh 64</h1>
      <p className="text-xl text-slate-300 font-bangla mb-4">দেশ চেনা</p>
      <span className="text-sm text-slate-400">Can you find all 64?</span>
    </div>
  );
};

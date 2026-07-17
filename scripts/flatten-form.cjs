const fs = require('fs');

let code = fs.readFileSync('src/pages/CandidateFormPage.tsx', 'utf8');

// 1. Revert main container
code = code.replace(
  '<div className="w-full bg-slate-50/50 rounded-[2.5rem] shadow-inner p-6 md:p-10 text-left space-y-12" id="candidate-form-container">',
  '<div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10 text-left space-y-10" id="candidate-form-container">'
);

// 2. Form space
code = code.replace(
  '<form onSubmit={(e) => e.preventDefault()} className="space-y-10" id="dossier-full-form">',
  '<form onSubmit={(e) => e.preventDefault()} className="space-y-10" id="dossier-full-form">'
);

// 3. Remove heavy card wrapper, use a simple div with bottom border for separation
code = code.replace(
  /<div className="bg-white rounded-3xl shadow-xl shadow-slate-200\/40 border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900\/5 transition-all duration-300">/g,
  '<div className="pb-10 pt-4 border-b border-slate-200 last:border-0">'
);

// 4. Clean header wrapper
code = code.replace(
  /<div className="bg-gradient-to-r from-slate-50 to-white p-6 md:p-8 border-b border-slate-100">/g,
  '<div className="mb-6">'
);

// 5. Clean title wrapper
code = code.replace(
  /<div className="flex items-center space-x-4 text-slate-800">/g,
  '<div className="flex items-center space-x-2 text-slate-800 mb-1">'
);

// 6. Clean icon wrappers
code = code.replace(
  /<div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 border border-slate-100 group-hover:scale-110 transition-transform duration-300"><([A-Za-z]+) className="w-6 h-6" \/><\/div>/g,
  '<$1 className="w-[18px] h-[18px] text-slate-600" />'
);

// 7. Clean section H2 titles
code = code.replace(
  /<h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">/g,
  '<h2 className="text-base font-bold text-slate-800">'
);

// 8. Clean section subtitles
code = code.replace(
  /<p className="text-\[11px\] font-bold text-slate-400 uppercase tracking-wider mt-2 ml-16">/g,
  '<p className="text-[13px] text-slate-500 ml-6">'
);

// 9. Clean section body padding
code = code.replace(
  /<div className="p-6 md:p-8">/g,
  '<div className="px-1">'
);

// Let's also fix the inputs to look more like the screenshot (flat light gray bg, subtle border)
// Instead of modifying index.css again, the user might just want the structural layout.
// Actually, the screenshot shows inputs with very light gray background (`bg-slate-50`), gray placeholder, no huge shadows.
// I'll update index.css back to a standard minimal look.

fs.writeFileSync('src/pages/CandidateFormPage.tsx', code);
console.log('Form flattened successfully!');

const fs = require('fs');

let code = fs.readFileSync('src/pages/CandidateFormPage.tsx', 'utf8');

// 1. Upgrade the main container
code = code.replace(
  '<div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-left space-y-10" id="candidate-form-container">',
  '<div className="w-full bg-slate-50/50 rounded-[2.5rem] shadow-inner p-6 md:p-10 text-left space-y-12" id="candidate-form-container">'
);

// 2. Upgrade the main form container
code = code.replace(
  '<form onSubmit={(e) => e.preventDefault()} className="space-y-6" id="dossier-full-form">',
  '<form onSubmit={(e) => e.preventDefault()} className="space-y-10" id="dossier-full-form">'
);

// 3. Upgrade all sections wrapper
code = code.replace(
  /<div className="space-y-6 pb-6">/g,
  '<div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">'
);

// 4. Upgrade section header wrapper
code = code.replace(
  /<div className="space-y-1">/g,
  '<div className="bg-gradient-to-r from-slate-50 to-white p-6 md:p-8 border-b border-slate-100">'
);

// 5. Upgrade section title wrapper
code = code.replace(
  /<div className="flex items-center space-x-2 text-slate-800">/g,
  '<div className="flex items-center space-x-4 text-slate-800">'
);

// 6. Upgrade Icon wrappers
// Matches: <User className="w-5 h-5 text-slate-700" />
code = code.replace(
  /<([A-Za-z]+) className="w-5 h-5 text-slate-700" \/>/g,
  '<div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 border border-slate-100 group-hover:scale-110 transition-transform duration-300"><$1 className="w-6 h-6" /></div>'
);

// 7. Upgrade section H2 titles
code = code.replace(
  /<h2 className="text-lg font-bold">/g,
  '<h2 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">'
);

// 8. Upgrade section subtitles
code = code.replace(
  /<p className="text-sm text-slate-500 ml-7">/g,
  '<p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2 ml-16">'
);

// 9. Upgrade section body
code = code.replace(
  /<div className="ml-7">/g,
  '<div className="p-6 md:p-8">'
);

fs.writeFileSync('src/pages/CandidateFormPage.tsx', code);
console.log('Candidate Form UI upgraded successfully!');

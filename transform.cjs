const fs = require('fs');
let code = fs.readFileSync('src/pages/CandidateFormPage.tsx', 'utf8');

// Replace the accordion wrappers
const sectionRegex = /<div className=\"glass-panel rounded-2xl overflow-hidden transition-all\">[\s\S]*?<button[\s\S]*?onClick=\{\(\) => toggleSection\('[a-zA-Z0-9_]+'\)\}[\s\S]*?className=\"[^\"]*\"[\s\S]*?>[\s\S]*?<div className=\"flex items-center space-x-3\.5\">[\s\S]*?<div className=\"[^\"]*\">[\s\S]*?<([A-Z][a-zA-Z0-9_]*) className=\"w-5 h-5\" \/>[\s\S]*?<\/div>[\s\S]*?<div>[\s\S]*?<h2 className=\"[^\"]*\">([^<]+)<\/h2>[\s\S]*?<p className=\"[^\"]*\">([^<]+)<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\{expanded\.[a-zA-Z0-9_]+ \?[\s\S]*?<\/button>[\s\S]*?<AnimatePresence initial=\{false\}>[\s\S]*?\{expanded\.[a-zA-Z0-9_]+ && \([\s\S]*?<motion\.div[\s\S]*?className=\"overflow-hidden\"[\s\S]*?>/g;

code = code.replace(sectionRegex, (match, Icon, Title, Subtitle) => {
  return `
        <div className="space-y-6 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-800">
              <${Icon} className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">${Title}</h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">${Subtitle}</p>
          </div>
          <div className="ml-7">
`;
});

// Replace the closing tags of the accordions
// original: </motion.div>\n            )}\n          </AnimatePresence>\n        </div>
const closingRegex = /<\/motion\.div>\s*?\)\}\s*?<\/AnimatePresence>\s*?<\/div>/g;
code = code.replace(closingRegex, '</div></div>');

// Replace the outer container to match the white bg style
// <div className="space-y-6 text-left relative" id="candidate-form-container">
code = code.replace(/<div className="space-y-6 text-left relative" id="candidate-form-container">/, '<div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 text-left space-y-10" id="candidate-form-container">');

// Remove Expand All / Collapse All buttons as they are no longer needed
const buttonsRegex = /<div className="flex space-x-2 shrink-0\">[\s\S]*?<\/div>/;
code = code.replace(buttonsRegex, '');

fs.writeFileSync('src/pages/CandidateFormPage.tsx', code);
console.log('Transformation complete');

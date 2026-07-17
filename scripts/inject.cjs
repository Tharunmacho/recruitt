const fs = require('fs');

const handlersToAdd = `
  const handleWhatsAppChange = (e) => {
    const val = e.target.value.replace(/\\D/g, '');
    if (val.length <= 10) {
      handleTextChange('whatsappNumber', val);
    }
  };

  const handlePrimaryNumberChange = (e) => {
    const val = e.target.value.replace(/\\D/g, '');
    if (val.length <= 10) {
      handleTextChange('primaryNumber', val);
      if (profile.whatsappSameAsPrimary) {
        handleTextChange('whatsappNumber', val);
      }
    }
  };

  const handleFamilyNumberChange = (e) => {
    const val = e.target.value.replace(/\\D/g, '');
    if (val.length <= 10) {
      handleTextChange('familyMemberNumber', val);
    }
  };

  const toggleSameAsPrimary = (e) => {
    const checked = e.target.checked;
    handleTextChange('whatsappSameAsPrimary', checked);
    if (checked) {
      handleTextChange('whatsappNumber', profile.primaryNumber || '');
    }
  };
`;

const formSectionsToAdd = `
        {/* Added New Form Sections */}
        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-800">
              <Globe className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">Job Preference & Contact Details</h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">Career preferences and contact information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ml-7">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Country Looking For <span className="text-red-500">*</span></label>
              <select
                value={profile.countryLookingFor || ''}
                onChange={(e) => handleTextChange('countryLookingFor', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select preferred country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Preference <span className="text-red-500">*</span></label>
              <select
                value={profile.jobPreference || ''}
                onChange={(e) => handleTextChange('jobPreference', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select job preference</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Skill</label>
              <select
                value={profile.skill || ''}
                onChange={(e) => handleTextChange('skill', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select or search skill</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Python">Python</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Passport Available <span className="text-red-500">*</span></label>
              <select
                value={profile.passportAvailable || ''}
                onChange={(e) => handleTextChange('passportAvailable', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Primary Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={profile.primaryNumber || ''}
                onChange={handlePrimaryNumberChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Family Member Number</label>
              <input
                type="text"
                value={profile.familyMemberNumber || ''}
                onChange={handleFamilyNumberChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 xl:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">WhatsApp Number</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.whatsappSameAsPrimary || false}
                    onChange={toggleSameAsPrimary}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 border-slate-300"
                  />
                  <span className="text-sm text-slate-700 font-medium">Same as Primary</span>
                </label>
              </div>
              <div className="flex">
                <div className="relative">
                  <select className="appearance-none rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="+91">+91</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={profile.whatsappNumber || ''}
                  onChange={handleWhatsAppChange}
                  disabled={profile.whatsappSameAsPrimary}
                  placeholder="Enter 10-digit number"
                  className={\`flex-1 rounded-r-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 \${profile.whatsappSameAsPrimary ? 'opacity-70 cursor-not-allowed' : ''}\`}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Selected: India (+91) - Requires 10 digits</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-800">
              <MessageSquare className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">Assessment & Preferences</h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">Candidate assessment and communication preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ml-7">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Source <span className="text-red-500">*</span></label>
              <select
                value={profile.source || ''}
                onChange={(e) => handleTextChange('source', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select source</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Job Board">Job Board</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Duration Preference <span className="text-red-500">*</span></label>
              <select
                value={profile.jobDurationPreference || ''}
                onChange={(e) => handleTextChange('jobDurationPreference', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select preference</option>
                <option value="Long Term">Long Term</option>
                <option value="Short Term">Short Term</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Service Charges Status <span className="text-red-500">*</span></label>
              <select
                value={profile.serviceChargesStatus || ''}
                onChange={(e) => handleTextChange('serviceChargesStatus', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Best Time to Contact <span className="text-red-500">*</span></label>
              <select
                value={profile.bestTimeToContact || ''}
                onChange={(e) => handleTextChange('bestTimeToContact', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>

          <div className="ml-7 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Interest Level <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'More Interested')}
                className={\`py-3 px-4 rounded-lg border text-sm font-semibold transition-all \${profile.interestLevel === 'More Interested' ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm' : 'border-slate-200 text-emerald-500 hover:bg-slate-50'}\`}
              >
                More Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Interested')}
                className={\`py-3 px-4 rounded-lg border text-sm font-semibold transition-all \${profile.interestLevel === 'Interested' ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' : 'border-slate-200 text-blue-500 hover:bg-slate-50'}\`}
              >
                Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Somewhat Interested')}
                className={\`py-3 px-4 rounded-lg border text-sm font-semibold transition-all \${profile.interestLevel === 'Somewhat Interested' ? 'bg-yellow-50 border-yellow-500 text-yellow-600 shadow-sm' : 'border-slate-200 text-yellow-500 hover:bg-slate-50'}\`}
              >
                Somewhat Interested
              </button>
              <button
                type="button"
                onClick={() => handleTextChange('interestLevel', 'Not Interested')}
                className={\`py-3 px-4 rounded-lg border text-sm font-semibold transition-all \${profile.interestLevel === 'Not Interested' ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' : 'border-slate-200 text-red-500 hover:bg-slate-50'}\`}
              >
                Not Interested
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 pb-6 border-t border-slate-200 pt-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-800">
              <Clock className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-bold">Follow-up & Notes</h2>
            </div>
            <p className="text-sm text-slate-500 ml-7">Follow-up scheduling and telemarketer observations</p>
          </div>

          <div className="ml-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Next Follow-up Date</label>
                <input
                  type="date"
                  value={profile.nextFollowUpDate || ''}
                  onChange={(e) => handleTextChange('nextFollowUpDate', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2 lg:col-span-1">
                <label className="text-sm font-semibold text-slate-700">Assigned to (HR staff)</label>
                <select
                  value={profile.assignedToHR || ''}
                  onChange={(e) => handleTextChange('assignedToHR', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select HR staff</option>
                  <option value="HR 1">HR 1</option>
                  <option value="HR 2">HR 2</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Telemarketer Notes</label>
              <textarea
                value={profile.telemarketerNotes || ''}
                onChange={(e) => handleTextChange('telemarketerNotes', e.target.value)}
                placeholder="Enter observations and notes from the call..."
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Upload Voice Recording (Legacy)</label>
              <div className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 px-3 text-sm text-slate-700">
                <input 
                  type="file" 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer" 
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 block">Live Voice Recording</label>
                <p className="text-sm text-slate-500">Record voice directly using your microphone</p>
              </div>
              <button type="button" className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer w-max">
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            </div>
          </div>
        </div>
`;

let code = fs.readFileSync('src/pages/CandidateFormPage.tsx', 'utf8');

// Insert imports
code = code.replace(/import \\{([\\s\\S]*?)\\} from 'lucide-react';/, (match, group) => {
  return "import {" + group + `  Globe,
  MessageSquare,
  Clock,
  Mic,
} from 'lucide-react';`;
});

// Insert handlers before return
code = code.replace("  return (", handlersToAdd + '\n  return (');

// Insert form sections before "Declaration and Action buttons"
code = code.replace("        {/* Declaration and Action buttons */}", formSectionsToAdd + '\n        {/* Declaration and Action buttons */}');

fs.writeFileSync('src/pages/CandidateFormPage.tsx', code);
console.log('Successfully injected new sections!');

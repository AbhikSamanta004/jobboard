import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { Building2, Globe, FileText, Camera } from 'lucide-react';

export default function RecruiterCompany() {
  const { profile, updateProfile } = useAuth();
  
  // State variables for form fields
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync profile details to local states
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || '');
      setCompanyLogo(profile.companyLogo || '');
      setWebsite(profile.website || '');
      setIndustry(profile.industry || '');
      setCompanySize(profile.companySize || '1-10');
      setDescription(profile.description || '');
    }
  }, [profile]);

  // Handle company logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        companyName,
        companyLogo,
        website,
        industry,
        companySize,
        description,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 glass-card p-6 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-white mb-2">Company Profile</h1>
            <p className="text-slate-400 text-sm mb-8">Maintain details about your company. This information will auto-populate your job listings.</p>

            <form onSubmit={handleCompanySubmit} className="space-y-6">
              
              {/* Logo + Name Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                <div className="relative group flex-shrink-0">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="w-24 h-24 rounded-2xl object-contain border-2 border-primary-500 bg-slate-900 p-2"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center font-bold text-3xl text-slate-500">
                      {companyName ? companyName.charAt(0) : 'C'}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corp"
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 w-full max-w-md"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Website */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Company Website</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://acme.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Industry Sector</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Technology, Healthcare"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                    />
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Company Size</label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">About The Company</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your company culture, mission, and work environment..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white rounded-xl text-xs font-semibold shadow-lg shadow-primary-600/15"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Save Company Profile</span>
                  )}
                </button>
              </div>

            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

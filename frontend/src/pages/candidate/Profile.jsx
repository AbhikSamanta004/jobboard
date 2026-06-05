import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { User, Mail, BookOpen, Briefcase, Plus, Trash2, FileText, Camera, Eye } from 'lucide-react';

export default function CandidateProfile() {
  const { user, profile, updateProfile, loading } = useAuth();
  
  // State variables for form fields
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [resume, setResume] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync profile data to local state
  useEffect(() => {
    if (user) setName(user.name || '');
    if (profile) {
      setAvatar(profile.avatar || '');
      setSkillsStr(profile.skills ? profile.skills.join(', ') : '');
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
      setResume(profile.resume || '');
      setResumeName(profile.resumeName || '');
    }
  }, [user, profile]);

  // Handle image avatar uploads
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF resume uploads
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF document only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResume(reader.result);
      setResumeName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Add items dynamically
  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', duration: '', description: '' }]);
  };

  const removeExperience = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx));
  };

  const handleExpChange = (idx, field, val) => {
    const updated = experience.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setExperience(updated);
  };

  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', field: '', year: '' }]);
  };

  const removeEducation = (idx) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const handleEduChange = (idx, field, val) => {
    const updated = education.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: val };
      }
      return item;
    });
    setEducation(updated);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse skills
    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      await updateProfile({
        name,
        avatar,
        skills,
        experience,
        education,
        resume,
        resumeName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Function to view PDF base64 file in new tab
  const handleViewResume = () => {
    if (!resume) return;
    const newTab = window.open();
    newTab.document.write(
      `<iframe src="${resume}" width="100%" height="100%" style="border:0; position:fixed; top:0; left:0; right:0; bottom:0;"></iframe>`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <main className="flex-1 glass-card p-6 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-white mb-2">My Candidate Profile</h1>
            <p className="text-slate-400 text-sm mb-8">Update your portfolio, skills, experience history, and resume to match recruiter requests.</p>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
              
              {/* Header profile photo + credentials */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                <div className="relative group">
                  {avatar ? (
                    <img src={avatar} alt="Profile photo" className="w-24 h-24 rounded-full object-cover border-2 border-primary-500 bg-slate-900" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center font-bold text-3xl text-slate-500">
                      {name ? name.charAt(0) : 'U'}
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-3 flex-1 w-full">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500/50 w-full max-w-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email (Non-Editable)</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-slate-950/40 border border-slate-900 rounded-xl px-4 py-2 text-sm text-slate-500 w-full max-w-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-base">Professional Skills</h3>
                <p className="text-slate-400 text-xs">Enter your skills separated by commas (e.g. React, Node, Python, Design)</p>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="React, Javascript, Node.js"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              {/* PDF Resume upload */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Resume PDF</h3>
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-850">
                      <FileText className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {resumeName ? resumeName : 'No resume uploaded'}
                      </p>
                      <p className="text-[10px] text-slate-500">PDF documents only (max 16MB)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {resume && (
                      <button
                        type="button"
                        onClick={handleViewResume}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-850"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    )}
                    <label className="px-3.5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-md shadow-primary-600/15">
                      <span>Upload PDF</span>
                      <input type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Experience list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-slate-400" />
                    <span>Work Experience</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-350 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Role</span>
                  </button>
                </div>

                {experience.length === 0 ? (
                  <p className="text-slate-550 text-xs italic">No experience records added yet.</p>
                ) : (
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
                      <div key={index} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 relative space-y-3">
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Job Title</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleExpChange(index, 'title', e.target.value)}
                              placeholder="Frontend Engineer"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExpChange(index, 'company', e.target.value)}
                              placeholder="Google"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Duration</label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => handleExpChange(index, 'duration', e.target.value)}
                              placeholder="Jan 2022 - Present"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={exp.description}
                            onChange={(e) => handleExpChange(index, 'description', e.target.value)}
                            placeholder="Describe your accomplishments..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Education list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-400" />
                    <span>Education History</span>
                  </h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-350 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {education.length === 0 ? (
                  <p className="text-slate-550 text-xs italic">No education records added yet.</p>
                ) : (
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={index} className="p-4 rounded-xl border border-slate-800 bg-slate-950/20 relative space-y-3">
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">School / Uni</label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => handleEduChange(index, 'school', e.target.value)}
                              placeholder="Stanford University"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEduChange(index, 'degree', e.target.value)}
                              placeholder="B.S."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => handleEduChange(index, 'field', e.target.value)}
                              placeholder="Computer Science"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => handleEduChange(index, 'year', e.target.value)}
                              placeholder="2024"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-800/80 justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Save Profile Settings</span>
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

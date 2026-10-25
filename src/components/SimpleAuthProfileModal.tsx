/**
 * YogaFlow AI - Executive Profile & Account Management Studio
 * World-class fitness technology UI with local device photo upload, biometric metrics,
 * customizable profile settings, role switching, and clean symmetry.
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATARS } from '../data/mockData';
import {
  Activity,
  Award,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Mail,
  RotateCcw,
  Scale,
  ShieldCheck,
  Target,
  Upload,
  User,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';

interface SimpleAuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleAuthProfileModal: React.FC<SimpleAuthProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    activeRole,
    switchRole,
    updateUserProfile,
    updateUserAvatar,
    createNewUser,
    resetUserData,
    setActiveTab,
    sessions,
  } = useApp();

  // Mode: 'edit' or 'create'
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit');

  // Form states
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [selectedRole, setSelectedRole] = useState<'student' | 'instructor'>(activeRole);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar);
  const [weightKg, setWeightKg] = useState(currentUser.weightKg || 65);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(currentUser.weeklyGoalMinutes || 120);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Real aggregate stats for the profile metrics ribbon
  const totalPracticeMinutes = Math.round(
    sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
  );
  const averageAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.averageAccuracy, 0) / sessions.length)
      : 0;

  // Handle device image upload (PC or Mobile)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
          updateUserAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes to current profile
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      avatar: avatarUrl,
      weightKg: Number(weightKg) || 65,
      weeklyGoalMinutes: Number(weeklyGoalMinutes) || 120,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  // Create new user profile
  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    createNewUser({
      name: name.trim() || 'New User',
      email: email.trim() || 'user@yogaflow.ai',
      role: selectedRole,
      avatar: avatarUrl,
      weightKg: Number(weightKg) || 65,
      weeklyGoalMinutes: Number(weeklyGoalMinutes) || 120,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  // Reset local demo data
  const handleResetData = () => {
    if (window.confirm('Reset all demo practice history, test sessions, and bookings?')) {
      resetUserData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Outer container */}
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-gradient-to-b from-[#111827] via-[#0b101e] to-[#070b14] border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.15)] p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Decorative lighting blurs */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight leading-none">
                  Account & Profile Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {activeRole === 'instructor' ? 'Instructor' : 'Student'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Personal details, avatar image, biometric targets, and role access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors border border-slate-700 shadow-sm cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Executive KPI Metrics Ribbon */}
        {modalMode === 'edit' && (
          <div className="grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner">
            <div className="text-center p-1.5 rounded-xl bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> Accuracy
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-cyan-300">
                {averageAccuracy > 0 ? `${averageAccuracy}%` : '—'}
              </span>
            </div>

            <div className="text-center p-1.5 rounded-xl bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-violet-400" /> Practice
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-white">
                {totalPracticeMinutes} <span className="text-[10px] font-normal text-slate-400">min</span>
              </span>
            </div>

            <div className="text-center p-1.5 rounded-xl bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" /> Sessions
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
                {sessions.length}
              </span>
            </div>

            <div className="text-center p-1.5 rounded-xl bg-slate-800/40">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Streak
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-amber-400">
                {currentUser.streakDays} <span className="text-[10px] font-normal text-slate-400">days</span>
              </span>
            </div>
          </div>
        )}

        {/* Segmented Mode Selector: Active Profile vs Create New User */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setModalMode('edit');
              setName(currentUser.name);
              setEmail(currentUser.email);
              setAvatarUrl(currentUser.avatar);
              setWeightKg(currentUser.weightKg || 65);
              setWeeklyGoalMinutes(currentUser.weeklyGoalMinutes || 120);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modalMode === 'edit'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Active Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setModalMode('create');
              setName('');
              setEmail('');
              setAvatarUrl(DEFAULT_AVATARS[1]);
              setWeightKg(65);
              setWeeklyGoalMinutes(120);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              modalMode === 'create'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Avatar Upload & Customization Section */}
        <div className="relative p-4 sm:p-5 rounded-2xl bg-[#0e1628]/90 border border-slate-700/80 space-y-3.5 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>Profile Photo (Avatar)</span>
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Avatar
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            {/* Interactive Avatar */}
            <div className="relative group shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden ring-2 ring-violet-400/80 group-hover:ring-cyan-400 transition-all cursor-pointer shadow-xl"
                title="Click to change profile picture"
              >
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold gap-1">
                  <Camera className="w-5 h-5 text-cyan-300" />
                  <span>Change</span>
                </div>
              </div>

              {/* Floating Upload Mini-Pill */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md border border-violet-300 transition-colors cursor-pointer"
                title="Upload image from device"
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>

            {/* Hidden File Input for Native File Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar Upload Actions & Presets */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs border border-violet-400 transition-all inline-flex items-center gap-2 shadow-md hover:shadow-violet-600/30 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Upload Image from Device</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Select any JPG, PNG, or WebP photo from your computer or phone
              </p>

              {/* Preset Avatars Row */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Preset options:</span>
                {DEFAULT_AVATARS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setAvatarUrl(preset);
                      updateUserAvatar(preset);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      avatarUrl === preset
                        ? 'border-cyan-400 scale-110 shadow-md ring-2 ring-cyan-400/50'
                        : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                    }`}
                  >
                    <img src={preset} alt={`Avatar Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role Designation Cards */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider block">
            Account Role & Access
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Student Role */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                if (modalMode === 'edit') switchRole('student');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                (modalMode === 'edit' ? activeRole === 'student' : selectedRole === 'student')
                  ? 'bg-gradient-to-br from-violet-950/80 to-[#121a30] border-violet-500 shadow-lg shadow-violet-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              {(modalMode === 'edit' ? activeRole === 'student' : selectedRole === 'student') && (
                <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className={`w-4 h-4 ${(modalMode === 'edit' ? activeRole === 'student' : selectedRole === 'student') ? 'text-violet-400' : 'text-slate-400'}`} />
                <span className="font-bold text-xs text-white">Student Portal</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Practice with real-time AI webcam feedback and book private lessons
              </p>
            </button>

            {/* Instructor Role */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('instructor');
                if (modalMode === 'edit') switchRole('instructor');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                (modalMode === 'edit' ? activeRole === 'instructor' : selectedRole === 'instructor')
                  ? 'bg-gradient-to-br from-indigo-950/80 to-[#121a30] border-indigo-500 shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              {(modalMode === 'edit' ? activeRole === 'instructor' : selectedRole === 'instructor') && (
                <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className={`w-4 h-4 ${(modalMode === 'edit' ? activeRole === 'instructor' : selectedRole === 'instructor') ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="font-bold text-xs text-white">Instructor Portal</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Pass assessment, earn verification certificate, and accept bookings
              </p>
            </button>
          </div>
        </div>

        {/* Instructor Accreditation Alert (If instructor role is chosen) */}
        {(modalMode === 'edit' ? activeRole === 'instructor' : selectedRole === 'instructor') && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/50 flex items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2.5 text-indigo-200">
              <Award className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-[11px]">Instructor Qualification</p>
                <p className="text-[10px] text-indigo-300">
                  {currentUser.instructorData?.isEligible
                    ? `Certified Instructor: ${currentUser.instructorData?.assessmentScore || 92}% score`
                    : 'Computer-vision assessment qualification required (≥ 85%)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveTab('assessment');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs whitespace-nowrap shadow-sm border border-cyan-400 transition-colors cursor-pointer"
            >
              Take Assessment
            </button>
          </div>
        )}

        {/* User Information Form */}
        <form
          onSubmit={modalMode === 'create' ? handleCreateNewUser : handleSaveEdit}
          className="space-y-4 text-xs"
        >
          {/* Name & Email Symmetrical Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 font-medium transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 font-medium transition-all"
              />
            </div>
          </div>

          {/* Weight & Goal (Symmetric Grid) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Body Weight</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">kg</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={30}
                  max={200}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold pointer-events-none">
                  KG
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Weekly Goal</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">min</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={15}
                  max={1000}
                  step={15}
                  value={weeklyGoalMinutes}
                  onChange={(e) => setWeeklyGoalMinutes(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700/90 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold pointer-events-none">
                  MIN
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide shadow-xl transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                modalMode === 'create'
                  ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:brightness-110 border-cyan-400 shadow-cyan-600/30'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:brightness-110 border-violet-400 shadow-violet-600/30'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>{modalMode === 'create' ? 'Account Created Successfully!' : 'Profile Saved Successfully!'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{modalMode === 'create' ? 'Create Account & Begin' : 'Save Profile Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer: Privacy Note & Reset Utility */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>All biometric profile data stored securely on-device</span>
          </div>

          <button
            type="button"
            onClick={handleResetData}
            className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
            title="Reset demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{resetSuccess ? 'Reset Complete' : 'Reset Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

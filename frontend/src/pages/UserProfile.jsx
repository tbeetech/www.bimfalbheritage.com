import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../services/api';
import './Auth.css';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    setProfileLoading(true);
    try {
      await updateUserProfile({ name, bio, avatar });
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileError(err?.response?.data?.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    setPwdError('');
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match');
      return;
    }
    if (newPwd.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword(currentPwd, newPwd);
      setPwdMsg('Password changed successfully!');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err) {
      setPwdError(err?.response?.data?.message || 'Password change failed');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user.name?.trim()
    ? user.name.trim().split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page">
      <header className="page-header">
        <h1>My Profile</h1>
        <p>Manage your Bimfalb Heritage account</p>
      </header>

      <div className="profile-layout">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar card">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-initials">{initials}</div>
            )}
          </div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-email muted">{user.email}</div>
          {user.bio && <p className="profile-bio">{user.bio}</p>}
          <button type="button" className="btn profile-logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="profile-main">
          {/* Edit profile */}
          <section className="profile-section card">
            <h2>Edit Profile</h2>
            {profileMsg && <div className="auth-success">{profileMsg}</div>}
            {profileError && <div className="auth-error">{profileError}</div>}
            <form className="auth-form" onSubmit={handleProfileSave}>
              <div className="auth-field">
                <label htmlFor="p-name">Display Name</label>
                <input
                  id="p-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="p-avatar">Avatar URL</label>
                <input
                  id="p-avatar"
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="auth-field">
                <label htmlFor="p-bio">Bio</label>
                <textarea
                  id="p-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself…"
                  rows={3}
                  className="auth-textarea"
                />
              </div>
              <button type="submit" className="btn" disabled={profileLoading}>
                {profileLoading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* Change password */}
          <section className="profile-section card">
            <h2>Change Password</h2>
            {pwdMsg && <div className="auth-success">{pwdMsg}</div>}
            {pwdError && <div className="auth-error">{pwdError}</div>}
            <form className="auth-form" onSubmit={handlePasswordChange}>
              <div className="auth-field">
                <label htmlFor="cur-pwd">Current Password</label>
                <input
                  id="cur-pwd"
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Current password"
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="new-pwd">New Password</label>
                <input
                  id="new-pwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="confirm-pwd">Confirm New Password</label>
                <input
                  id="confirm-pwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
              </div>
              <button type="submit" className="btn" disabled={pwdLoading}>
                {pwdLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

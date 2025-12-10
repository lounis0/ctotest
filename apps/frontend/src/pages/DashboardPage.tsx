import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardPage = () => {
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProfile(firstName, lastName);
      setIsEditing(false);
    } catch {
      // Error is handled by the store
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page dashboard-page">
      <h2>Dashboard</h2>

      <div className="user-card">
        <h3>Welcome, {user.firstName || user.email}!</h3>

        {!isEditing && (
          <div className="user-info">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>First Name:</strong> {user.firstName || 'Not set'}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName || 'Not set'}
            </p>
            <button onClick={() => setIsEditing(true)} disabled={isLoading}>
              Edit Profile
            </button>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} disabled={isLoading}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn" disabled={isLoading}>
        Logout
      </button>
    </div>
  );
};

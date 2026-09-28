import React, { useState, useEffect } from 'react';

// Make sure this matches your ASP.NET Core API URL and Port
const API_URL = 'https://localhost:7223/api/User';

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    firstName: '',
    midName: '',
    lastName: '',
    mobileNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch all users on component load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. Submit Form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        // PUT: Update User
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update user');
      } else {
        // POST: Create User
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to add user');
      }

      resetForm();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Populate form for editing
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      firstName: user.firstName || '',
      midName: user.midName || '',
      lastName: user.lastName || '',
      mobileNumber: user.mobileNumber || ''
    });
    setIsEditing(true);
  };

  // 3. Delete User
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      id: 0,
      firstName: '',
      midName: '',
      lastName: '',
      mobileNumber: ''
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h1>User Management System</h1>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* FORM SECTION */}
      <section>
        <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name: </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Middle Name: </label>
            <input
              type="text"
              name="midName"
              value={formData.midName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name: </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Mobile Number: </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <button type="submit">
            {isEditing ? 'Update User' : 'Add User'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <hr />

      {/* TABLE SECTION */}
      <section>
        <h2>User List</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table border="1" cellPadding="6" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.firstName}</td>
                    <td>{u.midName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.mobileNumber}</td>
                    <td>
                      <button onClick={() => handleEdit(u)}>Edit</button>{' '}
                      <button onClick={() => handleDelete(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
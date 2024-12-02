import React, { useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "JohnDoe", email: "john@example.com", role: "admin" },
    { id: 2, username: "JaneSmith", email: "jane@example.com", role: "user" },
  ]);

  const [selectedUser, setSelectedUser] = useState(null); // For editing user
  const [isEditing, setIsEditing] = useState(false); // Modal state

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const saveUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsEditing(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Username</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2">{user.username}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveUser(selectedUser);
              }}
            >
              <div className="mb-3">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Role</label>
                <input
                  type="text"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="border p-2 w-full"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";

const Users = () => {
  const [auth] = useAuth();
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API}/api/v1/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleDelete = async (id, name) => {
    const confirm = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!confirm) return;

    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API}/api/v1/auth/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("User deleted");
        getAllUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <LayoutTheme title={"Dashboard - All Users"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h4>All Registered Users</h4>
            <div className='table-responsive mt-4'>
              <table className='table table-bordered table-hover'>
                <thead className='table-dark'>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u._id}>
                      <td>{index + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.address}</td>
                      <td>
                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => handleDelete(u._id, u.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className='text-center'>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Users;

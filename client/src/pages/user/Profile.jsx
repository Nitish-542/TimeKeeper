import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import LayoutTheme from "../../components/Layout/LayoutTheme";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const { email, name, phone, address } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
        }
      );
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <LayoutTheme title={"Your Profile"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div className='container p-5'>
              <form onSubmit={handleSubmit}>
                <h4 className='title'>USER PROFILE</h4>
                <div className='mb-3'>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='form-control'
                    id='exampleInputEmail1'
                    placeholder='Enter Your Name'
                    autoFocus
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='form-control'
                    id='exampleInputEmail1'
                    placeholder='Enter Your Email '
                    disabled
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='form-control'
                    id='exampleInputPassword1'
                    placeholder='Enter Your Password'
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='text'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='form-control'
                    id='exampleInputEmail1'
                    placeholder='Enter Your Phone'
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className='form-control'
                    id='exampleInputEmail1'
                    placeholder='Enter Your Address'
                  />
                </div>

                <button type='submit' className='btn btn-primary'>
                  UPDATE
                </button>
                <div className="mt-4">
  <button
    className="btn btn-outline-danger"
    onClick={async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      );
      if (!confirmDelete) return;

      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_API}/api/v1/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        if (data?.success) {
          toast.success("Account deleted");
          localStorage.removeItem("auth");
          setAuth({ user: null, token: "" });
          window.location.href = "/";
        } else {
          toast.error(data?.message || "Failed to delete account");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    }}
  >
    Delete My Account
  </button>
</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutTheme>
  );
};

export default Profile;

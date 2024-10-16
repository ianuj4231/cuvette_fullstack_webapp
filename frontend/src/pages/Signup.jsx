import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import React, { useState } from 'react';
import { backend_url } from '../config'; 
const baseUrl = backend_url;

function Signup() {

    const [formdata, setFormdata] = useState({
        name: "",
        phoneNumber: "",
        companyName: "",
        companyEmail: "",
        employeeSize: 0
    })

    const navigate = useNavigate();

    function handleChange(e) {
        const {name, value} = e.target;
        setFormdata((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/api/v1/company/signup`,  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formdata)
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                toast.success('Signup successful!');
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", formdata.name);
                localStorage.setItem("companyEmail", formdata.companyEmail)
                localStorage.setItem("phoneNumber", formdata.phoneNumber)
                navigate("/company/VerifyEmailAndPhone");
            } else {
                throw new Error(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error("Error:", error.message);
            toast.error(`Error: ${error.message}`);
        }
    }

    return (
        <div>
            <h1>Signup Page</h1>
            <div style={{ display: "flex" }} >
                <span style={{ flex: 1 }}>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting.Lorem Ipsum is simply dummy text of the printing and typesetting.Lorem Ipsum is simply dummy text of the printing and typesetting.


                    </p>
                </span>

                <span style={{ flex: 1 }} >
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"  name="name" placeholder="Name" value={formdata.name} onChange={handleChange} required
                        />
                        <br></br>
                        <input
                            type="email"   name="companyEmail" placeholder="Company Email" value={formdata.companyEmail}
                            onChange={handleChange} required
                        />
                        <br></br>
                        <input
                            type="text" name="phoneNumber" placeholder="Phone Number" value={formdata.phoneNumber}
                            onChange={handleChange} required
                        />
                        <br></br>
                        <input
                            type="text"   name="companyName" placeholder="Company Name"
                            value={formdata.companyName}  onChange={handleChange}
                            required
                        />
                        <br></br>
                        <input
                            type="number"  name="employeeSize" placeholder="Enter employee size" value={formdata.employeeSize}
                            onChange={handleChange} required
                        />
                        <br />
                        <button type="submit">Sign Up</button>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default Signup;

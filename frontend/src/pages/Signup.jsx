import '../App.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import React, { useState } from 'react';
import { backend_url } from '../config'; 
import NavbarSignup from '../components/Navbar1';
import { MdOutlinePersonOutline, MdOutlinePhone } from "react-icons/md"; 
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";

const baseUrl = backend_url;

function Signup() {

    const [formdata, setFormdata] = useState({
        name: "",
        phoneNumber: "+91",
        companyName: "",
        companyEmail: "",
        employeeSize: 
        ""
    })

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
    
        if (name === "employeeSize") {
            if (isNaN(value)) {
                toast.error('Please enter a valid number for employee size.');
                return;
            }
            setFormdata((prev) => ({ ...prev, [name]: Number(value) }));
        } else if (name === "phoneNumber") {
            const cleanedValue = value.replace(" ", "");
            setFormdata((prev) => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormdata((prev) => ({ ...prev, [name]: value }));
        }
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
            <NavbarSignup />
            <div className="signup-container">
        <div className="signup-info">
            <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.
            </p>
        </div>

        <div className="signup-form">
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
               
            <div className="input-group">
                    <MdOutlinePersonOutline className="input-icon" />
                    <input
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        value={formdata.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="input-group">
                <MdOutlinePersonOutline className="input-icon" />
               
                <input
                    type="text" 
                    name="companyName" 
                    placeholder="Company Name"
                    value={formdata.companyName}  
                    onChange={handleChange}
                    required 
                />
                </div>
                <div className="input-group">
                <FaRegEnvelopeOpen  className="input-icon" style={{fontsize: "20px"}}/>
                <input
                    type="email" 
                    name="companyEmail" 
                    placeholder="Company Email" 
                    value={formdata.companyEmail}
                    onChange={handleChange} 
                    required 
                />
                </div>

                 <div className="input-group">
                    <MdOutlinePhone className="input-icon" />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formdata.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
               

                
                <div className="input-group">
                            <FaPeopleGroup className="input-icon" />
                            <input
                                type="text" placeholder="Enter employee size"
                                name="employeeSize"
                                value={formdata.employeeSize}
                                onChange={handleChange}
                                required
                            />
                        </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    </div>
        </div>

    );
}

export default Signup;

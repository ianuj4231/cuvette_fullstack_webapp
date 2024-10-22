import React, { useEffect, useState } from 'react';
import axios from "axios";
import { backend_url } from '../config';
import "../App.css";
import Navbar2 from '../components/Navbar2';
import Navbar1 from '../components/Navbar1';

const baseUrl = backend_url;

function VerifyEmailAndPhone() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showOtpInputEmail, setShowOtpInputEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");

  useEffect(() => {
    async function fetchVerificationStatus() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsTokenValid(true);
        }
        
        const response = await axios.get(`${baseUrl}/api/v1/company/getVerifiedStatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        
        if (response.data.isVerified.email) {
          setIsEmailVerified(true);
        }
        if (response.data.isVerified.phoneNumber) {
          setIsPhoneVerified(true);          
        }
      } catch (error) {
        console.error("Error fetching verification status:", error);
      }
    }
    fetchVerificationStatus();
  }, []);

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePhone(e) {
    const { value } = e.target;
    if (value.includes(' ')) {
      return;
    }
    setPhone(value.trim());
  }
   

  
  async function handleSubmitPhone(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/company/verifyPhone`,
        { phoneNumber: phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      setShowOtpInput(true);
    } catch (error) {
      console.error('Error:', error.response.data.message);
    }
  }

  function handleChangeOtpPhone(e) {
    setPhoneOtp(e.target.value);
  }

  async function handleSubmitOtp(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/company/verifyPhone2`,
        {
          phoneNumber: phone,
          enteredOtp: phoneOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('OTP verified successfully!');
      setIsPhoneVerified(true); 
      setShowOtpInput(false); // Hide OTP input after successful verification
      setPhoneOtp(""); // Clear the OTP input field
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data.message);
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  }

  async function handleSubmitEmail(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/company/verifyEmail`,
        { companyEmail: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      setShowOtpInputEmail(true);
    } catch (error) {
      console.error('Error:', error.response.data.message);
    }
  }

  async function handleSubmitEmailOtp(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/company/verifyEmail2`,
        {
          companyEmail: email,
          enteredOtp: emailOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      alert('Email OTP verified successfully!');
      setIsEmailVerified(true);
      setShowOtpInputEmail(false); // Hide OTP input after successful verification
      setEmailOtp(""); // Clear the OTP input field
    } catch (error) {
      console.error('Error:', error.response.data.message);
    }
  }

  return (
    <div>
      {isTokenValid ? <Navbar2 /> : <Navbar1 />}
      <div className="verify-email-container">
        <div className="verify-email-left">
          <br />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting...
          </p>
        </div>

        <div className="verify-email-right">
          <h2>Phone number and Email Verification</h2>
          
          {isPhoneVerified ? (
            <input
              type="text"
              value={"Phone verified successfully ✅"}
              readOnly
            />
          ) : (
            <form onSubmit={handleSubmitPhone}>
              <input
                type="text"
                value={phone}
                onChange={handleChangePhone}
                placeholder="Enter your phone number"
                required
              />
              <button type="submit">Get OTP</button>
            </form>
          )}

          {showOtpInput && !isPhoneVerified && (
            <form onSubmit={handleSubmitOtp}>
              <input
                type="text"
                value={phoneOtp}
                onChange={handleChangeOtpPhone}
                placeholder="Enter your OTP"
                required
              />
              <button type="submit">Verify OTP</button>
            </form>
          )}

          <br />
          <br></br>
          {isEmailVerified ? (
            <input
              type="text"
              value={"Email verification successful ✅"}
              readOnly
            />
          ) : (
            <form onSubmit={handleSubmitEmail}>
              <input
                type="email"
                value={email}
                onChange={handleChangeEmail}
                placeholder="Enter your email"
                required
              />
              <button type="submit">Get OTP</button>
            </form>
          )}

          {showOtpInputEmail && !isEmailVerified && (
            <form onSubmit={handleSubmitEmailOtp}>
              <input
                value={emailOtp}
                type="text"
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter OTP sent to your mail"
                required
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailAndPhone;

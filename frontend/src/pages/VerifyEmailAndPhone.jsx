import React, { useEffect, useState } from 'react';
import axios from "axios"
import { backend_url } from '../config'; 
const baseUrl = backend_url;

function VerifyEmailAndPhone() {

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const[ phoneOtp , setPhoneOtp] = useState("")
  const[isemailverified, setIsemailverified] = useState(false);
  const[isphoneverified, setIsphoneverified] = useState(false);

  const [showOtpInputEmail, setShowOtpInputEmail] = useState(false);
  const[emailOtp, setEmailOtp ] = useState("");


  useEffect(()=>{
            async  function fetch(){
              try {
                const token = localStorage.getItem("token")
                const response = await axios.get(`${baseUrl}/api/v1/company/getVerifiedStatus`, {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log(response.data);
              if(response.data.email) {
                setIsemailverified(true)
              }
              if(response.data.phoneNumber){
                      setIsphoneverified(true);
              }

              } catch (error) {
                    console.log(error);
              }
            }
            fetch();

  }, [])

  function handleChangeEmail(e) {
    const { value } = e.target;
    setEmail(value);
  }

  function handleChangePhone(e) {
      setPhone(e.target.value);
  }


  async function handleSubmitPhone(e){
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
          const response = await axios.post(
            `${baseUrl}/api/v1/company/verifyPhone`, 
            {
              phoneNumber: phone,
            },
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

  function handleChangeOtpPhone(e){
          setPhoneOtp(e.target.value)
  }

  async function handleSubmitOtp(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let phone = localStorage.getItem("phoneNumber");
  
    if (phone[0] !== '+') {
      phone = `+91${phone}`; 
  }  
  
  try {
    const response = await axios.post(
      `${baseUrl}/api/v1/company/verifyPhone2`, 
        {
          phoneNumber: phone,
          enteredOtp: phoneOtp
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('OTP verified successfully!');
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

  async   function handleSubmitEmail(e){
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/company/verifyEmail`,
        {
          companyEmail: email,
        },
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

 async  function  handleSubmitEmailOtp(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
          const response = await axios.post(
            `${baseUrl}/api/v1/company/verifyEmail2`, 
            {
              companyEmail: email,
              enteredOtp: emailOtp
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Response:', response.data);
          setShowOtpInputEmail(false);
          setEmailOtp("")
          setIsemailverified(true)
        } catch (error) {
          console.error('Error:', error.response.data.message);
        }
   }

  return (
    <div>
      <h1>Verify Email Page</h1>
      <div style={{ display: "flex" }} >
        <span style={{ flex: 1 }}>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting.
          </p>
        </span>

        <span style={{ flex: 1 }} >
          <>
          {

            isphoneverified ? 

                <div>
                        phone number already verified
                        <br></br>
                </div>
            
            :   <form onSubmit={handleSubmitPhone} style={{ marginBottom: '20px' }}  >
            <input
              type="text" value={phone} onChange={handleChangePhone}
              placeholder="Enter your phone number" required
            />
                          <button type="submit">Get OTP</button> 

          </form>
          }
            
            {showOtpInput && (
              <form onSubmit={handleSubmitOtp}>
                <input
                  type="text"  value={phoneOtp}
                  onChange={handleChangeOtpPhone}
                  placeholder="Enter your OTP"  required
                />
                <button type="submit">Verify OTP</button>
              </form>
            )}
        <br>
        </br>
        <br></br>
            
        {
              isemailverified ?  
                <div>
                      Email already verified
                      <br></br>
                </div>          
          :

             <form onSubmit={handleSubmitEmail}  >
              <input
                type="email" value={email} onChange={handleChangeEmail} 
                placeholder="Enter your email" required
              />
              <button type="submit">Get OTP</button>
            </form>            
          }

              {
                showOtpInputEmail && <div>

                      <form  onSubmit={handleSubmitEmailOtp}>
                         
                                <input 
                                value={emailOtp}
                                type="text"
                                onChange={(e)=>{setEmailOtp(e.target.value)}} 
                                placeholder="Enter  OTP sent to your mail"  
                                required
                                />
                        <button type="submit">   submit  </button>
                      </form>

                </div>
              }


          </>
        </span>
      </div>
    </div>
  );
}

export default VerifyEmailAndPhone;
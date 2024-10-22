import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../config';
import Navbar3 from '../components/Navbar3';
import Sidebar1 from '../components/Sidebar1';
const baseUrl = backend_url;

function PostJob() {
    const nav = useNavigate();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [endDate, setEndDate] = useState('');
    const [emails, setEmails] = useState([]);
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetcher() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(
                    `${baseUrl}/api/v1/company/getVerifiedStatus`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const { email: isEmailVerified, phoneNumber: isPhoneNumberVerified } = response.data.isVerified;
                setIsVerified(isEmailVerified && isPhoneNumberVerified);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching verification status:', error);
                setLoading(false);
            }
        }
        fetcher();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const jobData = {
            title: jobTitle,
            description: jobDescription,
            experienceLevel,
            endDate,
            candidateEmails: emails
        };

        if (email) {
            jobData.candidateEmails.push(email);
        }

        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/company/postJob`, 
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            nav("/company/createInterview");
        } catch (error) {
            console.error('Error while posting job:', error);
        }
    }

    const handleAddEmail = (e) => {
        e.preventDefault();
        if (email) {
            setEmails((prevEmails) => [...prevEmails, email]);
            setEmail("");
        } else {
            alert("Please enter a valid email");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setEmails((prevEmails) => prevEmails.filter((email) => email !== emailToRemove));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isVerified) {
        return (
            <div>
                <h2>You must verify both your email and phone number before posting a job.</h2>
            </div>
        );
    }

    return (
        <div>
          <Navbar3 />
          <div className="content-container">
            <Sidebar1 />
            <div className="form-container">
            <h2>Job Posting Form</h2>
            <form onSubmit={handleSubmit} className="job-form">
                <div className="form-group">
                    <label>Job Title:</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Job Description:</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Experience Level:</label>
                    <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        required
                    >
                        <option value="">Select experience level</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-2">1-2 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value=">5">More than 5 years</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Add Candidate Emails:</label>
                    <div className="email-field">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter candidate email"
                        />
                        <button type="button" onClick={handleAddEmail}>Add Email</button>
                    </div>
                    {/* Container for the email list */}
                    <div className="email-list-container">
                        {emails.length > 0 && (
                            <div className="email-container">
                                {emails.map((emailItem, index) => (
                                    <div key={index} className="email-item">
                                        {emailItem}
                                        <button className="remove-email" onClick={() => handleRemoveEmail(emailItem)}>x</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit">Submit Job</button>
            </form>
            </div>
          </div>
        </div>
    );
}

export default PostJob;

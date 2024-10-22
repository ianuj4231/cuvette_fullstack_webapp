import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../config';
import Navbar2 from '../components/Navbar2';
import "../App.css";
const baseUrl = backend_url;

function CreateInterview() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVerificationStatus() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${baseUrl}/api/v1/company/getVerifiedStatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { email: isEmailVerified, phoneNumber: isPhoneNumberVerified } = response.data.isVerified;
        const verified = isEmailVerified && isPhoneNumberVerified;
        setIsVerified(verified);

        if (!verified) {
          navigate('/');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching verification status:', error);
        setLoading(false);
      }
    }
    fetchVerificationStatus();
  }, [navigate]);

  function fetchCandidates() {
    const token = localStorage.getItem('token');
    axios.get(`${baseUrl}/api/v1/company/getAllCandidates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setCandidates(response.data.candidateEmails);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching candidates:", error);
      });
  }

  useEffect(() => {
    if (isVerified) {
      fetchCandidates();
    }
  }, [isVerified]);

  function handleAccept(email) {
    const token = localStorage.getItem('token');
    axios.post(`${baseUrl}/api/v1/company/acceptCandidate`, { email }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setStatus(prevStatus => ({ ...prevStatus, [email]: 'accepted' }));
        Swal.fire({
          title: 'Candidate Accepted',
          text: `Candidate ${email} has been accepted!`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
          cancelButtonText: 'Undo'
        }).then((result) => {
          if (result.isDismissed) {
            setStatus(prevStatus => ({ ...prevStatus, [email]: undefined })); // Revert status
          }
        });
      })
      .catch(error => {
        console.error("Error accepting candidate:", error);
      });
  }

  function handleReject(email) {
    const token = localStorage.getItem('token');
    axios.post(`${baseUrl}/api/v1/company/rejectCandidate`, { email }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setStatus(prevStatus => ({ ...prevStatus, [email]: 'rejected' }));
        Swal.fire({
          title: 'Candidate Rejected',
          text: `Candidate ${email} has been rejected.`,
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          cancelButtonText: 'Undo'
        }).then((result) => {
          if (result.isDismissed) {
            setStatus(prevStatus => ({ ...prevStatus, [email]: undefined })); // Revert status
          }
        });
      })
      .catch(error => {
        console.error("Error rejecting candidate:", error);
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar2 />
      <h1>Create Interview Page</h1>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        {candidates.length > 0 ? (
          <table >
            <thead>
              <tr>
                <th style={{ border: '1px solid #000000', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #000000', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #000000', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((email, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #000000', padding: '8px' }}>{email}</td>
                  <td style={{ border: '1px solid #000000', padding: '8px' }}>
                    {status[email] === 'accepted' ? (
                      <span style={{ color: 'green' }}>Accepted ✅ (Mail sent)</span>
                    ) : status[email] === 'rejected' ? (
                      <span style={{ color: 'red' }}>Rejected ❌ (Mail sent)</span>
                    ) : (
                      'Pending'
                    )}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '8px' }}>
                    {status[email] === undefined && (
                      <>
                        <button onClick={() => handleAccept(email)} className="button-accept">
                                              Accept
                                            </button>
                                            <button onClick={() => handleReject(email)} className="button-reject">
                                              Reject
                                            </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No candidates found.</p>
        )}
      </div>
    </div>
  );
  
}

export default CreateInterview;

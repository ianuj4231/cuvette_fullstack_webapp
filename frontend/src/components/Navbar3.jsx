import { useEffect, useState } from "react";
import '../App.css';
import cuvettelogo from './static/cuvettelogo.png';
import { useNavigate } from "react-router-dom";

export default function Navbar3() {
    const nav = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        nav("/");
    }

    return (
        <div className="navbarSignup">
            <div className="navbar-content">
                <img src={cuvettelogo} className="logo" />
                <div className="contact">
                    <a 
                        href="/company/VerifyEmailAndPhone" 
                        style={{  fontWeight: "bold", textDecoration: 'underline', marginRight: '20px' }}
                    >
                        Verify Email and Phone
                    </a>

                    <a 
                        href="/company/createInterview" 
                        style={{  fontWeight: "bold", textDecoration: 'underline', marginRight: '20px' }}
                    >
                    Create Interview
                    </a>
                    
                    <a style={{fontWeight: "bold", marginRight: '20px'}} >  
                      contact  
                    </a>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {localStorage.getItem("name")} 
                        {isDropdownOpen && (
                            <div onClick={handleLogout}>
                                Logout
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

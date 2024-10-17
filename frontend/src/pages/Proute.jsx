import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PRoute = () => {
    const nav = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log("State in PRoute is: ", token);

        if (!token) {
            nav("/");
        } else {
            console.log(token);

            const base64Url = token.split('.')[1];
            const jsonPayload = decodeURIComponent(atob(base64Url).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decoded = JSON.parse(jsonPayload);
            console.log(decoded);

            const now = Date.now() / 1000;

            if (now > decoded.exp) {
                localStorage.removeItem('token');
                toast.error('Session expired.');
                nav("/");
            } else {
                setIsTokenValid(true);
            }
        }
    }, [nav, token]);

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default PRoute;

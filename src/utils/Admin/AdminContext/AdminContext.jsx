import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminData, setAdminData] = useState(null);


    useEffect(() => {
        // Check admin session on load
        checkAdminSession();
    }, []);

    const checkAdminSession = async () => {
        const session = localStorage.getItem('adminSession');
        if (session) {
            setIsAdmin(true);
        }
        setLoading(false);
    };

    const loginAdmin = async (username, password) => {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select()
                .eq('username', username)
                .eq('password', password)
                .single();

            if (error) throw error;

            if (data) {
                localStorage.setItem('adminSession', 'true');
                localStorage.setItem('adminData', JSON.stringify(data));
                setIsAdmin(true);
                setAdminData(data);
                return { success: true };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Invalid Credentials' };
        }
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminData');
        setIsAdmin(false);
        setAdminData(null);
    };

    return (
        <AdminContext.Provider value={{ isAdmin, adminData, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import { fetchEmployees } from './api/api'; 
import './App.css';

const App = () => {
    const [employees, setEmployees] = useState([]);

    const loadEmployees = async () => {
        const empData = await fetchEmployees();
        setEmployees(empData);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    return (
        <Router>
            <div className="app-container">
                <h1>Employee Management System</h1>
                <EmployeeList employees={employees} />
            </div>
        </Router>
    );
};

export default App;

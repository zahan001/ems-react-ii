import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { fetchEmployees } from './api/api'; // Make sure to import fetchEmployees

const App = () => {
    const [showForm, setShowForm] = useState(true);
    const [employees, setEmployees] = useState([]);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    const loadEmployees = async () => {
        const empData = await fetchEmployees();
        setEmployees(empData);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleEmployeeAdded = () => {
        loadEmployees(); // Refresh the employee list
    };

    return (
        <Router>
            <div className="app-container">
                <h1>Employee Management System</h1>
                <button onClick={handleToggleForm}>
                    {showForm ? 'Hide Form' : 'Add Employee'}
                </button>
                {showForm && <EmployeeForm onEmployeeAdded={handleEmployeeAdded} />}
                <EmployeeList employees={employees} />
            </div>
        </Router>
    );
};

export default App;

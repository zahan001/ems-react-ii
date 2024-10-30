import React, { useState, useEffect } from 'react';
import { addEmployee, fetchDepartments } from '../api/api';

const EmployeeForm = ({ onEmployeeAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        departmentId: '',
        // ... other fields as necessary
    });
    
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const deptData = await fetchDepartments();
                setDepartments(deptData);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        loadDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addEmployee(formData);
        setFormData({
            name: '',
            departmentId: '',
            // ... reset other fields
        });
        onEmployeeAdded(); // Callback to refetch employees
    };

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <h2>Add Employee</h2>
            <label>Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <label>Department</label>
            <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
            >
                <option value="">Select Department</option>
                {departments.map(department => (
                    <option key={department.id} value={department.id}>
                        {department.name}
                    </option>
                ))}
            </select>
            {/* Include other input fields as necessary */}
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default EmployeeForm;

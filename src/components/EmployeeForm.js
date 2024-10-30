import React, { useState, useEffect } from 'react';
import { addEmployee, fetchDepartments } from '../api/api';

const EmployeeForm = ({ onEmployeeAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        departmentId: '',
        // Add other fields as needed
    });

    const [departments, setDepartments] = useState([]);

    // Fetch departments on component mount
    useEffect(() => {
        const getDepartments = async () => {
            const departmentData = await fetchDepartments();
            setDepartments(departmentData);
        };
        getDepartments();
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
            // Reset other fields as needed
        });
        // Notify parent component to update the list
        onEmployeeAdded();
    };

    return (
        <form onSubmit={handleSubmit}>
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
                {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                        {dept.name}
                    </option>
                ))}
            </select>
            {/* Include other input fields as necessary */}
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default EmployeeForm;

// src/components/EditEmployee.js

import React, { useState, useEffect } from 'react'; // Import necessary hooks from React
import { updateEmployee, fetchDepartments, fetchEmployeeById } from '../api/api'; // Import API functions

const EditEmployee = ({ empNo, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({}); // State to hold form data
  const [departments, setDepartments] = useState([]); // State to hold department data
  const [errors, setErrors] = useState({}); // State to hold validation errors

  // Fetch employee and departments on component mount
  useEffect(() => {
    const loadEmployee = async () => {
      const employee = await fetchEmployeeById(empNo); // Fetch employee by empNo
      setFormData(employee); // Set employee data to state
    };
    const loadDepartments = async () => {
      const data = await fetchDepartments(); // Fetch departments from API
      setDepartments(data); // Set departments to state
    };
    loadEmployee(); // Invoke function to load employee
    loadDepartments(); // Invoke function to load departments
  }, [empNo]); // Dependency on empNo to re-fetch if it changes

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target
    setFormData({ ...formData, [name]: value }); // Update the form data
  };

  // Validate the form data
  const validate = () => {
    const newErrors = {}; // Object to hold validation errors
    if (!formData.empName) newErrors.empName = "Employee name is required."; // Check for employee name
    if (!formData.departmentCode) newErrors.departmentCode = "Department is required."; // Check for department
    if (!formData.basicSalary || isNaN(formData.basicSalary) || formData.basicSalary <= 0) {
      newErrors.basicSalary = "Basic salary must be a positive number."; // Validate basic salary
    }
    return newErrors; // Return validation errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const validationErrors = validate(); // Validate form data
    if (Object.keys(validationErrors).length > 0) { // If there are validation errors
      setErrors(validationErrors); // Set errors to state
      return; // Exit the function
    }
    try {
      await updateEmployee(formData); // Attempt to update employee
      onSuccess(); // Notify parent component on success
      onClose(); // Close the form
    } catch (err) {
      console.error('Failed to update employee:', err); // Log error
    }
  };

  return (
    <form onSubmit={handleSubmit}> {/* Form for editing employee */}
      <input 
        name="empName" 
        value={formData.empName || ''} 
        onChange={handleChange} 
        placeholder="Employee Name" 
        required 
      />
      {errors.empName && <div>{errors.empName}</div>} {/* Display error for employee name */}

      <select name="departmentCode" onChange={handleChange} required>
        <option value="">Select Department</option> {/* Default option */}
        {departments.map(department => ( // Map over departments to create options
          <option key={department.code} value={department.code}>{department.name}</option>
        ))}
      </select>
      {errors.departmentCode && <div>{errors.departmentCode}</div>} {/* Display error for department */}

      <input 
        name="basicSalary" 
        type="number" 
        value={formData.basicSalary || ''} 
        onChange={handleChange} 
        placeholder="Basic Salary" 
        required 
      />
      {errors.basicSalary && <div>{errors.basicSalary}</div>} {/* Display error for basic salary */}

      {/* Additional fields for address, date of join, etc. */}

      <button type="submit">Update Employee</button> {/* Submit button */}
      <button type="button" onClick={onClose}>Cancel</button> {/* Cancel button */}
    </form>
  );
};

export default EditEmployee; // Export the component

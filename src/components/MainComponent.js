// src/components/MainComponent.js

import React, { useEffect, useState } from 'react'; // Import necessary hooks from React
import { fetchEmployees, deleteEmployee } from '../api/api'; // Import API functions
import AddEmployee from './AddEmployee'; // Import AddEmployee component
import EditEmployee from './EditEmployee'; // Import EditEmployee component
import EmployeeList from './EmployeeList'; // Import EmployeeList component

const MainComponent = () => {
  const [employees, setEmployees] = useState([]); // State to hold employees
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [currentEmpNo, setCurrentEmpNo] = useState(null); // State to hold current employee number
  const [showAddEmployee, setShowAddEmployee] = useState(false); // State to manage adding mode

  // Fetch employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      const data = await fetchEmployees(); // Fetch employees from API
      setEmployees(data); // Set employees to state
    };
    loadEmployees(); // Invoke function
  }, []); // Empty dependency array means it runs once on mount

  // Handle editing of an employee
  const handleEdit = (empNo) => {
    setCurrentEmpNo(empNo); // Set current employee number to edit
    setIsEditing(true); // Set editing mode to true
  };

  // Handle deleting of an employee
  const handleDelete = async (empNo) => {
    await deleteEmployee(empNo); // Delete employee from API
    const updatedEmployees = employees.filter(emp => emp.empNo !== empNo); // Filter out deleted employee
    setEmployees(updatedEmployees); // Update state with remaining employees
  };

  // Handle success callback after adding/editing
  const handleSuccess = async () => {
    const data = await fetchEmployees(); // Fetch updated employee list
    setEmployees(data); // Update state with new employees
    setIsEditing(false); // Exit editing mode
    setShowAddEmployee(false); // Exit adding mode
  };

  // Handle closing of the form
  const handleClose = () => {
    setIsEditing(false); // Exit editing mode
    setShowAddEmployee(false); // Exit adding mode
  };

  return (
    <div>
      <h1>Employee Management System</h1>
      <button onClick={() => setShowAddEmployee(true)}>Add Employee</button> {/* Button to add employee */}
      {showAddEmployee ? (
        <AddEmployee onClose={handleClose} onSuccess={handleSuccess} /> // Show AddEmployee component
      ) : (
        isEditing ? (
          <EditEmployee empNo={currentEmpNo} onClose={handleClose} onSuccess={handleSuccess} /> // Show EditEmployee component
        ) : null
      )}
      <EmployeeList employees={employees} onEdit={handleEdit} onDelete={handleDelete} /> {/* Show EmployeeList component */}
    </div>
  );
};

export default MainComponent; // Export the component

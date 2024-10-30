import React, { useEffect, useState } from 'react';
import { fetchEmployees, deleteEmployee, fetchDepartments, addEmployee, updateEmployee } from '../api/api';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]); // State to store employees and filtered employees for search functionality
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // State to store available departments for dropdown selection
  const [error, setError] = useState(null); // State to manage error messages and display in the UI
  const [searchTerm, setSearchTerm] = useState(''); // State to store the current search term
  const [newEmployee, setNewEmployee] = useState({  // State to handle new or edited employee data inputs
    empNo: '', // Employee number generated randomly
    empName: '',
    empAddressLine1: '',
    empAddressLine2: '',
    empAddressLine3: '',
    departmentCode: '',
    dateOfJoin: new Date().toISOString().split('T')[0], // Default join date as today
    dateOfBirth: '',
    basicSalary: 0,
    isActive: true,
  });

  // State to identify if an employee is being edited (null if adding a new one)
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  // useEffect hook to fetch employees and departments when the component mounts
  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees(); // Fetches employee data from the API
        setEmployees(data); // Sets employees state
        setFilteredEmployees(data); // Sets filtered employees for initial display
      } catch (err) {
        setError('Error fetching employees');
      }
    };

    const getDepartments = async () => {
      try {
        const data = await fetchDepartments();  // Fetches department data from the API
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        setError('Error fetching departments: ' + err.message);
      }
    };

    getEmployees();
    getDepartments();
  }, []);

  // Function to handle employee deletion
  const handleDelete = async (empNo) => {
    try {
      await deleteEmployee(empNo); // Deletes employee with the specified empNo
      const updatedEmployees = employees.filter(emp => emp.empNo !== empNo);
      setEmployees(updatedEmployees); // Updates the employees state
      setFilteredEmployees(updatedEmployees); // Updates the filtered list
      setError(null); // Reset error state on successful deletion
    } catch (err) {
      setError('Error deleting employee');
    }
  };

   // Function to handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

     // Filters employees based on name or department code
    const filtered = employees.filter(emp =>
      emp.empName.toLowerCase().includes(value.toLowerCase()) ||
      emp.departmentCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);  // Updates the displayed employees based on search
  };

  // Function to handle changes in the form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value }); // Updates the corresponding field in newEmployee state
  };

  // Function to generate a random employee number
  const generateRandomEmpNo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
  };

  // Function to handle form submission (either add or update an employee)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assign a random unique Employee No if adding a new employee
    const empNo = editEmployeeId ? editEmployeeId : generateRandomEmpNo();
    const employeeToAdd = { ...newEmployee, empNo };

    // Ensure all required fields are filled out
    if (!employeeToAdd.empName || !employeeToAdd.departmentCode) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (editEmployeeId) {
        // Updates employee data if editing
        const updatedEmployee = { ...employeeToAdd, empNo: editEmployeeId };
        await updateEmployee(updatedEmployee);
        setEmployees(employees.map(emp => (emp.empNo === editEmployeeId ? updatedEmployee : emp)));
      } else {
        // Adds a new employee
        await addEmployee(employeeToAdd);
        setEmployees([...employees, employeeToAdd]);
        setFilteredEmployees([...filteredEmployees, employeeToAdd]); // Ensure the new employee is added to filtered list
      }
      // Reset form after submission
      setNewEmployee({
        empNo: '', 
        empName: '',
        empAddressLine1: '',
        empAddressLine2: '',
        empAddressLine3: '',
        departmentCode: '',
        dateOfJoin: new Date().toISOString().split('T')[0],
        dateOfBirth: '',
        basicSalary: 0,
        isActive: true,
      });
      setEditEmployeeId(null);
      setError(null); // Reset error state on successful add/update
    } catch (err) {
      setError('Error adding employee: ' + err.message);
    }
  };

  // Function to load employee data into the form for editing
  const handleEdit = (emp) => {
    setNewEmployee({ 
      empNo: emp.empNo, // The empNo will not be edited; it stays the same
      empName: emp.empName, 
      empAddressLine1: emp.empAddressLine1 || '', 
      empAddressLine2: emp.empAddressLine2 || '', 
      empAddressLine3: emp.empAddressLine3 || '', 
      departmentCode: emp.departmentCode, 
      dateOfJoin: emp.dateOfJoin.split('T')[0], 
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '', // Adjust format
      basicSalary: emp.basicSalary || 0, 
      isActive: emp.isActive !== undefined ? emp.isActive : true 
    });
    setEditEmployeeId(emp.empNo); // Sets edit mode with the specific employee ID
  };

  return (
    <div className="container mt-5">
      <h2>Employee Search</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Separate search bar section */}
      <div className='search-bar'>
      <input
        type="text"
        placeholder="Search by name or department"
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control"
      />
      </div>

      <h2>Employee Form</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        {/* Employee No input is removed */}
        <div className="mb-3">
          <input
            type="text"
            name="empName"
            placeholder="Employee Name"
            value={newEmployee.empName}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="empAddressLine1"
            placeholder="Address Line 1"
            value={newEmployee.empAddressLine1}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="empAddressLine2"
            placeholder="Address Line 2"
            value={newEmployee.empAddressLine2}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="empAddressLine3"
            placeholder="Address Line 3"
            value={newEmployee.empAddressLine3}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <select
            name="departmentCode"
            value={newEmployee.departmentCode}
            onChange={handleInputChange}
            required
            className="form-control"
          >
            <option value="" disabled>Select Department</option>
            {departments.map(department => (
              <option key={department.departmentCode} value={department.departmentCode}>
                {department.departmentName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <input
            type="date"
            name="dateOfJoin"
            value={newEmployee.dateOfJoin}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            name="dateOfBirth"
            value={newEmployee.dateOfBirth}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="basicSalary"
            placeholder="Basic Salary"
            value={newEmployee.basicSalary}
            onChange={handleInputChange}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editEmployeeId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
      <h2>Employee List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Employee No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.empNo}>
              <td>{emp.empNo}</td>
              <td>{emp.empName}</td>
              <td>{emp.departmentCode}</td>
              <td>
                <button onClick={() => handleEdit(emp)} className="btn btn-warning btn-sm me-2">Edit</button>
                <button onClick={() => handleDelete(emp.empNo)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;

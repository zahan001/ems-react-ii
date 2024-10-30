import React, { useEffect, useState } from 'react';
import { fetchEmployees, deleteEmployee } from '../api/api';
import { Link } from 'react-router-dom'; // For navigation to the Add/Edit Employee page
import './EmployeeList.css'; // Custom styles if needed

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees(); // Fetch employees from API
        setEmployees(data);
      } catch (err) {
        setError('Error fetching employees');
      }
    };

    getEmployees();
  }, []);

  const handleDelete = async (empNo) => {
    try {
      await deleteEmployee(empNo); // Delete employee
      setEmployees(employees.filter(emp => emp.empNo !== empNo)); // Update local state
    } catch (err) {
      setError('Error deleting employee');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Employee List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link to="/add-employee" className="btn btn-primary mb-3">Add New Employee</Link>
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
          {employees.map(emp => (
            <tr key={emp.empNo}>
              <td>{emp.empNo}</td>
              <td>{emp.empName}</td>
              <td>{emp.departmentCode}</td>
              <td>
                <Link to={`/edit-employee/${emp.empNo}`} className="btn btn-warning btn-sm me-2">Edit</Link>
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
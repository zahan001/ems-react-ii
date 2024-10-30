import React, { useEffect, useState } from 'react';
import { fetchEmployees, deleteEmployee, fetchDepartments, addEmployee, updateEmployee } from '../api/api'; 
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]); // State to hold department data
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState({ empNo: '', empName: '', departmentCode: '' });
  const [editEmployeeId, setEditEmployeeId] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        setError('Error fetching employees');
      }
    };

    const getDepartments = async () => {
      try {
        const data = await fetchDepartments(); // Fetch departments from API
        console.log('Departments fetched:', data); // Debugging statement
        setDepartments(data); // Set departments to state
      } catch (err) {
        console.error('Failed to fetch departments:', err); // Detailed error log
        setError('Error fetching departments: ' + err.message); // Display error to user
      }
    };

    getEmployees(); // Fetch employees on component mount
    getDepartments(); // Fetch departments on component mount
  }, []);

  const handleDelete = async (empNo) => {
    try {
      await deleteEmployee(empNo);
      const updatedEmployees = employees.filter(emp => emp.empNo !== empNo);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (err) {
      setError('Error deleting employee');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = employees.filter(emp =>
      emp.empName.toLowerCase().includes(value.toLowerCase()) ||
      emp.departmentCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editEmployeeId) {
        const updatedEmployee = { ...newEmployee, empNo: editEmployeeId };
        await updateEmployee(updatedEmployee);
        setEmployees(employees.map(emp => (emp.empNo === editEmployeeId ? updatedEmployee : emp)));
      } else {
        const addedEmployee = await addEmployee(newEmployee);
        setEmployees([...employees, addedEmployee]);
      }
      setFilteredEmployees([...employees, newEmployee]);
      setNewEmployee({ empNo: '', empName: '', departmentCode: '' });
      setEditEmployeeId(null);
    } catch (err) {
      setError('Error adding employee: ' + err.message);
    }
  };

  const handleEdit = (emp) => {
    setNewEmployee({ empNo: emp.empNo, empName: emp.empName, departmentCode: emp.departmentCode });
    setEditEmployeeId(emp.empNo);
  };

  return (
    <div className="container mt-5">
      <h2>Employee List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="text"
        placeholder="Search by name or department"
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-control mb-3"
      />
      <form onSubmit={handleSubmit} className="mb-4">
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
        <button type="submit" className="btn btn-primary">
          {editEmployeeId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>
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

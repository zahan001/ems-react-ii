import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addEmployee, updateEmployee, fetchEmployeeById, fetchDepartments } from '../api/api';

const EmployeeForm = () => {
  const [employee, setEmployee] = useState({ name: '', departmentId: '' });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const { empNo } = useParams(); // Get employee number from URL parameters

  useEffect(() => {
    const loadDepartments = async () => {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    };

    loadDepartments();

    if (empNo) {
      const loadEmployee = async () => {
        const employeeData = await fetchEmployeeById(empNo);
        setEmployee(employeeData);
      };

      loadEmployee();
    }
  }, [empNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (empNo) {
      await updateEmployee(employee); // Update employee if empNo exists
    } else {
      await addEmployee(employee); // Add new employee
    }
    navigate('/'); // Navigate back to employee list after submit
  };

  return (
    <div>
      <h2>{empNo ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Department:</label>
          <select
            name="departmentId"
            value={employee.departmentId}
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
        </div>
        <button type="submit">{empNo ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default EmployeeForm;

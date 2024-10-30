// src/api.js

import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://examination.24x7retail.com'; // Updated to HTTPS
const API_TOKEN = '?D(G+KbPeSgVkYp3s6v9y$B&E)H@McQf'; // API key

// Create an Axios instance with default headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Ensure content type is JSON
    'apiToken': API_TOKEN, // Include the API token in the headers
  },
});

// Fetch all employees
export const fetchEmployees = async () => {
  try {
    const response = await apiClient.get('/api/v1.0/Employees'); // API endpoint to fetch employees
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching employees:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const response = await apiClient.get('/api/v1.0/Departments'); // API endpoint to fetch departments
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching departments:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

// Add a new employee
export const addEmployee = async (employeeData) => {
  try {
    const response = await apiClient.post('/api/v1.0/Employee', employeeData); // API endpoint to add employee
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error adding employee:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

// Update an existing employee
export const updateEmployee = async (employeeData) => {
  try {
    const response = await apiClient.put('/api/v1.0/Employee', employeeData); // API endpoint to update employee
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error updating employee:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

// Delete an employee
export const deleteEmployee = async (empNo) => {
  try {
    await apiClient.delete(`/api/v1.0/Employee/${empNo}`); // API endpoint to delete employee by empNo
  } catch (error) {
    console.error('Error deleting employee:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

// Fetch a single employee record by employee number
export const fetchEmployeeById = async (empNo) => {
  try {
    const response = await apiClient.get(`/api/v1.0/Employee/${empNo}`); // API endpoint to fetch a single employee
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching employee:', error); // Log error
    throw error; // Throw error to be handled in the calling component
  }
};

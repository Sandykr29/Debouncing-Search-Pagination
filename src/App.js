import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "./App.css"

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(USERS_URL);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleSearch = useCallback(debounce((term) => {
    setSearchTerm(term);
  }, 300), []);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => handlePageChange(number)}
        className={currentPage === number ? 'active' : ''}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="App">
      <h1>User Pagination and Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default App;

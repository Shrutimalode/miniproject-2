import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const AppNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <>
      <Nav className="me-auto">
      </Nav>
      <Nav style={{ marginRight: '1rem' }}>
        <NavDropdown title={user ? (
          <span className="navbar-text" style={{ fontSize: '1.1rem', fontWeight: '500' }}>
            Welcome, {user.name} {user.role && (
              <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'primary' : 'success'} className="ms-2 text-capitalize">
                {user.role}
              </Badge>
            )}
          </span>
        ) : 'Account'} id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
        {user && user.role === 'admin' && false && (
          <Button 
            as={Link} 
            to="/communities/create" 
            size="sm"
            style={{ 
              backgroundColor: '#4a154b',
              borderColor: '#4a154b',
              color: 'white',
              padding: '0.3rem 1rem',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '1rem'
            }}
          >
            Create Community
          </Button>
        )}
      </Nav>
    </>
  );

  const guestLinks = (
    <Nav className="ms-auto" style={{ marginRight: '0.5rem' }}>
      <Button as={Link} to="/login" variant="outline-primary" className="me-4" size="sm">Login</Button>
      <Button as={Link} to="/register" variant="primary" size="sm">Register</Button>
    </Nav>
  );

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-primary" style={{ fontSize: '1.2rem' }}>
          <i className="fas fa-book-reader me-2"></i>
          ShikshaHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              {authLinks}
            </>
          ) : (
            guestLinks
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
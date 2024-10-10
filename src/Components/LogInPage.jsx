import React, { useState } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LogInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [userList, setUserList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleDeleteConfirmation = (index) => {
    setShowDeleteConfirmation(true);
    setDeleteIndex(index);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    const updatedUserList = [...userList];
    updatedUserList.splice(deleteIndex, 1);
    setUserList(updatedUserList);
    setShowDeleteConfirmation(false);
    setDeleteIndex(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      if (value.length > 20) {
        // Truncate the value to 20 characters
        const truncatedValue = value.substring(0, 20);
        setUsernameError("Username must be at most 20 characters long");
        setFormData({
          ...formData,
          [name]: truncatedValue,
        });
      } else {
        setUsernameError(""); // Clear the username error when input is valid
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      // Update other form fields as usual
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Validate the password
    if (name === "password") {
      // Handle password visibility
      setFormData({
        ...formData,
        [name]: value,
      });

      // Validate the password
      validatePassword(value);
    } else {
      // Handle other form fields as usual
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Validate the mobile number
    if (name === "mobile") {
      validateMobile(value);
    }
  };

  const validatePassword = (password) => {
    // Password requirements
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (
      password.length < minLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber
    ) {
      setPasswordError(
        "Password must be at least 8 characters long and include uppercase, lowercase, and numbers."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateMobile = (mobile) => {
    if (mobile.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits long.");
    } else {
      setMobileError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if password and mobile number meet the requirements before submitting the form
    if (passwordError || mobileError || usernameError) {
      return;
    }

    if (editIndex === null) {
      // Add a new user
      setUserList([...userList, formData]);
    } else {
      // Edit an existing user
      const updatedUserList = [...userList];
      updatedUserList[editIndex] = formData;
      setUserList(updatedUserList);
    }
    setFormData({
      username: "",
      email: "",
      password: "",
      mobile: "",
    });
    handleCloseEditModal();
  };

  const handleEditClick = (index) => {
    setShowEditModal(true);
    setEditIndex(index);
    setFormData(userList[index]);
  };

  return (
    <div>
      <h1 className="text-center">LogIn Form</h1>
      <div className="d-flex justify-content-center">
        <Form
          onSubmit={handleSubmit}
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <Form.Group controlId="username">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {usernameError && (
              <small className="text-danger">{usernameError}</small>
            )}
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                />
              </Button>
            </div>
            {passwordError && (
              <small className="text-danger">{passwordError}</small>
            )}
          </Form.Group>

          <Form.Group controlId="mobile">
            <Form.Label>Mobile Number:</Form.Label>
            <Form.Control
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="Enter a 10-digit mobile number"
              required
            />
            {mobileError && (
              <small className="text-danger">{mobileError}</small>
            )}
          </Form.Group>

          <div className="text-center mt-3">
            <Button type="submit" variant="primary">
              {editIndex !== null ? "Update" : "Submit"}
            </Button>
          </div>
        </Form>
      </div>

      <h2>Registered Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.mobile}</td>
              <td>
                <Button variant="info" onClick={() => handleEditClick(index)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteConfirmation(index)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="usernameModal">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {usernameError && (
                <small className="text-danger">{usernameError}</small>
              )}
            </Form.Group>

            <Form.Group controlId="emailModal">
              <Form.Label>Email:</Form.Label>
              <Form.Label>Name:</Form.Label>

              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="passwordModal">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <small className="text-danger">{passwordError}</small>
              )}
            </Form.Group>

            <Form.Group controlId="mobileModal">
              <Form.Label>Mobile Number:</Form.Label>
              <Form.Control
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}"
                placeholder="Enter a 10-digit mobile number"
                required
              />
              {mobileError && (
                <small className="text-danger">{mobileError}</small>
              )}
            </Form.Group>
            <div className="text-start mt-5">
              <Button type="submit" variant="primary">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <h3>Kumar</h3>
    </div>
  );
};

export default LogInPage;

<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Change to your actual username
$password = ""; // Change to your actual password
$dbname = "facilityreview"; // Change to your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "Connection Successful";
}

// Variables from form or wherever you get the values from
$selectCat = $_POST['selectCat'];
$stars = $_POST['stars'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$gender = $_POST['gender'];

// Prepare and bind SQL statement
$stmt = $conn->prepare("INSERT INTO reviews (selectCat, stars, firstName, lastName, email, gender) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sissss", $selectCat, $stars, $firstName, $lastName, $email, $gender);

// Execute SQL statement
if ($stmt->execute()) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close prepared statement
$stmt->close();

// Close the database connection
$conn->close();
?>

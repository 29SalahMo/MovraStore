<?php
require_once 'config.php';

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'register':
        register();
        break;
    case 'login':
        login();
        break;
    case 'logout':
        logout();
        break;
    case 'forgot-password':
        forgotPassword();
        break;
    case 'reset-password':
        resetPassword();
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function register() {
    global $conn;
    
    $name = sanitize($_POST['name'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    
    if (!$name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        return;
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    try {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hashedPassword]);
        
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
}

function login() {
    global $conn;
    
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']) && $_POST['remember'] === 'true';
    
    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    // Get user
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        return;
    }
    
    // Generate token
    $token = generateToken();
    $expiresAt = date('Y-m-d H:i:s', strtotime($remember ? '+30 days' : '+24 hours'));
    
    // Save token
    $stmt = $conn->prepare("INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $token, $expiresAt]);
    
    unset($user['password']);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
    ]);
}

function logout() {
    global $conn;
    
    $token = $_POST['token'] ?? '';
    if (!$token) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Token is required']);
        return;
    }
    
    // Delete token
    $stmt = $conn->prepare("DELETE FROM auth_tokens WHERE token = ?");
    $stmt->execute([$token]);
    
    echo json_encode(['success' => true, 'message' => 'Logout successful']);
}

function forgotPassword() {
    global $conn;
    
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    if (!$email) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email is required']);
        return;
    }
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Email not found']);
        return;
    }
    
    // Generate reset token
    $resetToken = generateToken();
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Save reset token
    $stmt = $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$email, $resetToken, $expiresAt]);
    
    // TODO: Send reset email
    // For now, just return success
    echo json_encode([
        'success' => true,
        'message' => 'Password reset instructions sent to your email'
    ]);
}

function resetPassword() {
    global $conn;
    
    $token = $_POST['token'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (!$token || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Token and password are required']);
        return;
    }
    
    // Verify token
    $stmt = $conn->prepare("SELECT email FROM password_resets WHERE token = ? AND expires_at > NOW() AND used = 0");
    $stmt->execute([$token]);
    $reset = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$reset) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        return;
    }
    
    // Update password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->execute([$hashedPassword, $reset['email']]);
    
    // Mark token as used
    $stmt = $conn->prepare("UPDATE password_resets SET used = 1 WHERE token = ?");
    $stmt->execute([$token]);
    
    echo json_encode(['success' => true, 'message' => 'Password reset successful']);
}
?> 
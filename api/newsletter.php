<?php
require_once 'config.php';

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'subscribe':
        subscribe();
        break;
    case 'unsubscribe':
        unsubscribe();
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function subscribe() {
    global $conn;
    
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        return;
    }
    
    try {
        // Check if already subscribed
        $stmt = $conn->prepare("SELECT id, status FROM newsletter_subscriptions WHERE email = ?");
        $stmt->execute([$email]);
        $subscription = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($subscription) {
            if ($subscription['status'] === 'subscribed') {
                echo json_encode(['success' => false, 'message' => 'Email already subscribed']);
                return;
            }
            
            // Reactivate subscription
            $stmt = $conn->prepare("
                UPDATE newsletter_subscriptions 
                SET status = 'subscribed', 
                    updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$subscription['id']]);
        } else {
            // Create new subscription
            $stmt = $conn->prepare("
                INSERT INTO newsletter_subscriptions (email, status) 
                VALUES (?, 'subscribed')
            ");
            $stmt->execute([$email]);
        }
        
        // Send welcome email
        sendWelcomeEmail($email);
        
        echo json_encode([
            'success' => true,
            'message' => 'Successfully subscribed to newsletter'
        ]);
    } catch (PDOException $e) {
        error_log("Error subscribing to newsletter: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error subscribing to newsletter']);
    }
}

function unsubscribe() {
    global $conn;
    
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $token = $_POST['token'] ?? '';
    
    if (!$email || !$token) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    try {
        // Verify unsubscribe token
        if (!verifyUnsubscribeToken($email, $token)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid unsubscribe token']);
            return;
        }
        
        $stmt = $conn->prepare("
            UPDATE newsletter_subscriptions 
            SET status = 'unsubscribed', 
                updated_at = NOW() 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        
        if ($stmt->rowCount() === 0) {
            echo json_encode(['success' => false, 'message' => 'Email not found']);
            return;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Successfully unsubscribed from newsletter'
        ]);
    } catch (PDOException $e) {
        error_log("Error unsubscribing from newsletter: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error unsubscribing from newsletter']);
    }
}

function sendWelcomeEmail($email) {
    // TODO: Implement email sending functionality
    // This is a placeholder for the actual email sending code
    // You would typically use a service like SendGrid, Mailgun, or PHPMailer
    
    $to = $email;
    $subject = "Welcome to Movra Store Newsletter";
    $message = "Thank you for subscribing to our newsletter!\n\n";
    $message .= "You'll now receive updates about our latest products, exclusive offers, and more.\n\n";
    $message .= "Best regards,\nMovra Store Team";
    $headers = "From: newsletter@movra-store.com";
    
    // Uncomment when ready to send actual emails
    // mail($to, $subject, $message, $headers);
}

function verifyUnsubscribeToken($email, $token) {
    // TODO: Implement proper token verification
    // This is a placeholder for actual token verification logic
    // You should use a secure method to generate and verify tokens
    
    return hash('sha256', $email . 'some-secret-key') === $token;
} 
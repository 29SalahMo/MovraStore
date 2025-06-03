<?php
header('Content-Type: application/json');
require_once 'config.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        createOrder();
        break;
    case 'list':
        getOrders();
        break;
    case 'detail':
        getOrderDetail();
        break;
    case 'cancel':
        cancelOrder();
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function createOrder() {
    global $conn;
    
    $token = $_POST['token'] ?? '';
    $items = json_decode($_POST['items'] ?? '[]', true);
    $shippingAddress = json_decode($_POST['shipping_address'] ?? '{}', true);
    $paymentMethod = sanitize($_POST['payment_method'] ?? '');
    
    if (!$token || empty($items) || empty($shippingAddress) || !$paymentMethod) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    // Verify user
    $user = verifyToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        $conn->beginTransaction();
        
        // Create order
        $stmt = $conn->prepare("
            INSERT INTO orders (
                user_id, 
                status, 
                total_amount,
                shipping_address,
                payment_method,
                created_at
            ) VALUES (?, 'pending', ?, ?, ?, NOW())
        ");
        
        $totalAmount = array_reduce($items, function($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);
        
        $stmt->execute([
            $user['user_id'],
            $totalAmount,
            json_encode($shippingAddress),
            $paymentMethod
        ]);
        
        $orderId = $conn->lastInsertId();
        
        // Create order items
        $stmt = $conn->prepare("
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                price,
                subtotal
            ) VALUES (?, ?, ?, ?, ?)
        ");
        
        foreach ($items as $item) {
            $subtotal = $item['price'] * $item['quantity'];
            $stmt->execute([
                $orderId,
                $item['id'],
                $item['quantity'],
                $item['price'],
                $subtotal
            ]);
            
            // Update product stock
            $conn->prepare("
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ? AND stock >= ?
            ")->execute([
                $item['quantity'],
                $item['id'],
                $item['quantity']
            ]);
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => ['order_id' => $orderId]
        ]);
    } catch (PDOException $e) {
        $conn->rollBack();
        error_log("Error creating order: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error creating order']);
    }
}

function getOrders() {
    global $conn;
    
    $token = $_GET['token'] ?? '';
    $limit = (int)($_GET['limit'] ?? 10);
    $offset = (int)($_GET['offset'] ?? 0);
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    // Verify user
    $user = verifyToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        // Get total count
        $stmt = $conn->prepare("SELECT COUNT(*) FROM orders WHERE user_id = ?");
        $stmt->execute([$user['user_id']]);
        $total = $stmt->fetchColumn();
        
        // Get orders
        $stmt = $conn->prepare("
            SELECT o.*,
                   (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
            FROM orders o 
            WHERE o.user_id = ? 
            ORDER BY o.created_at DESC 
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$user['user_id'], $limit, $offset]);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'orders' => $orders,
                'total' => $total,
                'page' => floor($offset / $limit) + 1,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Error fetching orders: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching orders']);
    }
}

function getOrderDetail() {
    global $conn;
    
    $token = $_GET['token'] ?? '';
    $orderId = (int)($_GET['id'] ?? 0);
    
    if (!$token || !$orderId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    // Verify user
    $user = verifyToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        // Get order details
        $stmt = $conn->prepare("
            SELECT * FROM orders 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$orderId, $user['user_id']]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        // Get order items
        $stmt = $conn->prepare("
            SELECT oi.*, p.name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$orderId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $order['items'] = $items;
        echo json_encode([
            'success' => true,
            'data' => $order
        ]);
    } catch (PDOException $e) {
        error_log("Error fetching order details: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching order details']);
    }
}

function cancelOrder() {
    global $conn;
    
    $token = $_POST['token'] ?? '';
    $orderId = (int)($_POST['id'] ?? 0);
    
    if (!$token || !$orderId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        return;
    }
    
    // Verify user
    $user = verifyToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        $conn->beginTransaction();
        
        // Get order
        $stmt = $conn->prepare("
            SELECT status FROM orders 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$orderId, $user['user_id']]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }
        
        if ($order['status'] !== 'pending') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order cannot be cancelled']);
            return;
        }
        
        // Update order status
        $stmt = $conn->prepare("
            UPDATE orders 
            SET status = 'cancelled', 
                cancelled_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$orderId]);
        
        // Restore product stock
        $stmt = $conn->prepare("
            UPDATE products p 
            JOIN order_items oi ON p.id = oi.product_id 
            SET p.stock = p.stock + oi.quantity 
            WHERE oi.order_id = ?
        ");
        $stmt->execute([$orderId]);
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order cancelled successfully'
        ]);
    } catch (PDOException $e) {
        $conn->rollBack();
        error_log("Error cancelling order: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error cancelling order']);
    }
}
?> 
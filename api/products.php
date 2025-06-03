<?php
header('Content-Type: application/json');
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        getProducts();
        break;
    case 'detail':
        getProductDetail();
        break;
    case 'search':
        searchProducts();
        break;
    case 'categories':
        getCategories();
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function getProducts() {
    global $conn;
    
    $category = sanitize($_GET['category'] ?? '');
    $limit = (int)($_GET['limit'] ?? 12);
    $offset = (int)($_GET['offset'] ?? 0);
    $sort = sanitize($_GET['sort'] ?? 'newest');
    
    $params = [];
    $where = "1=1";
    
    if ($category) {
        $where .= " AND category = ?";
        $params[] = $category;
    }
    
    $orderBy = match($sort) {
        'price_asc' => 'price ASC',
        'price_desc' => 'price DESC',
        'name' => 'name ASC',
        default => 'created_at DESC'
    };
    
    try {
        // Get total count
        $stmt = $conn->prepare("SELECT COUNT(*) FROM products WHERE $where");
        $stmt->execute($params);
        $total = $stmt->fetchColumn();
        
        // Get products
        $stmt = $conn->prepare("
            SELECT p.*, 
                   (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) as review_count,
                   (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id) as avg_rating
            FROM products p 
            WHERE $where 
            ORDER BY $orderBy 
            LIMIT ? OFFSET ?
        ");
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'products' => $products,
                'total' => $total,
                'page' => floor($offset / $limit) + 1,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Error fetching products: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching products']);
    }
}

function getProductDetail() {
    global $conn;
    
    $id = (int)($_GET['id'] ?? 0);
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        return;
    }
    
    try {
        // Get product details
        $stmt = $conn->prepare("
            SELECT p.*, 
                   (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) as review_count,
                   (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id) as avg_rating
            FROM products p 
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            return;
        }
        
        // Get product reviews
        $stmt = $conn->prepare("
            SELECT r.*, u.name as user_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.product_id = ? 
            ORDER BY r.created_at DESC 
            LIMIT 10
        ");
        $stmt->execute([$id]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get related products
        $stmt = $conn->prepare("
            SELECT p.*, 
                   (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id) as avg_rating
            FROM products p 
            WHERE p.category = ? AND p.id != ? 
            ORDER BY RAND() 
            LIMIT 4
        ");
        $stmt->execute([$product['category'], $id]);
        $related = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'product' => $product,
                'reviews' => $reviews,
                'related' => $related
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Error fetching product details: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching product details']);
    }
}

function searchProducts() {
    global $conn;
    
    $query = sanitize($_GET['q'] ?? '');
    $limit = (int)($_GET['limit'] ?? 12);
    $offset = (int)($_GET['offset'] ?? 0);
    
    if (!$query) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Search query is required']);
        return;
    }
    
    try {
        // Get total count
        $stmt = $conn->prepare("
            SELECT COUNT(*) 
            FROM products 
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        ");
        $searchTerm = "%$query%";
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
        $total = $stmt->fetchColumn();
        
        // Get products
        $stmt = $conn->prepare("
            SELECT p.*, 
                   (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) as review_count,
                   (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id) as avg_rating
            FROM products p 
            WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
            ORDER BY name ASC 
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm, $limit, $offset]);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => [
                'products' => $products,
                'total' => $total,
                'page' => floor($offset / $limit) + 1,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Error searching products: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error searching products']);
    }
}

function getCategories() {
    global $conn;
    
    try {
        $stmt = $conn->query("
            SELECT category, COUNT(*) as product_count 
            FROM products 
            GROUP BY category 
            ORDER BY category ASC
        ");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'data' => $categories
        ]);
    } catch (PDOException $e) {
        error_log("Error fetching categories: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching categories']);
    }
}
?> 
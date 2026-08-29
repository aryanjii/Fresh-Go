<?php
session_start();
require_once __DIR__ . '/../config/db.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: ../index.php');
    exit;
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm  = $_POST['confirm_password'] ?? '';

    // Validation
    if (empty($username) || strlen($username) < 3) {
        $errors[] = 'Username must be at least 3 characters long.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }
    if (strlen($password) < 6) {
        $errors[] = 'Password must be at least 6 characters long.';
    }
    if ($password !== $confirm) {
        $errors[] = 'Passwords do not match.';
    }

    // Check if username or email already exists
    if (empty($errors)) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            $errors[] = 'Username or email is already registered.';
        } else {
            // Hash password securely and insert
            $password_hash = password_hash($password, PASSWORD_BCRYPT);
            $insert = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
            if ($insert->execute([$username, $email, $password_hash])) {
                $success = 'Account created successfully! You can now log in.';
            } else {
                $errors[] = 'Failed to create account. Please try again.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - FreshGo Grocery</title>
    <link rel="stylesheet" href="../assets/css/auth.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <a href="../index.php" class="brand-logo">🛒 Fresh<span>Go</span></a>
                <h2>Create Account</h2>
                <p>Join FreshGo to access fresh groceries delivered to your door</p>
            </div>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?= htmlspecialchars($error) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <?php if ($success): ?>
                <div class="alert alert-success">
                    <?= htmlspecialchars($success) ?>
                    <p style="margin-top: 8px;"><a href="login.php" class="btn-link">Click here to Login &rarr;</a></p>
                </div>
            <?php else: ?>
                <form action="register.php" method="POST" class="auth-form" novalidate>
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" value="<?= htmlspecialchars($_POST['username'] ?? '') ?>" placeholder="e.g. johndoe" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>" placeholder="e.g. john@example.com" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="At least 6 characters" required>
                    </div>

                    <div class="form-group">
                        <label for="confirm_password">Confirm Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" placeholder="Re-enter your password" required>
                    </div>

                    <button type="submit" class="btn-submit">Create My Account</button>
                </form>
            <?php endif; ?>

            <div class="auth-footer">
                <p>Already have an account? <a href="login.php">Sign In</a></p>
                <p><a href="../index.php">&larr; Back to Store</a></p>
            </div>
        </div>
    </div>
</body>
</html>

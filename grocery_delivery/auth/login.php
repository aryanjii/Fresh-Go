<?php
session_start();
require_once __DIR__ . '/../config/db.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: ../index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identifier = trim($_POST['identifier'] ?? ''); // username or email
    $password   = $_POST['password'] ?? '';

    if (empty($identifier) || empty($password)) {
        $error = 'Please enter your username/email and password.';
    } else {
        // Query user by username or email
        $stmt = $pdo->prepare("SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Regenerate session ID for security
            session_regenerate_id(true);

            $_SESSION['user_id']   = $user['id'];
            $_SESSION['username']  = $user['username'];
            $_SESSION['email']     = $user['email'];

            // Sync with frontend localStorage via inline redirect script
            $usernameJs = json_encode($user['username']);
            $emailJs    = json_encode($user['email']);
            $userIdJs   = json_encode($user['id']);

            echo "<!DOCTYPE html><html><head><title>Logging in...</title></head><body>
                <script>
                    localStorage.setItem('freshgo_user', JSON.stringify({
                        id: $userIdJs,
                        username: $usernameJs,
                        email: $emailJs,
                        loggedIn: true
                    }));
                    window.location.href = '../index.php';
                </script>
            </body></html>";
            exit;
        } else {
            $error = 'Invalid username/email or password.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - FreshGo Grocery</title>
    <link rel="stylesheet" href="../assets/css/auth.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <a href="../index.php" class="brand-logo">🛒 Fresh<span>Go</span></a>
                <h2>Welcome Back</h2>
                <p>Sign in to your FreshGo account</p>
            </div>

            <?php if (!empty($error)): ?>
                <div class="alert alert-error">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form action="login.php" method="POST" class="auth-form">
                <div class="form-group">
                    <label for="identifier">Username or Email</label>
                    <input type="text" id="identifier" name="identifier" value="<?= htmlspecialchars($_POST['identifier'] ?? '') ?>" placeholder="johndoe or john@example.com" required>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" required>
                </div>

                <button type="submit" class="btn-submit">Sign In</button>
            </form>

            <div class="auth-footer">
                <p>Don't have an account? <a href="register.php">Create Account</a></p>
                <p><a href="../index.php">&larr; Back to Store</a></p>
            </div>
        </div>
    </div>
</body>
</html>

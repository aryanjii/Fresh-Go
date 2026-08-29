<?php
session_start();
// Unset all session variables
$_SESSION = [];

// Destroy session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy session
session_destroy();
?>
<!DOCTYPE html>
<html>
<head><title>Logging out...</title></head>
<body>
    <script>
        localStorage.removeItem('freshgo_user');
        window.location.href = '../index.php';
    </script>
</body>
</html>

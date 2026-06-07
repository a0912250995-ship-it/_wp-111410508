function checkAdmin(role, callback) {
    if (role !== "admin") {
        callback("Access Denied", null);
        return;
    }

    callback(null, "Welcome");
}
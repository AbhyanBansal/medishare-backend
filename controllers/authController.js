const logout = (req, res) => {
    // Clear server-side session
    req.session.destroy();
    
    // Set no-cache headers
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    res.redirect('/login');
};

module.exports = { logout };
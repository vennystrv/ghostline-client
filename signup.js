// EmailJS Configuration
// Replace these with your EmailJS credentials after setting up your account
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// Initialize EmailJS (only if credentials are set)
if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Reset error message
    errorMessage.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validate password length
    if (password.length < 8) {
        errorMessage.textContent = 'Password must be at least 8 characters long!';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Disable submit button during processing
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Signing up...';
    
    try {
        // Generate confirmation token (in production, this should be done server-side)
        const confirmationToken = generateToken();
        
        // Store signup data temporarily (in production, save to database)
        const signupData = {
            username: username,
            email: email,
            token: confirmationToken,
            timestamp: new Date().toISOString()
        };
        
        // Store in sessionStorage (in production, save to database)
        sessionStorage.setItem('pendingSignup', JSON.stringify(signupData));
        
        // Send confirmation email using EmailJS
        const emailParams = {
            to_email: email,
            to_name: username,
            confirmation_link: `${window.location.origin}/confirm-email.html?token=${confirmationToken}`,
            username: username
        };
        
        // Send email via EmailJS (if configured)
        if (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && typeof emailjs !== 'undefined') {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
        } else {
            // For testing without EmailJS configured, log the email details
            console.log('Email would be sent with params:', emailParams);
            console.log('To set up email, follow instructions in EMAIL_SETUP.md');
            // Simulate delay for testing
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Redirect to success page
        window.location.href = '/signup-success.html';
        
    } catch (error) {
        console.error('Error sending email:', error);
        errorMessage.textContent = 'Failed to send confirmation email. Please try again.';
        errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Generate a simple confirmation token
function generateToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
}




app.use(express.static('public'));





// public/scripts.js
document.getElementById('blogForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
     
    const formData = new FormData(this);
    
    try {
        const response = await fetch('/addBlog', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        const messageElement = document.getElementById('message');
        messageElement.textContent = result.message;
        messageElement.style.color = result.success ? 'green' : 'red';
        
    } catch (err) {
        console.error('Error:', err);
        document.getElementById('message').textContent = 'An error occurred!';
        document.getElementById('message').style.color = 'red';
    }
});

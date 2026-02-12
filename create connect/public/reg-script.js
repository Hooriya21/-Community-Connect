document.getElementById('registrationForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const skillText = document.getElementById('userSkillInput').value;
    const loader = document.getElementById('loadingOverlay');
    
    // Show AI loading state
    loader.classList.remove('hidden');

    try {
        const response = await fetch('http://localhost:3000/api/analyze-skill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: skillText })
        });

        const data = await response.json();
        
        // AI categorization result
        console.log("AI Categorization:", data);
        
        // Successful registration simulation
        alert(`Success! Our AI categorized your skill as: ${data.labels[0].toUpperCase()}`);
        window.location.href = "dashboard.html";
        
    } catch (error) {
        console.error("AI Analysis failed:", error);
        alert("Registration successful (Offline mode)");
        window.location.href = "dashboard.html";
    } finally {
        loader.classList.add('hidden');
    }
});
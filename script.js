document.getElementById('coldLogisticsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // 这里应该有更多的验证逻辑...
    
    const formData = new FormData(this);
    fetch('/api/submit-form', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
});
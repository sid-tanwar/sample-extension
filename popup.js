document.getElementById('sendMessage').addEventListener('click', function() {
    chrome.runtime.sendMessage({ message: "Hello from Popup!" });
});

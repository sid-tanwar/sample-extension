chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message from Popup:", request.message);
    // You can perform actions here in response to the message
});

// Listen for webNavigation events
// background.js

// Listen for webNavigation events
chrome.webNavigation.onCompleted.addListener(function(details) {
    // Retrieve existing data from local storage
    chrome.storage.local.get("navigationData", function(result) {
        // Check if there's existing data
        var navigationData = result.navigationData || [];
        let data = {
            type:'navigation',
            data:{
                url:details.url,
                visitedAt:new Date().toISOString(),
                event:'navigation'
            }
        }
        // Append new data to the existing data
        navigationData.push(data);
        
        // Store the updated data back into local storage
        chrome.storage.local.set({ "navigationData": navigationData }, function() {
            console.log("Navigation data appended:", details.url);
        });
    });
});


// background.js

// Listen for cookie changes
// background.js

// Listen for cookie changes
// chrome.cookies.onChanged.addListener(function(changeInfo) {
//     // Retrieve existing data from local storage
//     chrome.storage.local.get("cookieChanges", function(result) {
//         // Check if there's existing data
//         var cookieChanges = result.cookieChanges || [];
        
//         // Append new data to the existing data
//         cookieChanges.push(changeInfo);
        
//         // Store the updated data back into local storage
//         chrome.storage.local.set({ "cookieChanges": cookieChanges }, function() {
//             console.log("Cookie change data appended:", changeInfo);
//         });
//     });
// });

// background.js

// Listen for web requests to Google's search endpoint
chrome.webRequest.onCompleted.addListener(function(details) {
    // Check if the request is for Google's search endpoint
    if (details.url.startsWith("https://www.google.com/search")) {
        // Extract search query parameters from the URL
        const urlParams = new URLSearchParams(details.url.split('?')[1]);
        const searchQuery = urlParams.get('q');
        
        // Store search query in local storage
        chrome.storage.local.get("searchQueries", function(result) {
            const searchQueries = result.searchQueries || [];
            let data = {
                type:"search",
                query:searchQuery,
                searchedAt:new Date().toISOString()
            }
            searchQueries.push(data);
            chrome.storage.local.set({ "searchQueries": searchQueries }, function() {
                console.log("Search query stored:", JSON.stringify(data));
            });
        });
    }
}, { urls: ["https://www.google.com/search*"] });

// background.js

// Function to retrieve and store user's geolocation
function storeUserGeolocation() {
    // Check if Geolocation is supported
    if ("geolocation" in navigator) {
        // Get user's current position
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            const userLocation = { latitude, longitude };
            
            // Store user's geolocation in local storage
            chrome.storage.local.set({ "userLocation": userLocation }, function() {
                console.log("User's geolocation stored:", userLocation);
            });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Store user's geolocation when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
    storeUserGeolocation();
});

// Optionally, you can also store user's geolocation when the browser starts
chrome.runtime.onStartup.addListener(function() {
    storeUserGeolocation();
});




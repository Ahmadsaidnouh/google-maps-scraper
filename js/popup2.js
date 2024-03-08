document.addEventListener("DOMContentLoaded", function ()
{
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        let currentTab = tabs[0];
        let actionButton = document.getElementById("actionButton");
        let resultsTable = document.getElementById("resultsTable");
        if (currentTab && currentTab.url.includes("https://www.google.com/maps/search")) {
            // let message = currentTab.url.includes("https://www.google.com/maps/search") ?
            //     "You are on Google Maps Search." : "Go to google Maps Search";
            document.getElementById('message').textContent = "You are on Google Maps Search.";
            actionButton.disabled = false;
            actionButton.classList.add("enabled");
        }
        else {
            document.getElementById('message').textContent = "Go to google Maps Search.";
            actionButton.disabled = true;
            actionButton.classList.remove("enabled");
        }

        // actionButton.addEventListener("click", () =>
        // {
        //     chrome.scripting.executeScript({
        //         target: { tabId: currentTab.id },
        //         function: function ()
        //         {
        //             let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
        //             return links.map(link => link.href);
        //         }
        //     }, function (results)
        //     {
        //         // Clear the table
        //         while (resultsTable.firstChild) {
        //             resultsTable.removeChild(resultsTable.firstChild);
        //         }

        //         // Add the resukts to the table
        //         results[0].result.forEach(function (url)
        //         {
        //             let row = document.createElement("tr");
        //             let cell = document.createElement('td');
        //             cell.textContent = url;
        //             row.appendChild(cell);
        //             resultsTable.appendChild(row);
        //         })
        //     });
        // })
        actionButton.addEventListener("click", () =>
        {
            // alert("clicked perform btn");
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: scrapeData
            }, function (results)
            {
                // Handle results
                if (!results || !results[0] || !results[0].result) return;

                // Clear the table
                while (resultsTable.firstChild) {
                    resultsTable.removeChild(resultsTable.firstChild);
                }

                // Add the resukts to the table
                results[0].result.forEach(function (item)
                {
                    let row = document.createElement("tr");
                    // ['href', 'title', 'rating', 'priceLevel', 'address'].forEach((key) =>
                    ['href', 'title', 'rating'].forEach((key) =>
                    {
                        let cell = document.createElement('td');
                        cell.textContent = item[key] || 'N/A';
                        row.appendChild(cell);
                    })
                    resultsTable.appendChild(row);
                })
            });
        });
    });
});

function scrapeData()
{
    // Selector updates and kogic to extract additional data
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    return links.map(link => {
        let container = link.closest(".Nv2PK");
        let titleText = container ? container.querySelector('.qBF1Pd').textContent : 'N/A';
        // alert("clicked perform btn" + container.querySelector('.MW4etd').textContent);
        // let ratingText = container ? (container.querySelector('.MW4etd').textContent + ' ' + container.querySelector('.UY7F9').textContent) : 'N/A';

        return {
            href: link.href,
            title: titleText,
            // rating: ratingText
        };
    });
}
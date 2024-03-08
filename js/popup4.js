document.addEventListener("DOMContentLoaded", function ()
{
    // Listen for messages from the content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>
    {
        if (request.message === 'scrapeData:start') {
            dataLoading();
        } else if (request.message === 'scrapeData:end') {
            dataLoaded();
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs)
    {
        let currentTab = tabs[0];
        let actionButton = document.getElementById("actionButton");
        let resultsTable = document.getElementById("resultsTable");
        let loading = document.querySelector(".loading");
        let table = document.querySelector(".table");

        if (currentTab && currentTab.url.includes("https://www.google.com/maps/search")) {
            document.getElementById('message').textContent = "You are on Google Maps Search.";
            actionButton.disabled = false;
            actionButton.classList.add("enabled");
        }
        else {
            document.getElementById('message').textContent = "Go to google Maps Search.";
            actionButton.disabled = true;
            actionButton.classList.remove("enabled");
        }

        actionButton.addEventListener("click", () =>
        {
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: scrapeData
            }, function (results)
            {
                let cartona = ``;
                // Add the resukts to the table
                results[0].result.forEach(function (item)
                {
                    cartona += `<tr>
                    <td>${item['index']}</td>
                    <td>${item['title']}</td>
                    <td>${item['rating']}</td>
                    <td>${item['latitude']}</td>
                    <td>${item['longitude']}</td>
                    <td>${item['shortenedURL']}</td>
                    <td>${item['fullURL']}</td>
                    </tr>`;
                });
                resultsTable.innerHTML = cartona;
            });
        })
    })
})

async function scrapeData()
{
    // Send a message to the popup script to indicate that scraping has started
    chrome.runtime.sendMessage({message: 'scrapeData:start'});
    
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = [];

    async function processLink(index)
    {
        if (index >= links.length) {
            return parsedData;
        }
        let delaySec = 2000;

        let link = links[index];
        let container = link.closest('[jsaction*="mouseover:pane"]');
        let titleText = container ? container.querySelector('.qBF1Pd').textContent : 'N/A';
        let ratingText = (container && container.querySelector('.MW4etd') && container.querySelector('.UY7F9')) ? (container.querySelector('.MW4etd').textContent + ' ' + container.querySelector('.UY7F9').textContent) : 'N/A';
        let latitude = 'N/A';
        let longitude = 'N/A';
        let shortenedURL = 'N/A';

        const regex = /!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)!1/;
        const match = link.href.match(regex);

        if (match) {
            latitude = match[1];
            longitude = match[2];
        }

        link.click();
        console.log("index = " + index);
        await new Promise(r => setTimeout(r, delaySec));

        // console.log(1);
        while (!document.querySelectorAll(".g88MCb.S9kvJb")[4]) {
            await new Promise(r => setTimeout(r, delaySec));
            // console.log(2);
            console.log("ShareBtn = " + document.querySelectorAll(".g88MCb.S9kvJb")[4]);
        }
        
        // console.log(3);
        document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
        // console.log(4);
        await new Promise(r => setTimeout(r, delaySec));
        
        // console.log(5);

        let maxAttempts = 10;
        let attempts = 0;
        while (!document.querySelector(".vrsrZe") && attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, delaySec));
            // console.log(attempts);
            attempts++;
            console.log("URL input = " + document.querySelector(".vrsrZe"));
        }
        
        // console.log(7);
        shortenedURL = document.querySelector(".vrsrZe") ? document.querySelector(".vrsrZe").value : 'N/A';
        // console.log(8);

        document.querySelector(".ryQ5yd") ? document.querySelector(".ryQ5yd").click() : '';
        document.querySelector(".VfPpkd-icon-LgbsSe").click();

        parsedData.push({
            index: index + 1,
            title: titleText,
            rating: ratingText,
            latitude,
            longitude,
            shortenedURL,
            fullURL: link.href
        });

        // Use await here to wait for the function to finish before moving on to the next link
        await processLink(index + 1);
    }

    await processLink(0);
    
    // Send a message to the popup script to indicate that scraping has finished
    chrome.runtime.sendMessage({message: 'scrapeData:end'});
    return parsedData;
}
// function waitForElement1(selector) {
//     return new Promise((resolve, reject) => {
//         let element = document.querySelector(selector);

//         if (element) {
//             resolve(element);
//             return;
//         }

//         const observer = new MutationObserver((mutations, observer) => {
//             mutations.forEach((mutation) => {
//                 const nodes = Array.from(mutation.addedNodes);
//                 for (const node of nodes) {
//                     if (node.matches && node.matches(selector)) {
//                         observer.disconnect();
//                         resolve(node);
//                         return;
//                     }
//                 };
//             });
//         });

//         observer.observe(document.querySelector('body'), { childList: true, subtree: true });
//     });
// }
// function waitForElement(selector) {
//     console.log("enter wait");
//     return new Promise((resolve, reject) => {
//         let element = document.querySelector(selector);

//         if (element) {
//             resolve(element);
//             return;
//         }

//         const observer = new MutationObserver((mutations, observer) => {
//             for (const mutation of mutations) {
//                 const nodes = Array.from(mutation.addedNodes);
//                 for (const node of nodes) {
//                     if (node.nodeType === 1 && node.matches(selector)) {
//                         observer.disconnect();
//                         resolve(node);
//                         return;
//                     }
//                 }
//             }
//         });

//         observer.observe(document.body, { childList: true, subtree: true });
//     });
// }

// async function scrapeData()
// {
//     // Send a message to the popup script to indicate that scraping has started
//     chrome.runtime.sendMessage({message: 'scrapeData:start'});
    
//     let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
//     let parsedData = [];

//     async function processLink(index)
//     {
//         if (index >= links.length) {
//             return parsedData;
//         }

//         let link = links[index];
//         let container = link.closest('[jsaction*="mouseover:pane"]');
//         let titleText = container ? container.querySelector('.qBF1Pd').textContent : 'N/A';
//         let ratingText = (container && container.querySelector('.MW4etd') && container.querySelector('.UY7F9')) ? (container.querySelector('.MW4etd').textContent + ' ' + container.querySelector('.UY7F9').textContent) : 'N/A';
//         let latitude = 'N/A';
//         let longitude = 'N/A';
//         let shortenedURL = 'N/A';

//         const regex = /!8m2!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)!1/;
//         const match = link.href.match(regex);

//         if (match) {
//             latitude = match[1];
//             longitude = match[2];
//         }

//         link.click();
//         // await new Promise(r => setTimeout(r, 2000));
//         console.log("index = " + index);
//         await waitForElement(".g88MCb.S9kvJb");

//         // while (!document.querySelectorAll(".g88MCb.S9kvJb")[4]) {
//         //     await new Promise(r => setTimeout(r, 2000));
//         //     console.log("ShareBtn = " + document.querySelectorAll(".g88MCb.S9kvJb")[4]);
//         // }

//         document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
//         await new Promise(r => setTimeout(r, 2000));
//         await waitForElement(".vrsrZe");

//         // while (!document.querySelector(".vrsrZe")) {
//         //     await new Promise(r => setTimeout(r, 2000));
//         //     console.log("URL input = " + document.querySelector(".vrsrZe"));
//         // }

//         shortenedURL = document.querySelector(".vrsrZe").value;

//         document.querySelector(".ryQ5yd").click();
//         document.querySelector(".VfPpkd-icon-LgbsSe").click();

//         parsedData.push({
//             index: index + 1,
//             title: titleText,
//             rating: ratingText,
//             latitude,
//             longitude,
//             shortenedURL
//         });

//         // Use await here to wait for the function to finish before moving on to the next link
//         await processLink(index + 1);
//     }

//     await processLink(0);
    
//     // Send a message to the popup script to indicate that scraping has finished
//     chrome.runtime.sendMessage({message: 'scrapeData:end'});
//     return parsedData;
// }
function dataLoading()
{
    console.log("enter loading");
    let loading = document.querySelector(".loading");
    let table = document.querySelector(".table");
    let actionButton = document.getElementById("actionButton");


    loading.classList.replace("d-none", "d-flex");
    table.classList.replace("d-block", "d-none");
    actionButton.disabled = true;
    actionButton.classList.remove("enabled");
}
function dataLoaded()
{
    let loading = document.querySelector(".loading");
    let table = document.querySelector(".table");
    let actionButton = document.getElementById("actionButton");


    loading.classList.replace("d-flex", "d-none");
    table.classList.replace("d-none", "d-block");
    actionButton.disabled = false;
    actionButton.classList.add("enabled");
}
// https://www.google.com/maps/place/Egyptian+Modern+Art+Museum/data=!4m7!3m6!1s0x14f5c5c8f89bf53b:0x7170e3b3a1f2de70!8m2!3d31.2445212!4d29.9691196!16s%2Fg%2F11k474ztkd!19sChIJO_Wb-MjF9RQRcN7yobPjcHE?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/Seif+and+Adham+Wanly+Museum/data=!4m7!3m6!1s0x14f5c5ab94629813:0x532ab05ec4c6dc97!8m2!3d31.2443799!4d29.9688783!16s%2Fg%2F11k475n3kn!19sChIJE5hilKvF9RQRl9zGxF6wKlM?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/Royal+Jewelry+Museum,+Alexandria/data=!4m7!3m6!1s0x14f5c5293b29f3cb:0xf790955947954877!8m2!3d31.2406096!4d29.9632848!16s%2Fm%2F026b12c!19sChIJy_MpOynF9RQRd0iVR1mVkPc?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE+%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%B1%D9%81%D8%A9%E2%80%AD/data=!4m7!3m6!1s0x14f5c5c7e321a7f1:0x71409e5e35720354!8m2!3d31.2417893!4d29.972033!16s%2Fg%2F11nysv5d4t!19sChIJ8ach48fF9RQRVANyNV6eQHE?authuser=0&hl=en&rclk=1
// !8m2!3d31.2417893!4d29.972033!1

// https://maps.app.goo.gl/xxNnfwb5bMKDMv8r7
// https://www.google.com/maps/place/The+National+Museum+of+Egyptian+Civilization/@30.00841,31.248246,17z/data=!3m1!4b1!4m6!3m5!1s0x1458476863e39e8f:0xc2e058446f8f145d!8m2!3d30.00841!4d31.248246!16s%2Fg%2F11b8ch7dmc?hl=en-EG&entry=ttu
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

        actionButton.addEventListener("click", () =>
        {
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: scrapeData6
            }, function (results)
            {
                // Clear the table
                while (resultsTable.firstChild) {
                    resultsTable.removeChild(resultsTable.firstChild);
                }

                // Add the resukts to the table
                results[0].result.forEach(function (item)
                {
                    let row = document.createElement("tr");
                    ['title', 'rating', 'latitude', 'longitude', 'shortenedURL', 'href'].forEach(function (key)
                    {
                        let cell = document.createElement('td');
                        cell.textContent = item[key] || 'N/A';
                        row.appendChild(cell);
                    })
                    resultsTable.appendChild(row);
                })
            });
        })
    })
})



function waitForElement(selector)
{
    return new Promise(function (resolve, reject)
    {
        let element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        let observer = new MutationObserver(function (mutations)
        {
            mutations.forEach(function (mutation)
            {
                let nodes = Array.from(mutation.addedNodes);
                for (let node of nodes) {
                    if (node.matches && node.matches(selector)) {
                        observer.disconnect();
                        resolve(node);
                        return;
                    }
                };
            });
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    });
}

async function scrapeData4()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let results = [];
    for (let link of links) {
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
        await waitForElement(".g88MCb.S9kvJb"); // wait for the share icon to appear

        document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
        await waitForElement(".vrsrZe"); // wait for the shortened URL to appear

        shortenedURL = document.querySelector(".vrsrZe").value;

        document.querySelector(".ryQ5yd").click(); // close the share popup
        await waitForElement(".VfPpkd-icon-LgbsSe"); // wait for the close icon to appear

        document.querySelector(".VfPpkd-icon-LgbsSe").click(); // close the location details
        await new Promise(r => setTimeout(r, 2000)); // wait for the details to close

        results.push({
            href: link.href,
            title: titleText,
            rating: ratingText,
            latitude,
            longitude,
            shortenedURL
        });
    }
    return results;
}







async function scrapeData6()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = [];

    async function processLink(index)
    {
        if (index >= links.length) {
            return parsedData;
        }

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
        await new Promise(r => setTimeout(r, 1500));
        console.log("index = " + index);


        while (!document.querySelectorAll(".g88MCb.S9kvJb")[4]) {
            await new Promise(r => setTimeout(r, 1500));
            console.log("ShareBtn = " + document.querySelectorAll(".g88MCb.S9kvJb")[4]);
        }

        document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
        await new Promise(r => setTimeout(r, 1500));

        while (!document.querySelector(".vrsrZe")) {
            await new Promise(r => setTimeout(r, 1500));
            console.log("URL input = " + document.querySelector(".vrsrZe"));
        }

        shortenedURL = document.querySelector(".vrsrZe").value;

        document.querySelector(".ryQ5yd").click();
        document.querySelector(".VfPpkd-icon-LgbsSe").click();

        parsedData.push({
            href: link.href,
            title: titleText,
            rating: ratingText,
            latitude,
            longitude,
            shortenedURL
        });

        // Use await here to wait for the function to finish before moving on to the next link
        await processLink(index + 1);
    }

    await processLink(0);
    return parsedData;
}




async function scrapeData5()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = []; // Define parsedData here to avoid ReferenceError

    // Define a function to process each link recursively
    async function processLink(index)
    {
        if (index >= links.length) {
            // If all links are processed, resolve the promise with the data
            return parsedData;
            // return Promise.resolve(parsedData);
        }

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

        // Click the link
        link.click();
        await new Promise(r => setTimeout(r, 1500)); // wait for 1 second before checking again
        console.log("index = " + index);
        while (1) {
            console.log("ShareBtn = " + document.querySelectorAll(".g88MCb.S9kvJb")[4]);
            await new Promise(r => setTimeout(r, 1500)); // wait for 1 second before checking again
            if (document.querySelectorAll(".g88MCb.S9kvJb")[4] == null) continue;

            document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
            await new Promise(r => setTimeout(r, 1500)); // wait for 1 second before checking again

            // After a short delay, get the shortened URL
            while (1) {
                console.log("URL input = " + document.querySelector(".vrsrZe"));
                await new Promise(r => setTimeout(r, 1500)); // wait for 1 second before checking again
                if (document.querySelector(".vrsrZe") == null) continue;

                shortenedURL = document.querySelector(".vrsrZe").value;

                // Click the close button
                document.querySelector(".ryQ5yd").click();

                // Click the close icon
                document.querySelector(".VfPpkd-icon-LgbsSe").click();

                // Add the data to parsedData array
                parsedData.push({
                    href: link.href,
                    title: titleText,
                    rating: ratingText,
                    latitude,
                    longitude,
                    shortenedURL
                });
                console.log("parsed Data = " + parsedData);

                // Process the next link
                await processLink(index + 1);

                break;
            }
        }

        // // After a short delay, perform the next steps
        // return new Promise(resolve =>
        // {
        //     setTimeout(async () =>
        //     {
        //         // Click the share button
        //         document.querySelectorAll(".g88MCb.S9kvJb")[4].click();

        //         // After a short delay, get the shortened URL
        //         while (1) {
        //             console.log(document.querySelector(".vrsrZe"));
        //             await new Promise(r => setTimeout(r, 1000)); // wait for 1 second before checking again
        //             if (document.querySelector(".vrsrZe") == null) continue;

        //             shortenedURL = document.querySelector(".vrsrZe").value;

        //             // Click the close button
        //             document.querySelector(".ryQ5yd").click();

        //             // Click the close icon
        //             document.querySelector(".VfPpkd-icon-LgbsSe").click();

        //             // Add the data to parsedData array
        //             parsedData.push({
        //                 href: link.href,
        //                 title: titleText,
        //                 rating: ratingText,
        //                 latitude,
        //                 longitude,
        //                 shortenedURL
        //             });
        //             console.log("index = " + index);
        //             console.log("parsed Data = " + parsedData);

        //             // Process the next link
        //             resolve(processLink(index + 1));

        //             break;
        //         }
        //         // setTimeout(() => {
        //         //     shortenedURL = document.querySelector(".vrsrZe").value;

        //         //     // Click the close button
        //         //     document.querySelector(".ryQ5yd").click();

        //         //     // Click the close icon
        //         //     document.querySelector(".VfPpkd-icon-LgbsSe").click();

        //         //     // Add the data to parsedData array
        //         //     parsedData.push({
        //         //         href: link.href,
        //         //         title: titleText,
        //         //         rating: ratingText,
        //         //         latitude,
        //         //         longitude,
        //         //         shortenedURL
        //         //     });
        //         //     console.log("index = " + index);
        //         //     console.log("parsed Data = " + parsedData);

        //         //     // Process the next link
        //         //     resolve(processLink(index + 1));
        //         // }, 1500); // Wait for the URL to be fetched
        //     }, 1000); // Wait for the share button to appear
        // });
        await processLink(0);
        return parsedData;
    }

    // Start processing the links from the first link (index 0)
    return processLink(0);
}
function scrapeData3()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = []; // Define parsedData here to avoid ReferenceError

    // Define a function to process each link recursively
    function processLink(index)
    {
        if (index >= links.length) {
            // If all links are processed, resolve the promise with the data
            return Promise.resolve(parsedData);
        }

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

        // Click the link
        link.click();

        // After a short delay, perform the next steps
        return new Promise(resolve =>
        {
            setTimeout(async () =>
            {
                // Click the share button
                document.querySelectorAll(".g88MCb.S9kvJb")[4].click();

                // After a short delay, get the shortened URL
                while (1) {
                    console.log(document.querySelector(".vrsrZe"));
                    await new Promise(r => setTimeout(r, 1000)); // wait for 1 second before checking again
                    if (document.querySelector(".vrsrZe") == null) continue;

                    shortenedURL = document.querySelector(".vrsrZe").value;

                    // Click the close button
                    document.querySelector(".ryQ5yd").click();

                    // Click the close icon
                    document.querySelector(".VfPpkd-icon-LgbsSe").click();

                    // Add the data to parsedData array
                    parsedData.push({
                        href: link.href,
                        title: titleText,
                        rating: ratingText,
                        latitude,
                        longitude,
                        shortenedURL
                    });
                    console.log("index = " + index);
                    console.log("parsed Data = " + parsedData);

                    // Process the next link
                    resolve(processLink(index + 1));

                    break;
                }
                // setTimeout(() => {
                //     shortenedURL = document.querySelector(".vrsrZe").value;

                //     // Click the close button
                //     document.querySelector(".ryQ5yd").click();

                //     // Click the close icon
                //     document.querySelector(".VfPpkd-icon-LgbsSe").click();

                //     // Add the data to parsedData array
                //     parsedData.push({
                //         href: link.href,
                //         title: titleText,
                //         rating: ratingText,
                //         latitude,
                //         longitude,
                //         shortenedURL
                //     });
                //     console.log("index = " + index);
                //     console.log("parsed Data = " + parsedData);

                //     // Process the next link
                //     resolve(processLink(index + 1));
                // }, 1500); // Wait for the URL to be fetched
            }, 1000); // Wait for the share button to appear
        });
    }

    // Start processing the links from the first link (index 0)
    return processLink(0);
}

async function scrapeData2()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = []; // Define parsedData here to avoid ReferenceError

    // Define a function to process each link asynchronously
    async function processLink(index)
    {
        if (index >= links.length) {
            // If all links are processed, return the parsed data
            return parsedData;
        }

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

        // Click the link
        link.click();

        console.log("1");

        // Wait for the share button to appear
        await waitForElement(".g88MCb.S9kvJb");
        console.log("2");

        // Click the share button
        document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
        console.log("3");

        // Wait for the shortened URL to appear
        await waitForElement(".vrsrZe");
        console.log("4");

        // Get the shortened URL
        shortenedURL = document.querySelector(".vrsrZe").value;

        // Click the close button
        document.querySelector(".ryQ5yd").click();

        // Click the close icon
        document.querySelector(".VfPpkd-icon-LgbsSe").click();

        // Add the data to parsedData array
        parsedData.push({
            href: link.href,
            title: titleText,
            rating: ratingText,
            latitude,
            longitude,
            shortenedURL
        });

        console.log("index = " + index);
        console.log("parsed Data = " + parsedData);

        // Process the next link
        return processLink(index + 1);
    }

    // Start processing the links from the first link (index 0)
    return processLink(0);
}// Function to wait for an element to appear
function waitForElement2(selector)
{
    return new Promise((resolve) =>
    {
        const observer = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Check if the element already exists
        if (document.querySelector(selector)) {
            observer.disconnect();
            resolve();
        }
    });
}
// Function to wait for an element to appear
function waitForElement1(selector)
{
    return new Promise((resolve) =>
    {
        const interval = setInterval(() =>
        {
            console.log("ele =" + document.querySelector(selector));
            if (document.querySelector(selector)) {
                clearInterval(interval);
                resolve();
            }
        }, 100); // Check every 100 milliseconds
    });
}

function scrapeData1()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    let parsedData = []; // Define parsedData here to avoid ReferenceError

    // Define a function to process each link recursively
    function processLink(index)
    {
        if (index >= links.length) {
            // If all links are processed, resolve the promise with the data
            return Promise.resolve(parsedData);
        }

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

        // Click the link
        link.click();

        // After a short delay, perform the next steps
        return new Promise(resolve =>
        {
            setTimeout(() =>
            {
                // Click the share button
                document.querySelectorAll(".g88MCb.S9kvJb")[4].click();

                // After a short delay, get the shortened URL
                setTimeout(() =>
                {
                    shortenedURL = document.querySelector(".vrsrZe").value;

                    // Click the close button
                    document.querySelector(".ryQ5yd").click();

                    // Click the close icon
                    document.querySelector(".VfPpkd-icon-LgbsSe").click();

                    // Add the data to parsedData array
                    parsedData.push({
                        href: link.href,
                        title: titleText,
                        rating: ratingText,
                        latitude,
                        longitude,
                        shortenedURL
                    });
                    console.log("index = " + index);
                    console.log("parsed Data = " + parsedData);

                    // Process the next link
                    resolve(processLink(index + 1));
                }, 2000); // Wait for the URL to be fetched
            }, 1000); // Wait for the share button to appear
        });
    }

    // Start processing the links from the first link (index 0)
    return processLink(0);
}

function scrapeData()
{
    let links = Array.from(document.querySelectorAll('a[href^="https://www.google.com/maps/place"]'));
    // return links.map(link => link.href);
    return links.map(link =>
    {
        // let container = link.closest(".Nv2PK");
        // console.log(link);
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

        // link.href.click();
        link.click();
        // then
        document.querySelectorAll(".g88MCb.S9kvJb")[4].click();
        // then
        shortenedURL = document.querySelector(".vrsrZe").value;
        // then
        document.querySelector(".ryQ5yd").click();
        // then
        document.querySelector(".VfPpkd-icon-LgbsSe").click();


        return {
            href: link.href,
            title: titleText,
            rating: ratingText,
            latitude,
            longitude
        };
    })
}
// https://www.google.com/maps/place/Egyptian+Modern+Art+Museum/data=!4m7!3m6!1s0x14f5c5c8f89bf53b:0x7170e3b3a1f2de70!8m2!3d31.2445212!4d29.9691196!16s%2Fg%2F11k474ztkd!19sChIJO_Wb-MjF9RQRcN7yobPjcHE?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/Seif+and+Adham+Wanly+Museum/data=!4m7!3m6!1s0x14f5c5ab94629813:0x532ab05ec4c6dc97!8m2!3d31.2443799!4d29.9688783!16s%2Fg%2F11k475n3kn!19sChIJE5hilKvF9RQRl9zGxF6wKlM?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/Royal+Jewelry+Museum,+Alexandria/data=!4m7!3m6!1s0x14f5c5293b29f3cb:0xf790955947954877!8m2!3d31.2406096!4d29.9632848!16s%2Fm%2F026b12c!19sChIJy_MpOynF9RQRd0iVR1mVkPc?authuser=0&hl=en&rclk=1
// https://www.google.com/maps/place/%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE+%D9%88%D8%A7%D9%84%D9%85%D8%B9%D8%B1%D9%81%D8%A9%E2%80%AD/data=!4m7!3m6!1s0x14f5c5c7e321a7f1:0x71409e5e35720354!8m2!3d31.2417893!4d29.972033!16s%2Fg%2F11nysv5d4t!19sChIJ8ach48fF9RQRVANyNV6eQHE?authuser=0&hl=en&rclk=1
// !8m2!3d31.2417893!4d29.972033!1

// https://maps.app.goo.gl/xxNnfwb5bMKDMv8r7
// https://www.google.com/maps/place/The+National+Museum+of+Egyptian+Civilization/@30.00841,31.248246,17z/data=!3m1!4b1!4m6!3m5!1s0x1458476863e39e8f:0xc2e058446f8f145d!8m2!3d30.00841!4d31.248246!16s%2Fg%2F11b8ch7dmc?hl=en-EG&entry=ttu
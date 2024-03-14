# Google Maps Scraper

## Contents:

- [Google Maps Scraper](#google-maps-scraper)
  - [Contents:](#contents)
  - [About the project](#about-the-project)
  - [User Manual](#user-manual)
    - [Download the project files](#download-the-project-files)
    - [Load the extension](#load-the-extension)
    - [How to use](#how-to-use)
  - [Full loading and usage demo](#full-loading-and-usage-demo)


## About the project

The Google Maps Scraper Chrome Extension is born out of a passion for automation and its transformative power to save time and effort. In the digital age, efficiency is key, and this project is a testament to that belief.

Initially conceived to support a separate project requiring extensive data collection from Google Maps, the traditional method involved a tedious process of visiting each location's page, manually extracting longitude and latitude from the URL, and copying details such as the shortened URL, name, rating, and visitor count.

Recognizing the need for a more streamlined approach, this extension revolutionizes the data collection process. Users can simply open Google Maps, input a search term (e.g., "museum"), and with a single click, all the relevant data from the suggested places is neatly organized into a table within a popup window.

Moreover, the extension offers the convenience of exporting this data in JSON format. By clicking the 'Copy Results as JSON' button, users can effortlessly copy the data to their clipboard, formatted as shown below:

```json
[
  {
    "fullURL": "https://www.google.com/maps/place/...",
    "index": 1,
    "lat": 31.2406096,
    "long": 29.9632848,
    "name": "Royal Jewelry Museum, Alexandria",
    "rating": 4.6,
    "reviewsCount": 7112,
    "shortenedURL": "https://maps.app.goo.gl/..."
  },
  ...
]
```
This extension is not just a tool; it’s a gateway to unlocking the full potential of Google Maps data, tailored for researchers, marketers, and anyone in need of geographical data at their fingertips.

Feel free to adjust the content to better fit your project's vision and the features of your extension. If you need further customization or additional sections, let me know!

## User Manual

**Note:** The Google Maps Scraper Chrome Extension is currently not available in the Chrome Web Store. However, installing it is straightforward and only takes two simple steps. First, download the project files from the repository. Then, navigate to the 'Extensions' page in your Chrome browser, enable 'Developer mode', and use the 'Load unpacked' option to upload the extension's folder. Voilà! You're all set to start scraping Google Maps with ease.

### Download the project files

Create a new folder on your machine (e.g., ___"new-folder"___). Then, open the terminal in the ___new-folder___ and clone this repo using the following command ___git clone https://github.com/Ahmadsaidnouh/google-maps-scraper.git___. Now, the folder structure will be:

___new-folder___ --->  ___google-maps-scraper___

### Load the extension
- First, navigate to the 'Extensions' page in your Chrome browser by typing ___chrome://extensions/___ in your Chrome browser search bar.
- Second, enable 'Developer mode' as you will see in the demo.
- Third, use the 'Load unpacked' option to upload the extension's folder which will be the ___google-maps-scraper___ folder in this case.
- Final, reload the current tab then open your extensions dropdown list and you will find the extension with the name ***Google Maps Scraper***

### How to use
**Important Note:** Upon clicking the extension icon, it will automatically check the URL of the current tab. The "Scrape Places" button will only be enabled if the URL begins with "https://www.google.com/maps/search/...". This ensures that the extension is used in the correct context for scraping data. If the URL does not match this pattern, the button will remain inactive and unclickable.

Using the Google Maps Scraper Chrome Extension is simple and intuitive. Follow these steps to start scraping location data from Google Maps:

1. **Open Google Maps**: Navigate to Google Maps.

2. **Search for Places**: Enter a keyword in the search bar, such as "museums". You will see multiple suggestions in the sidebar on the left side of the screen.

3. **Activate the Extension**: Click on the extension icon in your browser. Since the current tab's URL starts with "https://www.google.com/maps/search/...", the "Scrape Places" button will be enabled.

4. **Scrape Data**: Click the "Scrape Places" button. The extension will begin scraping the displayed places and present the results in a table within a popup.

5. **Export as JSON**: To extract the scraped data in JSON format, click the "Copy Results as JSON" button. The data will be copied to your clipboard.

6. **Load More Places**: If you wish to scrape additional places, simply hover over the search results sidebar, scroll down to load more places, and then click the "Scrape Places" button again.

With these easy steps, you can efficiently collect valuable data from Google Maps for your projects.

## Full loading and usage demo
[Link to Demo Video](https://drive.google.com/file/d/11rVTxQwxdsV4R74o_F5JGMh2mLpEjM66/view?usp=sharing)

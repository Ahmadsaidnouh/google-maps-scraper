# Google Maps Scraper

## Contents:

- [Google Maps Scraper](#google-maps-scraper)
  - [Contents:](#contents)
  - [About the project](#about-the-project)
  - [User Manual](#user-manual)
    - [Starting the program](#starting-the-program)
    - [Enter inputs](#enter-inputs)
    - [How to enter directory path](#how-to-enter-directory-path)
  - [Code Overview](#code-overview)
    - [Makefile overview](#makefile-overview)
    - [Backupd script overview](#backupd-script-overview) 
  - [Sample Runs](#sample-runs)
  - [Input Validations and Errors Handling](#input-validations-and-errors-handling)


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

Create a new folder on your machine (e.g., ___"new-foler"___). Then, open the terminal in the ___new-folder___ and clone this repo using the following command ___git clone https://github.com/Ahmadsaidnouh/google-maps-scraper.git___. Now, the folder structure will be:

___new-folder___ --->  ___google-maps-scraper___

### Load the extension
- First, navigate to the 'Extensions' page in your Chrome browser by typing ___chrome://extensions/___ in your Chrome browser search bar.
- Second, enable 'Developer mode' as shown in the following image:
- Third, use the 'Load unpacked' option to upload the extension's folder which will be the ___google-maps-scraper___ folder in this case.
- Final, reload the current tab then open your extensions dropdown list and you will find the extension with the name ***Google Maps Scraper***

### How to Use
**Important Note:** Upon clicking the extension icon, it will automatically check the URL of the current tab. The "Scrape Places" button will only be enabled if the URL begins with "https://www.google.com/maps/search/...". This ensures that the extension is used in the correct context for scraping data. If the URL does not match this pattern, the button will remain inactive and unclickable.

Using the Google Maps Scraper Chrome Extension is simple and intuitive. Follow these steps to start scraping location data from Google Maps:

1. **Open Google Maps**: Navigate to Google Maps.

2. **Search for Places**: Enter a keyword in the search bar, such as "museums". You will see multiple suggestions in the sidebar on the left side of the screen.

3. **Activate the Extension**: Click on the extension icon in your browser. Since the current tab's URL starts with "https://www.google.com/maps/search/...", the "Scrape Places" button will be enabled.

4. **Scrape Data**: Click the "Scrape Places" button. The extension will begin scraping the displayed places and present the results in a table within a popup.

5. **Export as JSON**: To extract the scraped data in JSON format, click the "Copy Results as JSON" button. The data will be copied to your clipboard.

6. **Load More Places**: If you wish to scrape additional places, simply hover over the search results sidebar, scroll down to load more places, and then click the "Scrape Places" button again.

With these easy steps, you can efficiently collect valuable data from Google Maps for your projects.


Once you run ___make___ command, the program will ask you to enter the four inputs as shown in the image below. 
![inputs](imgs-backupd/input.png)
- First input ___dir___ : it is the directory to be backed up, must be existing directory.
- Second input ___backupdir___ : it is the backup destination directory. You have two options here, you either specify its name or just leave this option empty and the program will automatically backup to a default directory ___~/backups___.Therefore, there are 6 cases:
  - cases1: default directory ___~/backups___ and it's not exiting ==============> will create it then proceed backing up directly. 
  - cases2: default directory ___~/backups___ and it's exiting but empty ========> will proceed backing up directly. 					
  - cases3: default directory ___~/backups___ and it's exiting but not empty ====> will firstly ask the user if he want to delete all existing files in __~/backups__. If user said yes, the program will delete all existing files then proceed backing up directly. If user said no, the program will terminate execution without any deletion. 
  - cases4: user specified directory and it's not existing ======================> will create it then proceed backing up directly. 	
  - cases5: user specified directory and it's existing but empty ================> will proceed backing up directly. 						
  - cases6: user specified directory and it's existing but not empty ============> will display error message and then terminate execution without any deletion. 
- Third input ___interval-sec___ : it is how many seconds the program should wait before checking for a new backup.
- Fourth input ___max-backups___ : it is the maximum number of backups to be stored in the ___backupdir___. If maximum backups is reached and a new backup needs to be added, the program will delete the oldest backup and then add the new one.
  
### How to enter directory path
All directories that will be dealt with must be below your home directory. Therefore, any directory path you will enter to the program must be relative to the (\~/). The tilde (\~) is a Linux "shortcut" to denote a user's home directory. Thus tilde slash (\~/) is the beginning of a path to a file or directory below the your home directory. For example, if you have a directory named ___abc___ below your home directory then its path is ___~/abc___. So if you want to back it up then just enter to the program ___abc___ , not ___~/abc___. Also, if you have a directory named ___xyz___ below that ___abc___ directory then its path is ___~/abc/xyz___. So, if you want to back it up then just enter to the program ___abc/xyz___ , not ___~/abc/xyz___. 


## Code Overview

### Makefile overview
First, inputs are taken from the user. Then, inputs are validated and the appropriate message is shown if an error occurs. If no errors, inputs will be analysed to know whether destination directory will be the default directory or will be a user specified directory. Also, at this step, the file checks if the destination directory is not existing, the file will create it. Then, the ___./backupd___ script is run with the appropriate arguments.

### Backupd script overview
First, arguments are parsed. Then, the destination directory will be parsed to determined which of the six cases described previously will be executed. Then, the first backup is created and the script enters an infinite loop that checks every interval whether changes have occured and a new backup is needed or not. 


## Sample Runs
__Backing up to the default directory__ :
![backup](imgs-backupd/success1.png)
![backup](imgs-backupd/success2.png)
</br></br>
__Backing up to a non-existing user specified directory__ :
![backup](imgs-backupd/noDef1.png)
![backup](imgs-backupd/noDef2.png)
</br></br>
__Backing up to an existing but empty user specified directory__ :
![backup](imgs-backupd/noDefEmpty1.png)
![backup](imgs-backupd/noDefEmpty2.png)


## Input Validations and Errors Handling

__Empty inputs__ :
![validation](imgs-backupd/emptyInputsValid.png)
</br></br>
__Source directory not existing__ :
![validation](imgs-backupd/sourceNotExistValid.png)
</br></br>
__Empty interval-sec__ :
![validation](imgs-backupd/intervalEmptyValid.png)
</br></br>
__Zero interval-sec__ :
![validation](imgs-backupd/intervalZeroValid.png)
</br></br>
__Non integer interval-sec__ :
![validation](imgs-backupd/intervalNonIntValid.png)
</br></br>
__Empty max-backups__ :
![validation](imgs-backupd/max-backupsEmptyValid.png)
</br></br>
__Zero max-backups__ :
![validation](imgs-backupd/max-backupsZeroValid.png)
</br></br>
__Non integer max-backups__ :
![validation](imgs-backupd/max-backupsNonIntValid.png)
</br></br>
__Backing directory to itself__ :
![validation](imgs-backupd/dirToItself.png)
</br></br>
__Default directory not empty answer no__ :
![validation](imgs-backupd/defaultBackup1.png)
![validation](imgs-backupd/defaultBackup2.png)
</br></br>
__Default directory not empty answer yes__ :
![validation](imgs-backupd/defaultBackup3.png)
![validation](imgs-backupd/defaultBackup4.png)
</br></br>
__User specified destination directory not empty__ :
![backup](imgs-backupd/noDefNotEmpty.png)

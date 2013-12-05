=== Contact Form to Email ===
Contributors: codepeople
Donate link: http://wordpress.dwbooster.com/forms/contact-form-to-email
Tags: contact form,contact,email,form,feedback,captcha,form to email,form to database,form to csv,csv,form to excel,excel
Requires at least: 3.0.5
Tested up to: 3.7
Stable tag: 1.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Contact form that sends the data to email and also to a database list and CSV file.

== Description ==

Contact Form to Email features:

	► Email delivery & notifications
	► Saves messages into database
	► Export to Excel / CSV
	► Printable list of messages
	► Anti-spam captcha
	► Field validation
	► Printable reports
	► One-click contact form
	► Automatic email reports
	► ... and more features (see below)

The main purpose of the **Contact Form to Email** is, as the name indicates, to **create contact forms** and **send their data email addresses**.

In addition to that basic feature it also **saves the contact form data into a database**, provides **printable reports** and the option to **export selected data to CSV/Excel** files.

= More about the Main Features: =

* **Email delivery / notifications:** The contact form data is sent by email to one or more email addresses. It also supports the configuration of auto-replies to the user who filled the contact form.
* **Form data saved into the database:** Avoid losing submissions and keep a record of the received contact form messages.
* **Printable list of messages:** Get the list of contacts received from the contact form within a selected date range and print it.
* **Export data to CSV/Excel:** Export the contact form data to a standard format that can be used by other applications. Export the email addresses and other contact form data using date and text search filters.
* **Automatic reports:** Provide automatic reports of the contact form usage and data entered into the form. Report of daily submissions and accumulative hourly report. Printable reports for specific fields into the contact form. Helps you top understand your data.
* **Automatic email reports:** Automatic reports sent to the indicated email addresses on a regular period.
* **Form Validation:** Set validation rules for each contact form field. Keep your data clean.
* **Anti-spam protection:** Built-it captcha anti-spam protection. No need to rely on external services for the contact form anti-spam protection.
* **Customizable email messages:** Specify the text of the contact form email notifications. Supports both plain text emails and HTML formatted emails.

= Messages List =

The messages list helps to check the past contact form submissions and print or export them. Includes a search/filter form with the following options:

* **Search for:** Search for a text into the contact form messages.
* **From ... to:** Date interval to be included in the list/reports.
* **Item:** You can have more than one contact form. Select here if you want to get the results of a specific contact form or from all contact forms.
* **Filter:** Shows the list according to the selected filters/options.
* **Export to CSV:** Export the CSV data according to the selected filters/options.

The CSV file will contain a first row with the field names and the next rows will contain one contact form submission per row, with one for field on each column. This way you can easily import the data from other applications or just select the columns/fields that you need (example: select only the emails). A CSV file can be opened and managed using Excel.

The list of contact form messages is shown below the search area. A print button below the list provides the messages list in a printable format.

= The Contact Form Reports =

The reports section lets you **analyze the use of the contact forms** and the data entered into them. The first section of the reports is a filter section similar to the one that appears in the messages list page. Below the filters section there are three graphical reports:

* **Submissions per day:** The report will display in point-lines graphic how many contact form submissions have been received each day in the selected date range. This report can be used to evaluate the contact form peaks and measure the impact of marketing actions.

* **Submissions per hour:** The report will display in a point-lines graphic how many contact form messages are received on each hour of the date; this is for the total messages in the selected date range. This report can be used for checking peak hours and focus the support service on those hours.

* **Report of values for a selected field:** Select any of the contact form fields and other information fields (like date, ip, hours) to get a report of how many times each value have been entered or selected. This is very useful if you form is used as a poll to get feedback from users, it makes easy to generate a report on selectable contact form fields. This report can be used also to study the most common data entered in the contact form and get a better idea of your customer's profile and needs.

A print button at the end of the page can be used to print the report of the values for the selected contact form field in a printer-friendly format.

= Automatic Email Reports =

The Contact Form to Email plugin allows the setup of two types of automatic (periodical) Email reports:

* **Global Email Reports:** Can be setup below the list of forms. This report sends a report with the new submissions of all forms every the specified number of days.

* **Form Email Reports:** Can be setup on the settings page of each form. This report sends a report with the new submissions of the related form every the specified number of days.

The reports are attached in a CSV / Excel file into the emails. In both cases the destination email addresses, email subject, email text and the report's interval can be specified. More info available in the section "Other Notes".



== Installation ==

To install Contact Form to Email, follow these steps:

1.	Download and unzip the Contact Form to Email plugin
2.	Upload the entire contact-form-to-email/ directory to the /wp-content/plugins/ directory
3.	Activate the Contact Form to Email plugin through the Plugins menu in WordPress
4.	Configure the contact form settings at the administration menu >> Settings >> Contact Form to Email
5.	To insert the contact form into some content or post use the icon that will appear when editing contents

== Frequently Asked Questions ==

= Q: What means each field in the contact form settings area? =

A: The Contact Form to Email product's page contains detailed information about each field and customization:

http://wordpress.dwbooster.com/forms/contact-form-to-email

= Q: How can I add specific fields into the email message? =

A: There is a tag named <%INFO%> that is replaced with all the information posted from the contact form, however you can use also optional tags for specific fields into the contact form.

For doing that, click the desired field into the form builder and in the settings box for that field there is a read-only setting named "Field tag for the message (optional):". Copy & paste that tag into the contact form message text and after the form submission that tag will be replaced with the text entered in the form field.

= Q: The contact form doesn't appear. What is the solution? = 

A: The cause is in most cases a conflict with a third party plugin or with the theme. To fix that, go to the "troubleshoot area" (located below the list of forms in the settings area) change the "Script load method" from "Classic" to "Direct".

If the problem persists after that modification please contact our support service and we will give you a solution. We will appreciate any feedback to make the contact form avoid conflicts with third party plugins/themes.

= Q: I'm having problems with non-latin characters in the contact form. =

A: Use the "troubleshoot area" to change the character encoding. Try first with the UTF-8 option.

= Q: I'm getting this message: "Destination folder already exists". Solution? =

The free version must be deleted before installing the pro version.

If you are uploading a new version via Plugins - New - Upload and a previous version is still installed, then delete the previous version first. This is a safe step, the plugin's data and settings won't be lost during the process.

Another alternative is to overwrite the plugin files through a FTP connection. This is also a safe step.


== Other Notes ==

**Opening the contact form messages in Excel:** Go either to the "Reports" or "Messages" section. There is a button labeled "Export to CSV". CSV files can be opened in Excel, just double-click the downloaded CSV file, it will contain the selected contact form submissions, one per line.

**Deleting a contact form message:** Go to the "Messages" section and use the button labeled "Delete" for the contact form message you want to delete. Each row in that list is a contact form submission.

**Get the contact form email from the user:** The email used as from is a fixed email specified on the contact form settings, this helps to prevent be classified as spam, however when you hit "reply" over the received email, the user's email address will appear allow you to easily reply the contact form messages. The header "Reply-to" is used for this purpose.

**Customizing the captcha image:** The captcha image used in the contact form is 100% implemented into the plugin, this way you don't need to rely on third party services/servers. In addition to the settings for customizing the captcha design you can also replace the font files located into the folder "contact-form-to-email/captcha/". The fonts are used as base for rendering the captcha on the contact form.

**Contact form email format:** The notifications emails sent from the contact form can be either plain-text emails or HTML emails. Plain text emails are preferred in most cases since are easier to edit and pass the anti-spam filters with more probability.

**Contact form Clone button:** The clone button duplicates a complete contact form with its settings. The contact form messages / emails and statistics aren't duplicated.

= Custom contact form submit button =  

There is a settings section info each form that allows to specify the label of the submit button. 

The class="pbSubmit" can be used to modify the button styles. 

The styles can be applied into any of the CSS files of your theme or into the CSS file "contact-form-to-email\css\stylepublic.css". 

For further modifications the submit button is located at the end of the file "cp-public-int.inc.php".

For general CSS styles modifications to the form and samples check this FAQ entry: http://wordpress.dwbooster.com/faq/contact-form-to-email#q77


= Customizing the automatic email reports =  

The settings for the email reports (both the global and per form reports) include the following configuration fields:

* **Enable Reports?:** Option for enabling / disabling the reports.
* **Send report every:** Indicate every how many days the reports will be sent.
* **Send after this hour (server time):** Approximate time at which the reports will be sent. This time is based on the server time. Some activity is needed on the website for sending the reports. You can setup a cron for a more exact delivery time.
* **Send email from:** The "from" email used for the reports. Avoid @aol.com and @hotmail.com "from" addresses to skip the anti-spam filters.
* **Send to email(s):** The list of emails (comma separated) that will receive the reports.
* **Email subject:** Subject of the email that will be sent with the Contact Form to Email reports.
* **Email format?:** Format of the email that will be sent with the Contact Form to Email reports. Can be HTML or Plain Text. In most cases plain text is easier to setup and has less problems with anti-spam services.
* **Email Text (CSV file will be attached):** Content of the email that will contain the Contact Form to Email reports. The reports will be attached in CSV format into the email.

= Importing messages =  

There is an option to import messages into the Contact Form to Email plugin. That option is located below the messages list and is labeled "Import CSV".

The messages can be imported in a comma separated CSV file. One record per line, one field per column. Don't use a header row with the field names.

The first 3 columns into the CSV file are the time, IP address and email address, if you don't have this information then leave the first three columns empty. After those initial columns the fields (columns) must appear in the same order than in the form.

Sample format for the CSV file:

    2013-04-21 18:50:00, 192.168.1.12, john@sample.com, "john@sample.com", "sample subject", "sample message"
    2013-05-16 20:49:00, 192.168.1.24, jane.smith@sample.com, "jane.smith@sample.com", "other subject", "other message"

= From address used for the emails =  

Into the "Form Processing / Email Settings" section the first settings field is named "Send email "From" and has the following options:

* **From fixed email address indicated below - Recommended option:**  If you select "from fixed..." the customer email address will appear in the "to" address when you hit "reply", this is the recommended setting to avoid mail server restrictions.

* **From the email address indicated by the customer:** If you select "from customer email" then the customer email will appear also visually when you receive the email, but this isn't supported by all hosting services, so this option isn't recommended in most cases.

== Screenshots ==

1. Adding fields to the contact form
2. Editing fields from the contact form
3. contact form processing settings
4. contact form validation settings
5. Inserting a contact form into a page
6. Built-in captcha image anti-spam protection

== Changelog ==

= 1.0 =
* First Contact Form to Email stable version released.
* More configuration options added on the contact form settings area.

== Upgrade Notice ==

= 1.0.1 =
First Contact Form to Email stable version released.
Compatible with the latest WP versions
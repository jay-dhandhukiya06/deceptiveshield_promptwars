DeceptiveShield
DeceptiveShield is a free security tool designed to protect online shoppers from sneaky checkout tricks and hidden fees. It includes a Chrome browser extension that catches traps in real time, along with a community website where users can report bad websites, upvote alerts, and create legal complaints.

What the Project Does
Finds Pre-Checked Traps: Spots hidden checkmarks (like delivery insurance or donation fees) that websites secretly add to your cart.

Catches Hidden Subscriptions: Uncovers tiny text that secretly signs you up for monthly charges or auto-pay.

Ignores Normal Rules: Smartly ignores required checkboxes like Terms of Service so it only flags actual traps.

Calculates the Real Price: Shows the true 1-year cost of hidden monthly fees compared to the advertised base price.

One-Click Trap Removal: Automatically unchecks hidden add-ons with a single click.

Community Wall of Shame: A public list where shoppers share, upvote, and warn others about dishonest websites.

AI Screenshot Scanner: Uses Gemini AI to scan uploaded photos of checkout pages and identify deceptive tricks.

Drafts Legal Complaints: Automatically writes a ready-to-send complaint letter citing official Indian consumer protection laws.

How Each File Works
manifest.json: The setup file that tells Google Chrome how the extension works and which permissions it needs.

content.js: The main scanner. It reads the shopping page, flags sneaky fees in red, and adds an alert button on your screen.

content.css: Sets the styles, red warning boxes, and alert badges shown on shopping pages.

popup.html & popup.js: The small window that pops up when you click the extension icon in your Chrome toolbar.

dummy_checkout.html: A safe practice store page included so you can test all the detections without spending real money.

Website Tabs Explained
Live Checkout Interceptor: A practice checkout page where you can test the scanner and see traps get caught live.

Community Wall of Shame: The public leaderboard where users vote on reported websites and view risk ratings.

Manual Report Submission: A simple form where anyone can report a bad shopping link and use Gemini AI to scan proof.

Legal & Regulatory Engine: Matches every trick to official consumer laws and creates a ready-to-file complaint for consumer court.

How to Install and Run
Download the project folder and open Google Chrome.

Type chrome://extensions in your Chrome address bar.

Turn on the Developer mode toggle in the top right corner.

Click the Load unpacked button in the top left corner.

Select the project folder.

Open dummy_checkout.html in your browser to see the tool work live.

Tools Used
Design & Logic: HTML, CSS, JavaScript

Extension Platform: Google Chrome Extensions

AI Analysis: Google Gemini AI

Rules & Law: Indian Consumer Protection Guidelines (2023) and Consumer Protection Act (2019)

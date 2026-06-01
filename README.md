<p align="center">                
  <img src="https://raw.githubusercontent.com/MGamerica/Bidifixer-Persian-English-/main/images/Picsart_26-05-30_23-39-56-111.jpg">                
</p>                

# Persian BidiFixer

A lightweight tool for fixing mixed Persian-English text rendering issues in HTML.

---

## Introduction

When Persian and English words are mixed in the same paragraph, browsers often display parts of the text in an incorrect order because of bidirectional text rendering behavior.

Persian BidiFixer solves this problem automatically by detecting Persian and Latin text segments and assigning the correct text direction to each part independently.

As a result, mixed-language content is displayed correctly without visual corruption.

---

## Example

### Before

<img src="https://raw.githubusercontent.com/MGamerica/Bidifixer-Persian-English-/main/images/Bad.jpg">

### After

<img src="https://raw.githubusercontent.com/MGamerica/Bidifixer-Persian-English-/main/images/Good.jpg">

---

## Features

- Automatic Persian and English text detection
- Correct RTL/LTR rendering
- Preserves mixed-language content structure
- Generates ready-to-use HTML output
- No dependencies
- Fully client-side
- Lightweight and fast

---

## How To Use

There are **two different usage modes** depending on your needs:

---

# 1) Copy-Paste Tool (No installation required)

This mode is for users who want to generate corrected HTML output quickly.

### Steps:

1. Paste your Persian-English mixed text into the input field.
2. The tool automatically generates a corrected preview.
3. Click **Copy Code**.
4. Paste the generated HTML into your website.

### Output Type

The output is a **self-contained HTML snippet** including:
- Processed content
- Required styles
- Correct bidirectional rendering

You do NOT need to include any JS file in this mode.

---

# 2) JavaScript Library (For Developers / Websites)

This mode is for developers who want to use BidiFixer directly in their website.

### Option A: Local file usage

Download and include the script:

```html
<script src="Bidifixer.js"></script>
<script>
BidiFixer.observe();
</script>

```

## Option B: GitHub raw file usage

```html
<script src="https://github.com/MGamerica/Bidifixer-Persian-English-/blob/main/Tool/Bidifixer.js"></script>
<script>
BidiFixer.scan();
</script>

```
## Recommended Usage Mode

This tool is primarily designed for:

- Persian pages with embedded English words  
- Technical content (URLs, commands, variables)  
- Mixed-language UI content  
- Blog posts and documentation  

---

## Tool

👉 [Open BidiFixer Tool](https://mgamerica.github.io/Bidifixer-Persian-English-/)


## Important Notes

### Generated Output

The generated output is a self-contained HTML snippet that includes:

- Processed content  
- Required styles  
- Correct bidirectional rendering  

Simply paste the generated code where the text should appear.

## Support The Project

If this project helps you, you can support its development with TON Coin:

UQDZ73HIw043fVFpqc8mgGPilzgfHb9Uqypxn7nEKqeRu5Gz

## Developer

**Mehrdad Jeyrani Kamali**

- Telegram: @mehrdadjk  
- Email: mehrware@gmail.com

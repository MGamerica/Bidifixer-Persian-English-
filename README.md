# Persian BidiFixer

A lightweight JavaScript tool for fixing mixed Persian-English text rendering issues in HTML.

---

## Introduction

When Persian and English text are mixed in the same content, browsers often display it incorrectly due to bidirectional (RTL/LTR) rendering behavior.

Persian BidiFixer solves this problem by automatically detecting language segments and applying correct directional handling to each part of the text. This ensures that mixed-language content is displayed visually correctly without breaking structure or layout.

---

## Problem Example

Before and After comparisons are included in the GitHub README images:
- Before: incorrect mixed RTL/LTR rendering
- After: corrected rendering using BidiFixer

---

## Features

- Automatic Persian, English, and number detection
- Correct RTL/LTR rendering per segment
- Preserves structure of mixed-language text
- Lightweight and dependency-free
- Fully client-side (no server required)
- Works with static and dynamic HTML content

---

# How To Use

This project provides two separate usage modes:

---

# 1. Tool Mode (Copy & Paste Output)

Steps:
1. Paste mixed Persian-English text into the tool
2. It automatically processes the text
3. Click Copy Code
4. Paste generated HTML into your website

Best for:
- Quick fixes
- Static content
- No-code usage

---

# 2. Library Mode (JavaScript Integration)

Option A: Local file
<script src="./Bidifixer.js"></script>
BidiFixer.scan();

Option B: GitHub raw
<script src="https://raw.githubusercontent.com/MGamerica/Bidifixer-Persian-English-/main/Tool/Bidifixer.js"></script>
BidiFixer.observe();

---

## API

BidiFixer.scan() -> scan full page
BidiFixer.observe() -> live DOM observer
BidiFixer.fix(node) -> fix specific element

---

## Important Notes

Best for Persian-English mixed content, technical text, and UI rendering issues.

---

## Support

TON Wallet:
UQDZ73HIw043fVFpqc8mgGPilzgfHb9Uqypxn7nEKqeRu5Gz

---

## Developer

Mehrdad Jeyrani Kamali
Telegram: @mehrdadjk
Email: mehrware@gmail.com

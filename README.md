# coronavirus-project

Scrape Google Sheet data using Nodejs+Request+Cheerio.

## Introduction

This project scrapes following public Google Sheet, provided by JHU CSSE:
https://docs.google.com/spreadsheets/d/1wQVypefm946ch4XDp37uZ-wartW4V7ILdg-qYiDXUHM/htmlview

It contains data on coronavirus (nVoC), and how much it has spread in each country/province.
For a small sample, see `sample_data.json`. The actual output .json file contains over 200kB of data.

This is one of my first scraping attempts ever. I may add more features in the future.

## Install

`npm install`

## Usage

`node app.js`

Creates new file `coronavirus_data_<timestamp>.json` (over 200kB)
Might output some relevant information to console.

The source data is updated frequently, and sometimes the format is not consistent, hence requiring update on this project.

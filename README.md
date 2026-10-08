from pathlib import Path

readme = r'''# A/B Testing: Which Visualization Is Better?

## Introduction

I wanted to learn how **A/B testing actually works**, so I decided to build a small A/B experiment from scratch.

The project started with a simple question:

> **Which visualization is better for presenting sales data—a line chart or a bar chart?**

Instead of choosing based on my own preference, I decided to build an experiment, collect responses, and use the data to see what happened.

## A Note About This Repository

This repository is simply my way of **getting my feet into A/B testing**.

I am not trying to make this a long and complicated A/B testing project. There are many things that can be considered in a more advanced experiment, but I wanted to keep this project simple so I could build it, run it, and understand the basic workflow from beginning to end.

**Having said that, here are the simple steps this repository covers:**

---

## Step 1: Define the Problem

I have been hesitant about which chart is best for presenting the last quarters of sales data: a **line chart or a bar chart**.

How can I find out which one is better?

Instead of choosing based on my own preference, I decided to use an **A/B test**.

For this experiment:

- **Control (A):** Bar chart
- **Treatment (B):** Line chart

Everything else remains the same.

---

## Step 2: Define the Hypothesis

### Null hypothesis (H₀)

There is **no difference** between the bar chart and line chart in participants' ability to identify the correct answer.

### Alternative hypothesis (H₁)

There **is a difference** between the bar chart and line chart in participants' ability to identify the correct answer.

---

## Step 3: Decide How to Measure the Difference

I need a metric that allows me to compare the two groups.

For this experiment, the metric is:

> **Did the participant pick the correct answer?**

The participant sees the same sales data and is asked:

> **Which month has the highest sales?**

The possible answers are:

- June
- July
- August
- September

The correct answer is:

**September**

---

## Step 4: Design the Data Collection Method

After I figured out what question I wanted to answer and how I would measure it, I needed to design the data collection method.

I started by creating a **Google Sheet** with these columns:

| Timestamp | Participant ID | Group | Chart | Answer | Correct | Event |
| --------- | -------------- | ----- | ----- | ------ | ------- | ----- |

Then I created an **Apps Script** connected to the Google Sheet. I edited the Apps Script, pasted the code, and deployed it.

The Apps Script code is included in this repository.

The Apps Script receives the experiment data and adds it to the `Responses` sheet. It also prevents duplicate **response** submissions from the same Participant ID while allowing multiple `page_view` events.

The Apps Script code is:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Responses");

  if (!e || !e.postData || !e.postData.contents) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "No POST data received."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let data;

  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid JSON."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const eventType = data.event || "";

  // Only prevent duplicate RESPONSE submissions.
  // Page views are allowed to occur multiple times.
  if (eventType === "response") {
    const lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      const values = sheet
        .getRange(2, 1, lastRow - 1, 7)
        .getValues();

      const duplicateResponse = values.some(row =>
        row[1] === data.participant_id &&
        row[6] === "response"
      );

      if (duplicateResponse) {
        return ContentService
          .createTextOutput(JSON.stringify({
            status: "duplicate"
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
  }

  sheet.appendRow([
    new Date(),
    data.participant_id || "",
    data.group || "",
    data.chart || "",
    data.answer || "",
    data.correct === true ? true :
      data.correct === false ? false : "",
    eventType
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      event: eventType
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Next, I created the **HTML file**, which is available as `index.html`.

The HTML file automatically randomizes participants between the control and treatment groups, so there is no need to manually assign participants.

The randomization is approximately 50/50:

```javascript
group = Math.random() < 0.5 ? "A" : "B";
```

A unique participant ID is generated with:

```javascript
crypto.randomUUID()
```

The participant ID and group assignment are stored in `localStorage` so that refreshing the page does not randomly reassign the same participant.

The basic flow is:

**Participant → HTML experiment → Random assignment → Bar or Line chart → Answer → Apps Script → Google Sheet**

---

## Step 5: Test the Experiment

Before collecting responses, I tested the experiment to make sure:

- The page loaded correctly.
- Participants were randomly assigned.
- The correct chart appeared.
- Participants could answer the question.
- The response was recorded.
- The data reached the Google Sheet.

Once the system worked, I was ready to collect responses.

---

## Step 6: Collect Participants

After building and testing the experiment, I needed to decide where to find participants.

I decided to start with online communities, including:

- Reddit
- Facebook groups

I kept the recruitment post short because I did not want to explain the A/B testing setup before participants completed the experiment.

### Recruitment Post

**Quick data visualization challenge — 5 seconds**

Can you identify the month with the highest sales from a chart?

**It takes about 5 seconds.**

Try it here:

https://adnan-mayof.github.io/reddit-ab-test/

Thanks for participating!

---

## Step 7: Collect the Results

After sharing the experiment, I collected **11 completed responses**.

| Group     | Chart | Participants | Correct | Accuracy |
| --------- | ----- | ------------ | ------- | -------- |
| A         | Bar   | 4            | 4       | 100%     |
| B         | Line  | 7            | 7       | 100%     |
| **Total** | —     | **11**       | **11**  | **100%** |

All 11 participants selected **September**, which was the correct answer.

---

## Step 8: Compare the Results

The results show:

- **Bar chart:** 4/4 correct = **100%**
- **Line chart:** 7/7 correct = **100%**
- **Observed difference:** **0 percentage points**

Both groups performed equally well in this experiment.

---

## Step 9: Conclusion

Based on the data collected, **neither the bar chart nor the line chart performed better**.

Both visualizations produced a **100% accuracy rate**.

Therefore:

> **In this experiment, the bar chart and line chart performed equally well in helping participants identify the month with the highest sales.**

The purpose of this project was not to prove that one visualization is universally better than the other.

It was to **get my feet into A/B testing**, build a simple experiment, collect real responses, compare the results, and let the data show what happened.

There are many other things that could be considered in a more advanced A/B test, but I intentionally kept this project simple rather than making it long and complicated.

---

## How to Recreate This Project

If you want to recreate this experiment from scratch, you can use the following prompts with an AI coding assistant.

### 1. Prompt to Create the Google Apps Script

Use this prompt to generate the Apps Script that receives the experiment data and stores it in Google Sheets:

```text
Create a Google Apps Script Web App for a simple A/B testing experiment.

The experiment has a Google Sheet with a sheet/tab named:

Responses

The first row contains these columns:

Timestamp | Participant ID | Group | Chart | Answer | Correct | Event

The HTML experiment will send JSON data using POST requests.

The Apps Script must:

1. Receive POST requests through doPost(e).
2. Parse the JSON request body.
3. Add each event as a new row in the Responses sheet.
4. Store:
   - Timestamp
   - Participant ID
   - Group
   - Chart
   - Answer
   - Correct
   - Event
5. Automatically use the current server timestamp for the Timestamp column.
6. Allow multiple page_view events from the same participant.
7. Prevent duplicate response submissions from the same Participant ID.
8. Only apply duplicate checking when Event = "response".
9. Return JSON indicating whether the request was successful or was a duplicate.
10. Handle missing POST data and invalid JSON gracefully.

The duplicate check should compare:

Participant ID + Event = "response"

Do not block page_view events.

Return the complete Google Apps Script code in one block so I can copy and paste it directly into Google Apps Script.
```

### 2. Prompt to Create the HTML Experiment

Use this prompt to create the `index.html` file:

```text
Create a single self-contained HTML file named index.html for a simple A/B testing experiment.

The experiment tests whether a bar chart or line chart is better at helping participants identify the month with the highest sales.

SALES DATA

June: 469
July: 455
August: 461
September: 478

The correct answer is September.

QUESTION

Display:

"Which month has the highest sales?"

Answer choices:

- June
- July
- August
- September

The participant selects one answer and clicks Submit.

A/B RANDOMIZATION IS REQUIRED

Each new participant must automatically be randomly assigned approximately 50/50 to one of two groups.

Use:

group = Math.random() < 0.5 ? "A" : "B";

Group A:
- Control
- Bar chart

Group B:
- Treatment
- Line chart

Do not tell the participant that there are two versions.
Do not tell the participant which group they were assigned to.

Generate a unique participant ID using:

crypto.randomUUID()

Store the participant ID and group assignment in localStorage.

Use these localStorage keys:

participant_id
ab_group

If the participant already has a participant ID and group assignment in localStorage, reuse them instead of creating a new assignment.

This prevents refreshing the page from randomly reassigning the participant.

CHART

Use Chart.js from the CDN.

Both groups must receive exactly the same sales data.

Group A must display a bar chart.

Group B must display a line chart.

Everything else must remain identical between groups.

Hide the chart legend.

Make the chart responsive.

PAGE DESIGN

Keep the page simple.

Use:

- Arial or another simple sans-serif font
- Maximum content width around 800px
- Chart area around 420px high
- Radio-button answer choices
- Submit button

Do not explain the A/B test to participants.

DATA COLLECTION

Send experiment data to this Google Apps Script Web App endpoint:

https://script.google.com/macros/s/AKfycbzRWgR9hjixkM5sXo78V2aH_k2dv3wF7ItJZM1Im9Q2h5CcwjEIB0WdlOu3TVYBj2kWhQ/exec

Use:

method: "POST"
mode: "no-cors"

Send JSON.

PAGE VIEW

When the experiment loads, send:

event: "page_view"
participant_id
group
chart
answer: ""
correct: ""
timestamp

RESPONSE

When the participant submits, send:

event: "response"
participant_id
group
chart
answer
correct
timestamp

The correct value must be:

answer === "September"

SUBMISSION PROTECTION

A participant can submit only once.

After Submit:

- Prevent double-clicks.
- Disable the Submit button.
- Change the button text to "Submitted".
- Disable the answer choices.
- Send the response.
- Show:

"Thank you!"

"Your response was recorded."

If no answer is selected, show:

"Please select an answer."

Do not submit an empty response.

IMPORTANT

The final HTML must:

1. Randomly assign new participants to A or B.
2. Use approximately 50/50 randomization.
3. Persist the assignment in localStorage.
4. Give Group A the bar chart.
5. Give Group B the line chart.
6. Use identical data and question for both groups.
7. Generate a unique participant ID.
8. Record page_view events.
9. Record response events.
10. Determine correctness using September.
11. Prevent duplicate submissions during the session.
12. Be ready to save directly as index.html.

Return only the complete HTML code.
```

### 3. Prompt to Put the HTML on GitHub and Make It Live

After the HTML has been created and saved as `index.html`, use this prompt if you want step-by-step instructions for publishing it:

```text
I have an HTML file named index.html for my A/B testing experiment.

I want to publish it on GitHub and make it live using GitHub Pages.

My GitHub repository is:

adnan-mayof/reddit-ab-test

Give me simple step-by-step instructions to:

1. Open my GitHub repository.
2. Add the index.html file to the root of the repository.
3. Commit the file.
4. Open the repository Settings.
5. Go to Pages.
6. Configure GitHub Pages to deploy from the main branch.
7. Select the root folder / (root).
8. Save the GitHub Pages settings.
9. Wait for the deployment to finish.
10. Find the live website URL.
11. Test the live experiment.

The final live URL should be:

https://adnan-mayof.github.io/reddit-ab-test/

Also explain how to update the live experiment later by replacing index.html and committing the changes.

Keep the instructions simple and beginner-friendly.
```

### 4. Basic Workflow

The complete process is:

**Step 1:** Create Google Sheet  
↓  
**Step 2:** Create Apps Script  
↓  
**Step 3:** Deploy Apps Script as a Web App  
↓  
**Step 4:** Copy the Apps Script Web App URL  
↓  
**Step 5:** Create `index.html`  
↓  
**Step 6:** Put the Apps Script URL into `index.html`  
↓  
**Step 7:** Test the HTML  
↓  
**Step 8:** Create/open the GitHub repository  
↓  
**Step 9:** Add `index.html` to the repository root  
↓  
**Step 10:** Commit the file  
↓  
**Step 11:** Enable GitHub Pages  
↓  
**Step 12:** Open the live experiment

### 5. Final Experiment Flow

Once everything is connected, the experiment works like this:

**Participant**

↓

**GitHub Pages**

↓

**index.html**

↓

**Random assignment**

**A ≈ 50% → Bar chart**

**B ≈ 50% → Line chart**

↓

**Participant answers**

↓

**HTML sends response**

↓

**Google Apps Script**

↓

**Google Sheet**

↓

**Results can be compared between Group A and Group B**
'''
Path("/mnt/data/README.md").write_text(readme, encoding="utf-8")
print("Updated /mnt/data/README.md")

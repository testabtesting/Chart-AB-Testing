# Chart-AB-Testing

## A/B Testing: Which Visualization Is Better?

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
|---|---|---|---|---|---|---|

Then I created an **Apps Script** connected to the Google Sheet. I edited the Apps Script, pasted the code, and deployed it.

The Apps Script code is included in this repository.

Next, I created the **HTML file**, which is available as `index.html`.

The HTML file automatically randomizes participants between the control and treatment groups, so there is no need to manually assign participants.

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

| Group | Chart | Participants | Correct | Accuracy |
|---|---|---:|---:|---:|
| A | Bar | 4 | 4 | 100% |
| B | Line | 7 | 7 | 100% |
| **Total** | — | **11** | **11** | **100%** |

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

The exact expected solution is:

> **“Participants are expected to develop a comprehensive platform that includes:”**

### 1. Smart Scheme Recommender

> **“An AI/rule-based engine that takes basic user inputs (project type, estimated cost, income level, education status) and automatically recommends the most suitable credit or educational loan scheme.”**

So your platform must take at least these kinds of inputs:

- Project type
- Estimated project cost
- Family income level
- Education status / whether the requirement is educational
- Other basic eligibility information as needed

Then it must automatically determine which available scheme fits the user best.

The system should be able to differentiate between schemes such as:

- Micro Finance Scheme
- Term Loan Scheme
- Educational Loan Scheme

The output should essentially answer:

> **“Which scheme is most suitable for this applicant?”**

This can be implemented using **AI, rules, or a hybrid AI + rule-based approach**.

---

### 2. Financial Calculator

> **“A dynamic tool to calculate projected EMIs, accounting for specific scheme guidelines like maximum loan limits, interest rates (e.g., 6.5% to 15% depending on the scheme), and moratorium periods (3 to 12 months).”**

This means the Government expects a calculator that is connected to the actual scheme rules.

It should consider things such as:

- Maximum loan allowed under the scheme
- Amount the user is eligible to receive
- Interest rate applicable to that scheme
- Repayment duration
- Moratorium period
- Project cost
- Financing percentage
- Projected EMI

So the output should answer:

> **“If I take this recommended loan, how much will I receive and approximately how much will I repay?”**

It should not be just a generic EMI calculator. It needs to be **scheme-aware**.

---

### 3. Geo-Spatial Partner Locator & Router

> **“Integration of a mapping service to identify the nearest eligible Channel Partner (SCA/Bank/NBFC-MFI) based on the user's location and the partner's current fund utilization eligibility (ensuring applications aren't sent to partners with high NPAs or overdues).”**

This is the third major compulsory component.

Your platform must know the user's location and identify a suitable authorized Channel Partner such as:

- SCA — State Channelizing Agency
- PSB — Public Sector Bank
- RRB — Regional Rural Bank
- NBFC-MFI — NBFC / Microfinance Institution

The important part is that the system must not simply show:

> “Here are the nearest banks.”

It is expected to identify the **nearest eligible Channel Partner**.

That means the routing decision should consider things such as:

- User's location
- Whether that partner handles the required loan/scheme category
- Whether that partner is currently eligible for further fund utilization
- Whether it has problematic NPA levels
- Whether it has excessive overdues

So the output should answer:

> **“Which authorized institution should this applicant approach for this particular scheme?”**

---

# So the Government is essentially asking you to build this

```
USER
 │
 │ gives basic details
 ▼
SMART SCHEME RECOMMENDER
 │
 │ determines suitable scheme
 ▼
FINANCIAL CALCULATOR
 │
 │ explains loan + EMI + interest + moratorium
 ▼
CHANNEL PARTNER ROUTER
 │
 │ checks location + partner eligibility
 ▼
RECOMMENDED AUTHORIZED PARTNER
```

Or even simpler:

# INPUT → MATCH → CALCULATE → ROUTE

That is the core requested system.

---

## What should the complete application do?

A citizen should ideally be able to open your platform and go through this journey:

**Step 1:** Select their language.

**Step 2:** Enter basic details about themselves and their requirement.

For example:

> Project: Tailoring shop  
> Project cost: ₹1.2 lakh  
> Family income: ₹3 lakh  
> Purpose: Business

**Step 3:** The system checks the available financial products.

**Step 4:** It recommends the most suitable scheme.

For example:

> **Recommended: Micro Finance Scheme**

**Step 5:** It calculates the financial implications.

For example:

> Eligible loan amount  
> Applicable interest rate  
> Moratorium period  
> Projected EMI

**Step 6:** It checks the user's location.

**Step 7:** It checks nearby authorized Channel Partners.

**Step 8:** It filters out unsuitable partners based on eligibility/fund-utilization/NPA/overdue conditions.

**Step 9:** It recommends the appropriate Channel Partner and shows it on a map.

That is the application they are asking you to create.

---

# There is another explicit requirement in the challenge description

The Government says the challenge is to develop:

> **“an intelligent, multi-lingual digital platform or mobile application that bridges the gap between the beneficiaries and the channelizing agencies.”**

This sentence is important.

So your final product should be:

### Intelligent

Because it automatically determines the right scheme and routing.

### Multilingual

Because beneficiaries should be able to use it in multiple languages.

### Digital platform or mobile application

It should be an actual usable software product, not only an ML model or research paper.

### Bridge between beneficiaries and Channel Partners

Its purpose is to connect the citizen to the correct financing mechanism and institution.

---

# What problem must your solution specifically remove?

The Government explicitly identifies these issues:

> Citizens lack awareness of which credit scheme fits their needs.

Your **Scheme Recommender** solves this.

> Applicants face difficulties identifying and locating the nearest authorized Channel Partner.

Your **Partner Locator** solves this.

> Applications are misrouted.

Your **Eligibility + Routing Engine** solves this.

> This fragmentation causes offline confusion.

Your **single digital platform** solves this.

> This results in delays in disbursement.

Correct matching and routing should reduce those delays.

---

# The two outcomes the Government expects

They explicitly give two impact goals.

### 1. Financial literacy

> **“Enhance financial literacy among the target demographic regarding concessional lending.”**

Therefore, users should be able to understand things like:

- loan amount
- interest rate
- EMI
- repayment
- moratorium
- appropriate scheme

### 2. Better transparency and efficiency

> **“Improve transparency and efficiency in the channel finance ecosystem, ensuring faster disbursements and better fund utilization.”**

Therefore, your system should help ensure:

- correct scheme selection
- correct Channel Partner selection
- fewer wrongly routed applications
- better use of available funds
- faster processing

---

# What is explicitly mandatory vs what is NOT explicitly demanded

This distinction matters a lot for SIH.

|Feature|Explicitly requested?|
|---|---|
|AI/rule-based scheme recommender|✅ Yes|
|Project type input|✅ Yes|
|Estimated cost input|✅ Yes|
|Income input|✅ Yes|
|Education status input|✅ Yes|
|Financial/EMI calculator|✅ Yes|
|Maximum loan limit consideration|✅ Yes|
|Scheme-specific interest rates|✅ Yes|
|Moratorium calculation|✅ Yes|
|Mapping/location integration|✅ Yes|
|Nearest eligible Channel Partner|✅ Yes|
|SCA/Bank/NBFC-MFI support|✅ Yes|
|Partner fund-utilization eligibility|✅ Yes|
|NPA/overdue consideration|✅ Yes|
|Multilingual interface|✅ Yes|
|Mobile app or digital platform|✅ Yes|
|Voice assistant|❌ Not explicitly required|
|Document upload/checker|❌ Not explicitly required|
|OCR|❌ Not explicitly required|
|RAG chatbot|❌ Not explicitly required|
|Government dashboard|❌ Not explicitly required|
|Loan approval system|❌ Not explicitly required|
|Automatic loan sanction|❌ Not required|
|Application tracking|❌ Not explicitly required|
|Aadhaar integration|❌ Not explicitly required|
|DigiLocker integration|❌ Not explicitly required|
|AI-generated project report|❌ Not explicitly required|

Those extra features can be innovations later, but **they are not the core PS requirement**.

---

# Your Minimum Complete SIH26092 Solution

If I were converting the Government statement into a technical requirement document, I would define the MVP as:

### MODULE A — Beneficiary Interface

Collect:

- language
- project/business type
- project cost
- annual family income
- educational requirement/status
- location
- required additional eligibility details

### MODULE B — Scheme Database

Store:

- scheme name
- scheme type
- income eligibility
- maximum loan
- financing percentage
- interest rate
- moratorium
- repayment rules
- other eligibility conditions

### MODULE C — Scheme Matching Engine

Input:

> User profile

Output:

> Most suitable scheme

### MODULE D — Financial Calculator

Input:

> Scheme + project/loan amount

Output:

> Eligible amount + rate + moratorium + projected EMI

### MODULE E — Channel Partner Database

Store:

- Channel Partner name
- type
- location
- schemes/categories handled
- fund utilization eligibility
- NPA/overdue status
- active/inactive status

### MODULE F — Geo-Spatial Routing Engine

Input:

> User location + selected scheme

Output:

> Nearest suitable and eligible Channel Partner

### MODULE G — Multilingual UI

Present the entire flow in a citizen-friendly language.

That is a very literal implementation of what the Government is asking for.

---

# The Government's expected final output can be summarized in one screen

After the user provides their information, your platform should ideally be able to say something like:

> **Recommended Scheme:** Micro Finance Scheme  
> **Eligible Financing:** ₹1,20,000  
> **Interest Rate:** 6.5% p.a.  
> **Moratorium:** 6 months  
> **Projected EMI:** ₹XXXX/month  
> **Recommended Channel Partner:** XYZ SCA  
> **Distance:** 4.6 km  
> **Partner Eligibility:** Active / Eligible  
> **Directions:** View on Map

If your application can accurately produce that result from simple user inputs, **you have built exactly the core solution described in SIH26092**.

Everything Summarized is in [[SIH/Master Solution Statement]].

# **404FOUND**

> A smart lost & found platform designed to make reporting, discovering, matching, and resolving lost items simpler.

404FOUND is a web-based lost and found application built around a simple idea:

**What if finding something you lost didn't depend on scrolling through messages, asking around, or hoping someone noticed your post?**

The platform provides a structured way to report lost and found items, discover possible matches, submit ownership claims, and track the process of returning and resolving an item.

---

## **Overview**

404FOUND brings the lost-and-found process into one centralized interface.

Users can:

- Report something they have lost
- Report something they have found
- Browse active reports
- Filter reports by type and status
- Discover potential matches
- View match confidence scores
- Submit ownership claims for found items
- Review submitted claims
- Confirm handovers
- Close resolved reports
- Track live report statistics

The current version is a **frontend/local prototype**, with report data stored locally in the browser.

---

## **Why 404FOUND?**

Traditional lost-and-found systems often rely on:

- WhatsApp groups
- Notice boards
- Word of mouth
- Scattered social media posts
- Manually checking whether something has been found

404FOUND explores a more structured approach.

Instead of simply listing items, the application compares information provided in lost and found reports to surface **potential matches**.

The idea is simple:

> **Report → Match → Claim → Review → Reconnect**

---

# **Features**

### **01 — Lost & Found Reporting**

Users can create a report by specifying:

- Lost or found status
- Item name
- Category
- Description
- Location
- Date
- Contact information
- Optional image selection

The reporting interface encourages detailed descriptions because richer information can improve the possibility of finding a relevant match.

---

### **02 — Smart Match Detection**

404FOUND includes a lightweight matching system that compares reports of opposite types.

For example:

**LOST**

`Black Casio Calculator`  
`PES RR Campus Library`  
`Oct 01`

↓

**Potential Match**

↓

**FOUND**

`Black Scientific Calculator`  
`PES RR Campus`  
`Oct 02`

↓

**87% Match Confidence**

The matching system considers:

| Factor | Weight |
|---|---:|
| Category | **30%** |
| Item Name | **25%** |
| Description | **25%** |
| Location | **12%** |
| Date | **8%** |

The individual scores are combined to produce a match confidence score.

Potential matches are surfaced when the calculated score crosses the configured matching threshold.

This makes the matching mechanism more than a simple keyword search — it combines multiple attributes of a report into a single confidence score.

---

### **03 — Live Report Statistics**

The dashboard dynamically tracks:

- **Total Reports**
- **Open Lost Reports**
- **Open Found Reports**
- **Resolved Reports**

The statistics update as reports are created or resolved.

Animated counters and visual indicators provide feedback as the statistics section enters the viewport.

---

### **04 — Report Filtering**

The live report board allows users to filter reports by:

- **All**
- **Lost**
- **Found**
- **Resolved**

This makes it easier to navigate a growing collection of reports without manually scanning every entry.

---

### **05 — Claim an Item**

Found items can be claimed through a structured ownership flow.

A claimant provides:

- Name
- Contact email
- Ownership detail

The ownership detail is intended to contain information that only the genuine owner would reasonably know.

For example:

> An engraving, identifying mark, sticker, scratch, or other private detail that was not included in the public report.

The claim is then stored with a **pending** status for review.

---

### **06 — Finder Review**

The project includes a finder-side review workflow.

A finder can:

- View submitted claims
- Review ownership information
- Approve a claim
- Reject a claim
- Confirm that the item was returned
- Close the report

Once the handover is confirmed, the report moves into a resolved state.

> **Note:** Finder review is currently implemented as a local demonstration flow and is not protected by real authentication or role-based access control.

---

### **07 — Resolution Tracking**

When an approved claim is successfully handed over:

**Pending Claim**

↓

**Approved**

↓

**Item Returned**

↓

**Report Resolved**

The resolved report is moved out of active lost/found results and appears under the **Resolved** filter.

The resolved count is also reflected in the statistics section.

---

### **08 — Local Data Persistence**

The current prototype uses browser `localStorage` to persist reports.

This means:

- Reports remain available after refreshing the page
- New reports can be created
- Claims can be stored locally
- Resolution changes persist in the browser

**Current Architecture**

`User → HTML Interface → JavaScript Logic → localStorage → Browser`

No external database is currently required.

---

# **Tech Stack**

### **Frontend**

- **HTML5** — structure and semantic page layout
- **CSS3** — responsive styling, layout, animations and visual design
- **JavaScript (ES6+)** — application logic, state management, matching algorithm and interactions

### **Browser APIs**

- `localStorage` — local report persistence
- `IntersectionObserver` — scroll-based animations and statistics activation
- `requestAnimationFrame` — animated counters and scroll progress
- `dialog` — claim and review interfaces
- `FormData` — form data handling
- `crypto.randomUUID()` — unique claim identifiers

### **Deployment**

**Vercel**

### **Version Control**

**Git · GitHub**

---

# **Project Architecture**


404FOUND


### **Core Files**

| File               | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `index.html`       | Main application structure and interface                            |
| `style.css`        | Core visual design and responsive styling                           |
| `enhancements.css` | UI enhancements, animations and claim-flow styling                  |
| `script.js`        | Report management, matching logic and local persistence             |
| `enhancements.js`  | Statistics animation, reveal effects and claim/review functionality |
| `vercel.json`      | Static Vercel deployment configuration                              |
| `sahanaa.jpg`      | Developer profile image used in the project                         |

---

# **How the Application Works**

### **Step 1 — Report**

A user selects whether they:

**LOST something**

or

**FOUND something**

They then provide the relevant item information.

---

### **Step 2 — Store**

The report is added to the application's local report collection and persisted in the browser.

---

### **Step 3 — Compare**

404FOUND compares the new report against reports of the opposite type.

**Lost Item ↔ Found Items**

**Found Item ↔ Lost Items**

Resolved reports are excluded from active matching.

---

### **Step 4 — Calculate Match Score**

The application compares multiple properties and calculates a score.

| Attribute   | Contribution |
| ----------- | -----------: |
| Category    |          30% |
| Item Name   |          25% |
| Description |          25% |
| Location    |          12% |
| Date        |           8% |
| **Total**   |     **100%** |

Potential matches are then ranked according to their calculated score.

---

### **Step 5 — Claim**

If a found item appears to belong to a user, they can submit a claim with an ownership detail.

---

### **Step 6 — Review**

The finder can review the submitted claim through the review interface.

---

### **Step 7 — Reconnect**

After the claim is approved and the handover is confirmed, the report is marked as resolved.

**REPORT → MATCH → CLAIM → REVIEW → HANDOVER → RESOLVED**

---

# **UI & Design**

404FOUND uses a dark, minimal interface with a high-contrast neon-green visual system.

### **Design Principles**

* Minimal interface
* Strong typography
* High contrast
* Clear information hierarchy
* Card-based report layout
* Responsive design
* Micro-interactions
* Motion used to communicate state
* Accessibility-conscious interactions

The interface uses **Inter** for primary UI typography and **DM Mono** for labels and technical elements.

### **Visual System**

| Element        | Value     |
| -------------- | --------- |
| Background     | `#08090D` |
| Panels         | `#101218` |
| Primary Text   | `#F4F5F7` |
| Secondary Text | `#969BA8` |
| Accent         | `#B7FF3C` |
| Lost / Alert   | `#FF7180` |

---

# **Interaction & Motion**

The interface includes several interaction details designed to make the application feel responsive.

### **Scroll Progress**

A progress indicator tracks the user's position through the page.

### **Reveal Animations**

Major sections animate into view using `IntersectionObserver`.

### **Animated Statistics**

Report statistics animate when the statistics section becomes visible.

### **Hover States**

Cards and buttons respond to user interaction through subtle movement and border transitions.

### **Reduced Motion Support**

The application respects the user's `prefers-reduced-motion` setting and disables non-essential animations when requested.

---

# **Accessibility Considerations**

The project includes several accessibility-focused implementation details, including:

* Semantic HTML structure
* Accessible labels
* `aria-label` attributes
* `aria-pressed` filter states
* Keyboard-visible focus states
* Dialog-based interaction for claim workflows
* Reduced-motion support
* Screen-reader-friendly statistic labels

The project is still a prototype, so further accessibility testing and refinement would be part of future development.

---

# **Current Limitations**

404FOUND is currently a **frontend/local prototype**, so several production-level capabilities are intentionally not implemented yet.

* No real backend
* No cloud database
* No real user authentication
* No persistent multi-user data
* Finder review is currently a simulated/demo role
* Local reports are stored only in the browser
* Selected image files are handled through the browser interface rather than uploaded to a backend
* Match scoring is a lightweight heuristic rather than a machine-learning model
* No real-time notifications
* No production-grade ownership verification

These limitations provide clear directions for future development.

---

# **Future Scope**

### **Authentication**

Introduce secure user accounts with:

* Sign up
* Login
* Logout
* Password protection
* User profiles
* Role-based access

### **Backend & Database**

Move report storage from browser `localStorage` to a centralized database.

**Possible architecture:**

`Frontend → REST API → Backend → Database`

This would allow multiple users to access the same reports.

### **Image Storage**

Enable actual image uploads and storage so users can attach photographs of lost or found objects.

### **Improved Matching**

The current weighted similarity system could be extended using:

* NLP-based similarity
* Embeddings
* Image similarity
* Location proximity
* Time-based relevance
* Category classification

### **Verification**

Introduce safer ownership verification through:

* Private verification questions
* Claim evidence
* Verified campus accounts
* Staff moderation
* Secure handover workflows

### **Notifications**

Users could receive notifications when:

* A potential match is found
* Someone submits a claim
* A claim is approved
* A handover is confirmed
* A report is resolved

### **Campus Integration**

A future version could be adapted for universities and communities with:

* Campus authentication
* Building/location mapping
* Help-desk integration
* Admin dashboards
* Moderation tools
* Campus-wide notifications

---

# **Local Development**

### **1. Clone the Repository**

```bash
git clone https://github.com/RSahanaa/404found.git
```

### **2. Enter the Project**

```bash
cd 404found
```

### **3. Run Locally**

Because the current project is a static HTML/CSS/JavaScript application, it can be served using any local static server.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

# **Deployment**

The project is deployed using **Vercel**.

The current Vercel configuration treats the project as a static site and serves the project directory directly.

---

# **Project Status**

**Active Development**

404FOUND is still being improved and experimented with.

The current version focuses on establishing the core experience:

> **REPORT → MATCH → CLAIM → REVIEW → RECONNECT**

Future iterations will focus on turning the current browser-based prototype into a fully connected multi-user application.

---

# **Screenshots**

Screenshots will be added as the interface continues to evolve.

Suggested project showcase:

1. Landing page
2. Report form
3. Live report board
4. Match confidence interface
5. Claim workflow
6. Finder review workflow
7. Resolved reports
8. Responsive mobile interface

---

# **About the Developer**

### **R Sahanaa**

**B.Tech ECE @ PES University**

I'm an ECE student exploring technology, electronics, and software while building projects that combine problem-solving with creativity.

I'm interested in software development, web development, electronics, design, and building things that people can actually interact with.

404FOUND is one of those projects — starting from an idea in my head and gradually turning it into a functional web application.

### **Connect**

* **GitHub:** [https://github.com/RSahanaa](https://github.com/RSahanaa)
* **LinkedIn:** [https://www.linkedin.com/in/sahanaa-raghavan-920012357](https://www.linkedin.com/in/sahanaa-raghavan-920012357)

---

# **Acknowledgement**

404FOUND was built as an independent project to explore:

* Frontend development
* JavaScript application logic
* Client-side state management
* Data persistence
* Matching algorithms
* UI/UX design
* Interactive web experiences
* Deployment with Vercel

---

## **Built With**

**HTML · CSS · JavaScript · Git · GitHub · Vercel**

---

<p align="center">
  <strong>404FOUND.</strong><br>
  Lost doesn't have to mean gone.
</p>
```



const startingReports = [
    {
        type: "lost",
        name: "Black Casio Calculator",
        category: "Electronics",
        description: "Black scientific calculator with a small scratch near the display.",
        location: "PES RR Campus Library",
        date: "Oct 01",
        contact: "aarav@example.com"
    },
    {
        type: "found",
        name: "Black Scientific Calculator",
        category: "Electronics",
        description: "Black calculator found near the library with a scratch on the screen.",
        location: "PES RR Campus",
        date: "Oct 02",
        contact: "finder@example.com"
    },
    {
        type: "lost",
        name: "Blue Water Bottle",
        category: "Other",
        description: "Dark blue bottle with a white sticker and a small dent near the bottom.",
        location: "Food Court",
        date: "Oct 01",
        contact: "diya@example.com"
    },
    {
        type: "found",
        name: "Black Bike Keychain",
        category: "Keys",
        description: "Black keychain with two bike keys and a small metal ring.",
        location: "Block 4 Parking",
        date: "Oct 02",
        contact: "finder2@example.com"
    },
    {
        type: "lost",
        name: "College ID Card",
        category: "Documents / ID",
        description: "PES student ID card attached to a blue lanyard.",
        location: "Academic Block",
        date: "Sep 30",
        contact: "meera@example.com"
    },
    {
        type: "found",
        name: "Wireless Earbuds Case",
        category: "Electronics",
        description: "White earbuds charging case found near the canteen entrance.",
        location: "Canteen",
        date: "Oct 02",
        contact: "finder3@example.com"
    },
    {
        type: "lost",
        name: "Silver Bracelet",
        category: "Accessories",
        description: "Thin silver bracelet with a small heart-shaped charm.",
        location: "Auditorium",
        date: "Oct 01",
        contact: "nisha@example.com"
    },
    {
        type: "found",
        name: "Black Wallet",
        category: "Wallet / Money",
        description: "Small black wallet found near the main entrance. Contains no visible ID.",
        location: "Main Gate",
        date: "Oct 01",
        contact: "finder4@example.com"
    },
    {
        type: "lost",
        name: "Blue USB Drive",
        category: "Electronics",
        description: "Small blue 32GB USB drive with a silver cap.",
        location: "ECE Lab",
        date: "Sep 29",
        contact: "rohan@example.com"
    },
    {
        type: "found",
        name: "Grey Hoodie",
        category: "Clothing",
        description: "Grey oversized hoodie left on a chair after an event.",
        location: "Student Activity Centre",
        date: "Sep 28",
        contact: "finder5@example.com"
    },
    {
        type: "lost",
        name: "Mechanical Pencil",
        category: "Other",
        description: "Matte black mechanical pencil with a blue grip.",
        location: "Room 204",
        date: "Oct 02",
        contact: "ananya@example.com"
    },
    {
        type: "found",
        name: "House Keys",
        category: "Keys",
        description: "Three silver keys on a red circular keychain.",
        location: "Basketball Court",
        date: "Sep 29",
        contact: "finder6@example.com"
    }
];

let reports;
try { reports = JSON.parse(localStorage.getItem("404found_local_v2")); } catch {}
if (!Array.isArray(reports)) reports = null;

if (!reports) {
    reports = startingReports;
    // Keep the demo usable when browser storage is unavailable.
    try { saveReports(); } catch {}
}


function saveReports() {
    localStorage.setItem("404found_local_v2", JSON.stringify(reports));
}


function originalUpdateStats() {
    document.getElementById("total-count").textContent = reports.length;

    document.getElementById("lost-count").textContent =
        reports.filter(report => report.type === "lost").length;

    document.getElementById("found-count").textContent =
        reports.filter(report => report.type === "found").length;

    document.getElementById("resolved-count").textContent = 0;
}


function cleanText(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return characters[character];
    });
}


function showReports(filter = "all") {
    activeFilter = filter;
    document.querySelectorAll('.filter').forEach(button => {
        button.classList.toggle('active', button.dataset.filter === filter);
        button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    });

    const container = document.getElementById("report-cards");

    const visibleReports =
        filter === "all"
            ? reports
            : reports.filter(report => filter === "resolved" ? report.status === "resolved" : report.type === filter && report.status !== "resolved");

    if (visibleReports.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                Nothing here yet.
            </div>
        `;
        return;
    }

    container.innerHTML = visibleReports.map(report => {

        const matches = findMatches(report);

        return `
            <article class="report-card">

                <span class="badge ${report.type}">
                    ${report.status === "resolved" ? "RESOLVED" : report.type.toUpperCase()}
                </span>

                <h3>${cleanText(report.name)}</h3>
                ${report.status === "resolved" ? `<p class="resolution-note">✓ Returned to owner · ${cleanText(new Date(report.closedAt).toLocaleDateString())}</p>` : ""}

                <p>${cleanText(report.description)}</p>

                <div class="card-meta">
                    ${cleanText(report.category)}
                    ·
                    ${cleanText(report.location)}
                    ·
                    ${cleanText(report.date)}
                </div>

                ${
                    matches.length && report.status !== "resolved"
                        ? `<button class="match-button"
                            onclick="showMatches(${reports.indexOf(report)})">
                            ${matches.length} possible match${matches.length > 1 ? "es" : ""}
                           </button>`
                        : ""
                }

                ${report.status !== "resolved" && report.type === "found" ? `<div class="claim-actions"><button class="button primary" onclick="openClaim(${reports.indexOf(report)})">Claim this item ↗</button><button class="review-button" onclick="reviewClaim(${reports.indexOf(report)})">Demo: finder review (${(report.claims || []).filter(c => c.status === "pending" || c.status === "approved").length})</button></div>` : ""}
            </article>
        `;
    }).join("");
}


function getWords(text) {

    return new Set(
        String(text)
            .toLowerCase()
            .match(/[a-z0-9]+/g) || []
    );
}


function textSimilarity(first, second) {

    const firstWords = getWords(first);
    const secondWords = getWords(second);

    if (!firstWords.size || !secondWords.size) {
        return 0;
    }

    let common = 0;

    firstWords.forEach(word => {
        if (secondWords.has(word)) {
            common++;
        }
    });

    const allWords = new Set([
        ...firstWords,
        ...secondWords
    ]);

    return common / allWords.size;
}


function locationSimilarity(first, second) {

    const a = String(first).toLowerCase();
    const b = String(second).toLowerCase();

    if (a === b) {
        return 1;
    }

    const firstWords = getWords(a);
    const secondWords = getWords(b);

    let common = 0;

    firstWords.forEach(word => {
        if (secondWords.has(word)) {
            common++;
        }
    });

    return common / Math.max(firstWords.size, secondWords.size, 1);
}


function dateSimilarity(first, second) {

    const firstDate = new Date(`2026 ${first}`);
    const secondDate = new Date(`2026 ${second}`);

    if (Number.isNaN(firstDate.getTime()) ||
        Number.isNaN(secondDate.getTime())) {
        return 0;
    }

    const difference =
        Math.abs(firstDate - secondDate) /
        (1000 * 60 * 60 * 24);

    if (difference === 0) return 1;
    if (difference <= 1) return 0.9;
    if (difference <= 3) return 0.7;
    if (difference <= 7) return 0.4;

    return 0.1;
}


function getMatchScore(report, other) {

    const category =
        report.category.toLowerCase() ===
        other.category.toLowerCase()
            ? 1
            : 0;

    const name = textSimilarity(
        report.name,
        other.name
    );

    const description = textSimilarity(
        report.description,
        other.description
    );

    const location = locationSimilarity(
        report.location,
        other.location
    );

    const date = dateSimilarity(
        report.date,
        other.date
    );

    return Math.round(
        (
            category * 0.30 +
            name * 0.25 +
            description * 0.25 +
            location * 0.12 +
            date * 0.08
        ) * 100
    );
}


function findMatches(report) {
    if (report.status === "resolved") return [];

    const oppositeType =
        report.type === "lost"
            ? "found"
            : "lost";

    return reports
        .filter(other =>
            other !== report && other.status !== "resolved" &&
            other.type === oppositeType
        )
        .map(other => ({
            report: other,
            score: getMatchScore(report, other)
        }))
        .filter(match => match.score >= 35)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}


function showMatches(reportIndex) {

    const report = reports[reportIndex];
    const matches = findMatches(report);

    if (!matches.length) {
        showToast("No strong matches found yet.");
        return;
    }

    const match = matches[0];
    const person = match.report;

    const modal = document.createElement("div");

    modal.className = "match-modal";

    modal.innerHTML = `
        <div class="match-modal-box">

            <button class="close-match" aria-label="Close">×</button>

            <p class="section-label">POTENTIAL MATCH</p>

            <div class="match-big-score">
                ${match.score}%
            </div>

            <p class="match-confidence">
                Match confidence
            </p>

            <h2>${cleanText(person.name)}</h2>

            <div class="match-details">

                <div>
                    <span>REPORT</span>
                    <strong>${person.type.toUpperCase()}</strong>
                </div>

                <div>
                    <span>CATEGORY</span>
                    <strong>${cleanText(person.category)}</strong>
                </div>

                <div>
                    <span>LOCATION</span>
                    <strong>${cleanText(person.location)}</strong>
                </div>

                <div>
                    <span>DATE</span>
                    <strong>${cleanText(person.date)}</strong>
                </div>

                <div class="full-detail">
                    <span>DESCRIPTION</span>
                    <strong>${cleanText(person.description)}</strong>
                </div>

                <div class="full-detail contact-detail">
                    <span>CONTACT</span>
                    <strong>
                        ${cleanText(person.contact || "Contact not provided")}
                    </strong>
                </div>

            </div>

            <p class="match-note">
                This is a potential match based on category,
                item name, description, location and date.
                Verify the item before handing it over.
            </p>

        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-match").addEventListener("click", () => {
        modal.remove();
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}


function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


/* FILTER BUTTONS */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        showReports(button.dataset.filter);
    });

});


/* IMAGE NAME */

document.getElementById("photo").addEventListener("change", event => {

    const file = event.target.files[0];

    document.getElementById("file-name").textContent =
        file ? file.name : "+ Add an image";

});


/* REPORT FORM */

document.getElementById("report-form").addEventListener("submit", event => {

    event.preventDefault();


    const reportType =
        document.querySelector('input[name="report-type"]:checked').value;

    const dateInput = document.getElementById("date").value;

    const formattedDate = dateInput
        ? new Date(dateInput + "T12:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit"
        })
        : "Today";


    const newReport = {

        type: reportType,

        name: document.getElementById("item-name").value,

        category: document.getElementById("category").value,

        description: document.getElementById("description").value,

        location: document.getElementById("location").value,

        date: formattedDate,

        contact: document.getElementById("contact").value
    };


    reports.unshift(newReport);
    try { saveReports(); } catch { reports.shift(); showToast("Could not save. Browser storage may be full or unavailable."); return; }

    updateStats();

    showReports();

    event.target.reset();

    document.getElementById("file-name").textContent =
        "+ Add an image";


    showToast(
        "Report added — 404found is looking for matches."
    );


    window.location.hash = "browse";

});


let activeFilter = "all";
// Initialized by enhancements.js after motion and claim controls are ready.


/* Tip: run localStorage.removeItem("404found_reports") in the browser console
   if you want to reset the demo reports after changing the sample data. */

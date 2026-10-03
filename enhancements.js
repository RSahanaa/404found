const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let statsVisible = false;
const countFrames = new Map();
document.querySelectorAll('.stats>div').forEach((card, index) => {
    card.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 70 70" aria-hidden="true"><circle class="stat-track" cx="35" cy="35" r="30"/><circle class="stat-ring" cx="35" cy="35" r="30"/></svg><span class="stat-caption"></span>');
});
function updateStats() {
    const total = reports.length;
    const values = [total, reports.filter(r => r.type === 'lost' && r.status !== 'resolved').length, reports.filter(r => r.type === 'found' && r.status !== 'resolved').length, reports.filter(r => r.status === 'resolved').length];
    document.querySelectorAll('.stats>div').forEach((card, index) => {
        const number = card.querySelector('strong');
        const value = values[index];
        card.setAttribute('aria-label', `${value} ${['reports', 'open lost reports', 'open found reports', 'resolved reports'][index]}`);
        number.setAttribute('aria-hidden', 'true');
        card.querySelector('.stat-caption').textContent = index === 0 ? 'Community reports' : `${total ? Math.round(value / total * 100) : 0}% of all reports`;
        cancelAnimationFrame(countFrames.get(number));
        if (!statsVisible) return;
        card.querySelector('.stat-ring').style.strokeDashoffset = 189 * (1 - (total ? value / total : 0));
        const from = Number(number.textContent) || 0;
        const start = performance.now();
        function frame(now) {
            const progress = reducedMotion.matches ? 1 : Math.min(1, (now - start) / 1100);
            number.textContent = Math.round(from + (value - from) * (1 - (1 - progress) ** 3));
            if (progress < 1) countFrames.set(number, requestAnimationFrame(frame));
        }
        countFrames.set(number, requestAnimationFrame(frame));
    });
}
const statObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { statsVisible = true; updateStats(); statObserver.disconnect(); }
}, { threshold: .15 });
statObserver.observe(document.querySelector('.stats'));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .08 });
document.querySelectorAll('.hero-text,.hero-demo,.step-card,.report-intro,.report-form,.browse-header,.contact-intro,.contact-card').forEach((element, i) => {
    element.classList.add('reveal'); element.style.setProperty('--delay', `${i % 3 * 70}ms`); revealObserver.observe(element);
});
let scrollQueued = false;
function paintScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.scroll-progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(paintScroll); } }, { passive: true });
addEventListener('resize', paintScroll);

function openDialog(title, content) {
    const trigger = document.activeElement;
    document.querySelector('dialog.claim-dialog')?.close();
    const dialog = document.createElement('dialog');
    dialog.className = 'claim-dialog';
    dialog.setAttribute('aria-labelledby', 'claim-heading');
    dialog.innerHTML = `<button class="close-match" aria-label="Close dialog">×</button><p class="section-label">CLAIM & RECONNECT</p><h2 id="claim-heading">${cleanText(title)}</h2>${content}<p class="dialog-error" role="alert"></p>`;
    dialog.querySelector('.close-match').onclick = () => dialog.close();
    dialog.addEventListener('close', () => { dialog.remove(); trigger?.focus(); });
    document.body.append(dialog); dialog.showModal();
    return dialog;
}
function commitChange(change, dialog) {
    const before = JSON.stringify(reports);
    try { change(); saveReports(); } catch {
        reports = JSON.parse(before);
        dialog.querySelector('.dialog-error').textContent = 'Could not save. Storage may be full or unavailable. Please try again.';
        return false;
    }
    updateStats(); showReports(activeFilter); return true;
}
function openClaim(index) {
    const report = reports[index];
    if (!report || report.type !== 'found' || report.status === 'resolved') return;
    const dialog = openDialog(report.name, `<p>Think this is yours? Describe something only the owner would know. The finder reviews your claim before returning the item.</p><p class="local-note">Local demo: nothing is sent. Do not enter sensitive information. Finder review is available on the report card for testing.</p><form><label>Your name<input name="name" required maxlength="80" autocomplete="off"></label><label>Contact email<input name="email" type="email" required maxlength="160" autocomplete="off"></label><label>Ownership detail<textarea name="proof" required minlength="10" maxlength="1000" placeholder="For example: an engraving or a detail not shown in the report"></textarea></label><button class="button primary">Submit claim →</button></form>`);
    dialog.querySelector('form').onsubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);
        const name = data.get('name').trim(), email = data.get('email').trim().toLowerCase(), proof = data.get('proof').trim();
        const error = dialog.querySelector('.dialog-error');
        if (!name || proof.length < 10) { error.textContent = 'Add your name and at least 10 characters of ownership detail.'; return; }
        if ((report.claims || []).some(c => c.email === email && ['pending', 'approved'].includes(c.status))) { error.textContent = 'This email already has an active claim on this item.'; return; }
        if (report.status === 'resolved') { error.textContent = 'This report is already closed.'; return; }
        if (!commitChange(() => {
            report.claims ||= [];
            report.claims.push({ id: crypto.randomUUID(), name, email, proof, status: 'pending', createdAt: new Date().toISOString() });
        }, dialog)) return;
        dialog.close(); showToast('Claim saved locally — awaiting finder review.');
    };
}
function reviewClaim(index) {
    const report = reports[index];
    if (!report || report.status === 'resolved') return;
    const claims = (report.claims || []).filter(c => ['pending', 'approved'].includes(c.status));
    const dialog = openDialog('Finder review', `<p class="local-note">Demo role: finder. These controls simulate review; they are not authenticated. A shared service must restrict them to the finder or campus staff.</p><p>${cleanText(report.name)} · Verify ownership before arranging a handover at a campus help desk.</p>${claims.length ? claims.map(c => `<section class="claim-step" data-claim="${cleanText(c.id)}"><strong>${cleanText(c.name)}</strong><p>${cleanText(c.email)} · ${c.status === 'approved' ? 'Approved · awaiting handover' : 'Awaiting review'}</p><blockquote>${cleanText(c.proof)}</blockquote>${c.status === 'pending' ? '<div class="action-row"><button class="button primary" data-action="approve">Approve ownership</button><button class="button secondary" data-action="reject">Reject claim</button></div>' : '<label><input type="checkbox" class="handover">I have returned the item to the verified owner.</label><button class="button primary" data-action="close">Confirm handover & close report</button>'}</section>`).join('') : '<p>No claims yet. Choose “Claim this item” on the report to try the flow.</p>'}`);
    dialog.querySelectorAll('[data-action]').forEach(button => button.onclick = () => {
        const section = button.closest('[data-claim]');
        const claim = report.claims.find(c => c.id === section.dataset.claim);
        const action = button.dataset.action;
        const error = dialog.querySelector('.dialog-error');
        if (report.status === 'resolved') { error.textContent = 'This report is already closed.'; return; }
        if (action === 'approve' && report.claims.some(c => c.status === 'approved')) { error.textContent = 'Another claim is already approved for handover.'; return; }
        if (action === 'close' && (claim.status !== 'approved' || !section.querySelector('.handover').checked)) { error.textContent = 'Confirm that the item has been returned before closing the report.'; return; }
        if (!commitChange(() => {
            claim.status = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'completed';
            if (action === 'close') {
                report.status = 'resolved'; report.closedAt = new Date().toISOString();
                report.claims.forEach(c => { if (c !== claim && ['pending', 'approved'].includes(c.status)) c.status = 'closed'; });
            }
        }, dialog)) return;
        dialog.close();
        if (action === 'close') showToast('Item returned — report closed and resolved count updated.');
        else reviewClaim(index);
    });
}
updateStats(); showReports(); paintScroll();

const PRICE_PER_TICKET = 25;

const state = {
  muted: false,
  reduceMotion: false,
  volume: 0.6,
  ticketQty: 1,
  ticketType: 'Adult',
  visitDate: '',
  receiptMethod: 'sms'
};

const sections = document.querySelectorAll('.section');
const muteToggle = document.getElementById('muteToggle');
const motionToggle = document.getElementById('motionToggle');
const settingsDialog = document.getElementById('settingsDialog');
const settingsToggle = document.getElementById('settingsToggle');
const settingMute = document.getElementById('settingMute');
const settingReduceMotion = document.getElementById('settingReduceMotion');
const volumeRange = document.getElementById('volumeRange');
const visitDate = document.getElementById('visitDate');
const ticketQty = document.getElementById('ticketQty');
const plusQty = document.getElementById('plusQty');
const minusQty = document.getElementById('minusQty');
const ticketType = document.getElementById('ticketType');
const ticketForm = document.getElementById('ticketForm');
const checkoutForm = document.getElementById('checkoutForm');
const payButton = document.getElementById('payButton');
const smsFieldWrap = document.getElementById('smsFieldWrap');
const emailFieldWrap = document.getElementById('emailFieldWrap');
const confirmationMessage = document.getElementById('confirmationMessage');
const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');

function showSection(id) {
  sections.forEach(section => section.classList.toggle('active', section.id === id));
  const active = document.getElementById(id);
  if (active) {
    window.scrollTo({ top: 0, behavior: state.reduceMotion ? 'auto' : 'smooth' });
  }
}

function formatTotal(qty) {
  return `${qty * PRICE_PER_TICKET} USD`;
}

function updateSummary() {
  state.ticketQty = Math.min(10, Math.max(1, Number(ticketQty.value) || 1));
  state.ticketType = ticketType.value;
  state.visitDate = visitDate.value;

  document.getElementById('summaryQty').textContent = state.ticketQty;
  document.getElementById('summaryType').textContent = state.ticketType;
  document.getElementById('summaryTotal').textContent = formatTotal(state.ticketQty);
  document.getElementById('checkoutQty').textContent = state.ticketQty;
  document.getElementById('checkoutTotal').textContent = formatTotal(state.ticketQty);
  document.getElementById('checkoutDate').textContent = state.visitDate || '—';
  document.getElementById('confirmQty').textContent = state.ticketQty;
  document.getElementById('confirmDate').textContent = state.visitDate || '—';
  payButton.textContent = `Pay ${formatTotal(state.ticketQty)}`;
}

function setDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = tomorrow.toISOString().split('T')[0];
  visitDate.min = formatted;
  visitDate.value = formatted;
  state.visitDate = formatted;
}

function setReceiptFields() {
  const method = document.querySelector('input[name="receiptMethod"]:checked')?.value || 'sms';
  state.receiptMethod = method;
  smsFieldWrap.classList.toggle('hidden', method === 'email');
  emailFieldWrap.classList.toggle('hidden', method === 'sms');

  document.getElementById('phoneNumber').required = method === 'sms' || method === 'both';
  document.getElementById('emailAddress').required = method === 'email' || method === 'both';
}

function clearErrors(form) {
  form.querySelectorAll('.inline-error').forEach(node => node.remove());
  form.querySelectorAll('.field-error').forEach(node => node.classList.remove('field-error'));
}

function showError(input, message) {
  input.classList.add('field-error');
  const error = document.createElement('div');
  error.className = 'inline-error';
  error.textContent = message;
  input.insertAdjacentElement('afterend', error);
}

function validateTicketForm() {
  clearErrors(ticketForm);
  let valid = true;

  if (!visitDate.value) {
    showError(visitDate, 'Please select a visit date.');
    valid = false;
  }

  if (!ticketQty.value || Number(ticketQty.value) < 1) {
    showError(ticketQty, 'Please choose at least 1 ticket.');
    valid = false;
  }

  return valid;
}

function validateCheckoutForm() {
  clearErrors(checkoutForm);
  let valid = true;

  const cardName = document.getElementById('cardName');
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvc = document.getElementById('cardCvc');
  const billingZip = document.getElementById('billingZip');
  const phoneNumber = document.getElementById('phoneNumber');
  const emailAddress = document.getElementById('emailAddress');

  if (!cardName.value.trim()) {
    showError(cardName, 'Enter the name shown on the card.');
    valid = false;
  }
  if (cardNumber.value.replace(/\s/g, '').length < 15) {
    showError(cardNumber, 'Enter a valid card number.');
    valid = false;
  }
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
    showError(cardExpiry, 'Use MM/YY format.');
    valid = false;
  }
  if (!/^\d{3,4}$/.test(cardCvc.value)) {
    showError(cardCvc, 'Enter a valid CVC.');
    valid = false;
  }
  if (!billingZip.value.trim()) {
    showError(billingZip, 'Enter a billing zip code.');
    valid = false;
  }

  if ((state.receiptMethod === 'sms' || state.receiptMethod === 'both') && phoneNumber.value.replace(/\D/g, '').length < 10) {
    showError(phoneNumber, 'Enter a valid phone number for SMS receipt.');
    valid = false;
  }

  if ((state.receiptMethod === 'email' || state.receiptMethod === 'both') && !/^\S+@\S+\.\S+$/.test(emailAddress.value)) {
    showError(emailAddress, 'Enter a valid email address.');
    valid = false;
  }

  return valid;
}

function playRoar() {
  if (state.muted || state.volume <= 0) return;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = ctx.createGain();
  gain.gain.value = state.volume * 0.08;
  gain.connect(ctx.destination);

  const duration = 1.8;
  const now = ctx.currentTime;

  [85, 68, 54].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc.type = index === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, now + duration);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480 - index * 120, now);
    osc.connect(filter);
    filter.connect(gain);
    osc.start(now + index * 0.02);
    osc.stop(now + duration);
  });

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(state.volume * 0.08, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  setTimeout(() => ctx.close(), 2200);
}

function setMute(next) {
  state.muted = next;
  muteToggle.textContent = next ? '🔇' : '🔊';
  muteToggle.setAttribute('aria-pressed', String(next));
  settingMute.checked = next;
}

function setReduceMotion(next) {
  state.reduceMotion = next;
  document.body.classList.toggle('reduce-motion', next);
  motionToggle.setAttribute('aria-pressed', String(next));
  motionToggle.textContent = next ? '🧊' : '🎞️';
  settingReduceMotion.checked = next;
}

function downloadSummary() {
  const receiptText = [
    'Dino Valley Tickets — Booking Summary',
    `Park: Dino Valley Park`,
    `Location: Austin, Texas`,
    `Visit date: ${state.visitDate || '—'}`,
    `Tickets: ${state.ticketQty}`,
    `Ticket type: ${state.ticketType}`,
    `Total: ${formatTotal(state.ticketQty)}`,
    `Receipt delivery: ${state.receiptMethod.toUpperCase()}`
  ].join('\n');

  const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'dino-valley-booking-summary.txt';
  anchor.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll('[data-jump]').forEach(button => {
  button.addEventListener('click', () => showSection(button.dataset.jump));
});

settingsToggle.addEventListener('click', () => settingsDialog.showModal());
muteToggle.addEventListener('click', () => setMute(!state.muted));
motionToggle.addEventListener('click', () => setReduceMotion(!state.reduceMotion));
settingMute.addEventListener('change', e => setMute(e.target.checked));
settingReduceMotion.addEventListener('change', e => setReduceMotion(e.target.checked));
volumeRange.addEventListener('input', e => { state.volume = Number(e.target.value); });

ticketQty.addEventListener('input', updateSummary);
ticketType.addEventListener('change', updateSummary);
visitDate.addEventListener('change', updateSummary);
plusQty.addEventListener('click', () => { ticketQty.value = Math.min(10, Number(ticketQty.value) + 1); updateSummary(); });
minusQty.addEventListener('click', () => { ticketQty.value = Math.max(1, Number(ticketQty.value) - 1); updateSummary(); });

document.querySelectorAll('input[name="receiptMethod"]').forEach(radio => {
  radio.addEventListener('change', setReceiptFields);
});

document.getElementById('cardNumber').addEventListener('input', e => {
  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = cleaned.replace(/(.{4})/g, '$1 ').trim();
});

document.getElementById('cardExpiry').addEventListener('input', e => {
  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = cleaned.length > 2 ? `${cleaned.slice(0,2)}/${cleaned.slice(2)}` : cleaned;
});

ticketForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateTicketForm()) return;
  updateSummary();
  showSection('checkout');
});

checkoutForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateCheckoutForm()) return;

  payButton.disabled = true;
  payButton.textContent = 'Processing payment...';
  playRoar();

  window.setTimeout(() => {
    payButton.disabled = false;
    updateSummary();
    const phone = document.getElementById('phoneNumber').value.trim();
    const email = document.getElementById('emailAddress').value.trim();

    if (state.receiptMethod === 'sms') {
      confirmationMessage.textContent = `Your receipt was sent by SMS to ${phone}.`;
    } else if (state.receiptMethod === 'email') {
      confirmationMessage.textContent = `Your receipt was sent by email to ${email}.`;
    } else {
      confirmationMessage.textContent = `Your receipt was sent by SMS to ${phone} and by email to ${email}.`;
    }

    showSection('confirmation');
    payButton.textContent = `Pay ${formatTotal(state.ticketQty)}`;
  }, 1800);
});

downloadReceiptBtn.addEventListener('click', downloadSummary);

setDefaultDate();
setReceiptFields();
updateSummary();
setMute(false);
setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
showSection('home');

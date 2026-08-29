/**
 * Module 3: Delivery Slot Scheduling Engine
 * Generates 7-day future booking calendar and 2-hour delivery windows.
 * Dynamically disables past slots for current day using native JS Date() comparisons.
 */

const DELIVERY_SLOT_CONFIG = {
    maxDaysAhead: 7,
    timeSlots: [
        { id: "slot-1", label: "08:00 AM - 10:00 AM", startHour: 8, endHour: 10 },
        { id: "slot-2", label: "10:00 AM - 12:00 PM", startHour: 10, endHour: 12 },
        { id: "slot-3", label: "12:00 PM - 02:00 PM", startHour: 12, endHour: 14 },
        { id: "slot-4", label: "02:00 PM - 04:00 PM", startHour: 14, endHour: 16 },
        { id: "slot-5", label: "04:00 PM - 06:00 PM", startHour: 16, endHour: 18 },
        { id: "slot-6", label: "06:00 PM - 08:00 PM", startHour: 18, endHour: 20 },
        { id: "slot-7", label: "08:00 PM - 10:00 PM", startHour: 20, endHour: 22 }
    ]
};

let selectedDeliveryDate = null;
let selectedDeliveryTimeSlot = null;

// Generate available dates (Today + next 6 days)
function getAvailableDeliveryDates() {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < DELIVERY_SLOT_CONFIG.maxDaysAhead; i++) {
        const dateObj = new Date();
        dateObj.setDate(today.getDate() + i);

        const isoDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayName = (i === 0) ? 'Today' : (i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }));
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        dates.push({
            iso: isoDate,
            dayName: dayName,
            formatted: `${dayName}, ${formattedDate}`,
            isToday: (i === 0),
            dateObj: dateObj
        });
    }
    return dates;
}

// Populate the Date Selector Dropdown
function initDeliverySlotPicker() {
    const dateSelect = document.getElementById('delivery-date-select');
    if (!dateSelect) return;

    const dates = getAvailableDeliveryDates();
    dateSelect.innerHTML = dates.map(d => `
        <option value="${d.iso}">${d.formatted}</option>
    `).join('');

    // Default to first date (Today)
    selectedDeliveryDate = dates[0].iso;
    dateSelect.value = selectedDeliveryDate;

    // Render slots for initial selection
    renderTimeSlots(selectedDeliveryDate);

    // Bind change event
    dateSelect.addEventListener('change', (e) => {
        selectedDeliveryDate = e.target.value;
        selectedDeliveryTimeSlot = null; // reset selected slot
        renderTimeSlots(selectedDeliveryDate);
    });
}

// Render Time Slots and dynamically disable passed slots
function renderTimeSlots(selectedIsoDate) {
    const slotsContainer = document.getElementById('delivery-slots-container');
    if (!slotsContainer) return;

    const now = new Date();
    const currentHour = now.getHours();
    const todayIso = now.toISOString().split('T')[0];
    const isToday = (selectedIsoDate === todayIso);

    slotsContainer.innerHTML = DELIVERY_SLOT_CONFIG.timeSlots.map(slot => {
        // A slot is expired if selected date is today and slot startHour <= currentHour
        const isPast = isToday && (slot.startHour <= currentHour);
        const isSelected = (selectedDeliveryTimeSlot === slot.id);

        let cssClasses = 'slot-card';
        if (isPast) cssClasses += ' disabled';
        if (isSelected && !isPast) cssClasses += ' selected';

        return `
            <div 
                class="${cssClasses}" 
                data-slot-id="${slot.id}"
                data-slot-label="${slot.label}"
                ${!isPast ? `onclick="selectDeliverySlot('${slot.id}', '${slot.label}')"` : ''}
            >
                <div class="slot-time">${slot.label}</div>
                <div class="slot-tag">${isPast ? 'Unavailable' : 'Available'}</div>
            </div>
        `;
    }).join('');
}

// Select a specific time slot
function selectDeliverySlot(slotId, slotLabel) {
    selectedDeliveryTimeSlot = { id: slotId, label: slotLabel };
    
    // Highlight active card
    const cards = document.querySelectorAll('.slot-card');
    cards.forEach(c => {
        if (c.getAttribute('data-slot-id') === slotId) {
            c.classList.add('selected');
        } else {
            c.classList.remove('selected');
        }
    });

    const errorEl = document.getElementById('slot-error-msg');
    if (errorEl) errorEl.style.display = 'none';
}

// Validate whether a valid date and time slot has been selected
function getSelectedDeliverySchedule() {
    if (!selectedDeliveryDate || !selectedDeliveryTimeSlot) {
        return null;
    }
    return {
        date: selectedDeliveryDate,
        timeSlot: selectedDeliveryTimeSlot.label
    };
}

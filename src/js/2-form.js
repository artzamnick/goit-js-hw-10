const STORAGE_KEY = 'feedback-form-state';

const formData = {
    email: '',
    message: '',
};
const form = document.querySelector('.feedback-form');
if (!form) {
    console.error('Feedback form not found in DOM.');
}

const saved = localStorage.getItem(STORAGE_KEY);
if (saved) {
    try {
    const parsed = JSON.parse(saved);
    formData.email = parsed.email ?? '';
    formData.message = parsed.message ?? '';
    } catch (err) {
    console.warn('Could not parse saved feedback-form-state:', err);
    }
}

if (form) {
    if (form.elements.email) form.elements.email.value = formData.email;
    if (form.elements.message) form.elements.message.value = formData.message;
}

if (form) {
    form.addEventListener('input', (evt) => {
    const target = evt.target;
    if (!target || !target.name) return; 

    const rawValue = target.value;
    const trimmed = rawValue.trim();

    formData[target.name] = trimmed;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
        console.error('Failed to save to localStorage', err);
    }
    });

    form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const emailVal = (formData.email || '').trim();
    const messageVal = (formData.message || '').trim();

    if (!emailVal || !messageVal) {
        alert('Fill please all fields');
        return;
    }

    console.log({ email: emailVal, message: messageVal });
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
    formData.email = '';
    formData.message = '';
    });
}

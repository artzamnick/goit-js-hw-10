import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('#promise-form');
const delayInput = form.querySelector('input[name="delay"]');
const stateRadios = form.querySelectorAll('input[name="state"]');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const delay = Number(delayInput.value);

    if (!Number.isFinite(delay) || delay < 0) {
    iziToast.warning({
        title: 'Warning',
        message: 'Please enter a valid non-negative delay (ms).',
        position: 'topRight',
    });
    return;
}

const state = Array.from(stateRadios).find(r => r.checked)?.value;
    if (!state) {
    iziToast.warning({
        title: 'Warning',
        message: 'Choose a state (fulfilled or rejected).',
        position: 'topRight',
    });
    return;
}

submitBtn.disabled = true;

createDelayedPromise(delay, state === 'fulfilled')
    .then((ms) => {
        const msg = `✅ Fulfilled promise in ${ms}ms`;
        iziToast.success({
        title: 'Success',
        message: msg,
        position: 'topRight',
    });
})
    .catch((ms) => {
        const msg = `❌ Rejected promise in ${ms}ms`;
        iziToast.error({
        title: 'Error',
        message: msg,
        position: 'topRight',
    });
})
    .finally(() => {
        submitBtn.disabled = false;
    });
});

function createDelayedPromise(ms, shouldResolve = true) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (shouldResolve) {
        resolve(ms);
    } else {
        reject(ms);
    }
    }, ms);
});
}

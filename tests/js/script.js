let counter = 0;
const section = document.querySelector('.uk-section');

const toggleClass = () => {
    const element = document.getElementById('uk-panel-margin');

    element.classList.add('uk-animation-fade');
    setTimeout(() => {
        element.classList.remove('uk-animation-fade');
    }, 800);
};

/*
const isInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

    window.onscroll = null;

    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};
*/

toggleClass();

/*
document.addEventListener('scroll', () => {
    if (isInViewport(section)) {
        counter++;

        if (counter === 1) {
            toggleClass();
        }
    } else {
        toggleClass();
        counter--;
    }
});
*/

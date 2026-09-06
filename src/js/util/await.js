export function awaitFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
}

export function awaitTimeout(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

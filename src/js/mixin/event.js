export function maybeDefaultPreventClick(e) {
    if (e.target.closest('a[href="#"],a[href=""]')) {
        e.preventDefault();
    }
}

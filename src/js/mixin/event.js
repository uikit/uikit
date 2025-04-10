export function maybeDefautPreventClick(e) {
    if (e.target.closest('a[href="#"],a[href=""]')) {
        e.preventDefault();
    }
}

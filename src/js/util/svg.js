import { $$ } from './dom';

export function getMaxPathLength(el) {
    try {
        return Math.ceil(
            Math.max(0, ...$$('[stroke]', el).map((stroke) => stroke.getTotalLength?.() || 0)),
        );
    } catch {
        return 0;
    }
}

import { $$ } from './dom';

export function getMaxPathLength(el) {
    return Math.ceil(Math.max(0, ...$$('[stroke]', el).map((stroke) => stroke.getTotalLength?.())));
}

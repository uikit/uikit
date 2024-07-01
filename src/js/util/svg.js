import { $$ } from './dom';
import { isVisible } from './filter.js';

export function getMaxPathLength(el) {
    return isVisible(el)
        ? Math.ceil(
              Math.max(0, ...$$('[stroke]', el).map((stroke) => stroke.getTotalLength?.() || 0)),
          )
        : 0;
}

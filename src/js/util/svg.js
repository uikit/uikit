import { $$ } from './dom';

export function getMaxPathLength(el) {
    return Math.ceil(
        Math.max(
            0,
            ...$$('[stroke]', el).map((stroke) => {
                try {
                    return stroke.getTotalLength();
                } catch (e) {
                    return 0;
                }
            })
        )
    );
}

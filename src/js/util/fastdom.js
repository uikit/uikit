/*
    Based on:
    Copyright (c) 2016 Wilson Page wilsonpage@me.com
    https://github.com/wilsonpage/fastdom
*/

export const fastdom = {
    reads: [],
    writes: [],

    read(task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
    },

    write(task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
    },

    clear(task) {
        remove(this.reads, task);
        remove(this.writes, task);
    },

    flush,
};

function flush(recursion) {
    runTasks(fastdom.reads);
    runTasks(fastdom.writes.splice(0));

    fastdom.scheduled = false;

    if (fastdom.reads.length || fastdom.writes.length) {
        scheduleFlush(recursion + 1);
    }
}

const RECURSION_LIMIT = 4;
function scheduleFlush(recursion) {
    if (fastdom.scheduled) {
        return;
    }

    fastdom.scheduled = true;
    if (recursion && recursion < RECURSION_LIMIT) {
        Promise.resolve().then(() => flush(recursion));
    } else {
        requestAnimationFrame(() => flush(1));
    }
}

function runTasks(tasks) {
    let task;
    while ((task = tasks.shift())) {
        try {
            task();
        } catch (e) {
            console.error(e);
        }
    }
}

function remove(array, item) {
    const index = array.indexOf(item);
    return ~index && array.splice(index, 1);
}

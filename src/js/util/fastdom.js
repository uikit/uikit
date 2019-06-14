import {Promise} from './promise';
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
        return remove(this.reads, task) || remove(this.writes, task);
    },

    flush

};

function flush() {
    runTasks(fastdom.reads);
    runTasks(fastdom.writes.splice(0, fastdom.writes.length));

    fastdom.scheduled = false;

    if (fastdom.reads.length || fastdom.writes.length) {
        scheduleFlush(true);
    }
}

function scheduleFlush(microtask = false) {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        if (microtask) {
            Promise.resolve().then(flush);
        } else {
            requestAnimationFrame(flush);
        }
    }
}

function runTasks(tasks) {
    let task;
    while ((task = tasks.shift())) {
        task();
    }
}

function remove(array, item) {
    const index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

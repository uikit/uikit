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

    flush() {

        runTasks(this.reads);
        runTasks(this.writes.splice(0, this.writes.length));

        this.scheduled = false;

        if (this.reads.length || this.writes.length) {
            scheduleFlush();
        }

    }

};

function scheduleFlush() {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        requestAnimationFrame(fastdom.flush.bind(fastdom));
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

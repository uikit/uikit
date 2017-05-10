/*
    Based on:
    Copyright (c) 2016 Wilson Page wilsonpage@me.com
    https://github.com/wilsonpage/fastdom
*/

import { requestAnimationFrame } from './index';

export const fastdom = {

    reads: [],
    writes: [],

    measure: function(task) {
        this.reads.push(task);
        scheduleFlush(this);
        return task;
    },

    mutate: function(task) {
        this.writes.push(task);
        scheduleFlush(this);
        return task;
    },

    clear: function(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },

    flush: function() {
        runTasks(this.reads);
        runTasks(this.writes.splice(0, this.writes.length));

        this.scheduled = false;

        if (this.reads.length || this.writes.length) {
            scheduleFlush(this);
        }
    }

};

function scheduleFlush(fastdom) {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        requestAnimationFrame(flush.bind(null, fastdom));
    }
}

function runTasks(tasks) {
    var task;
    while (task = tasks.shift()) {
        task();
    }
}

function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

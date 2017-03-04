// Copyright (c) 2016 Wilson Page wilsonpage@me.com
// https://github.com/wilsonpage/fastdom

import { requestAnimationFrame } from './index';

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
    var self = this;
    self.reads = [];
    self.writes = [];
    self.raf = requestAnimationFrame.bind(window); // test hook
}

FastDom.prototype = {
    constructor: FastDom,

    /**
     * Adds a job to the read batch and
     * schedules a new frame if need be.
     *
     * @param  {Function} fn
     * @public
     */
    measure: function(fn, ctx) {
        var task = !ctx ? fn : fn.bind(ctx);
        this.reads.push(task);
        scheduleFlush(this);
        return task;
    },

    /**
     * Adds a job to the
     * write batch and schedules
     * a new frame if need be.
     *
     * @param  {Function} fn
     * @public
     */
    mutate: function(fn, ctx) {
        var task = !ctx ? fn : fn.bind(ctx);
        this.writes.push(task);
        scheduleFlush(this);
        return task;
    },

    /**
     * Clears a scheduled 'read' or 'write' task.
     *
     * @param {Object} task
     * @return {Boolean} success
     * @public
     */
    clear: function(task) {
        return remove(this.reads, task) || remove(this.writes, task);
    },

    /**
     * Extend this FastDom with some
     * custom functionality.
     *
     * Because fastdom must *always* be a
     * singleton, we're actually extending
     * the fastdom instance. This means tasks
     * scheduled by an extension still enter
     * fastdom's global task queue.
     *
     * The 'super' instance can be accessed
     * from `this.fastdom`.
     *
     * @example
     *
     * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
     *
     * @param  {Object} props  properties to mixin
     * @return {FastDom}
     */
    extend: function(props) {
        if (typeof props != 'object') throw new Error('expected object');

        var child = Object.create(this);
        mixin(child, props);
        child.fastdom = this;

        // run optional creation hook
        if (child.initialize) child.initialize();

        return child;
    },

    // override this with a function
    // to prevent Errors in console
    // when tasks throw
    catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
    if (!fastdom.scheduled) {
        fastdom.scheduled = true;
        fastdom.raf(flush.bind(null, fastdom));
    }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {

    var error;

    try {
        runTasks(fastdom.reads);
        runTasks(fastdom.writes.splice(0, fastdom.writes.length));
    } catch (e) { error = e; }

    fastdom.scheduled = false;

    // If the batch errored we may still have tasks queued
    if (fastdom.reads.length || fastdom.writes.length) scheduleFlush(fastdom);

    if (error) {
        if (fastdom.catch) fastdom.catch(error);
        else throw error;
    }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
    var task; while (task = tasks.shift()) task();
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
    var index = array.indexOf(item);
    return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) target[key] = source[key];
    }
}

export const fastdom = new FastDom();

/* global UIkit, NAME */
import Component from 'component';

if (typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.component(NAME, Component);
}
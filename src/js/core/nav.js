import Accordion from './accordion';

export default {

    extends: Accordion,

    defaults: {
        targets: '> .uk-parent',
        toggle: '> a',
        content: '> ul'
    }

};

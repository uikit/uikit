import Accordion from './accordion';

export default {
    extends: Accordion,

    data: {
        targets: '> .uk-parent',
        toggle: '> a',
        content: '> ul',
    },
};

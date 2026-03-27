import icons from 'virtual:icons';

function plugin(UIkit) {
    if (plugin.installed) {
        return;
    }

    UIkit.icon.add(icons);
}

if (typeof window !== 'undefined' && window.UIkit) {
    window.UIkit.use(plugin);
}

export default plugin;

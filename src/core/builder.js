const intervals = {};

function addTemplateNode(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export const scriptsPanel = addTemplateNode(''
    + '<div id="nodeScriptsPanel" class="card mb-3" display="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;">'
    + '     <div id="scriptClickAutomation" class="card-header p-0" data-toggle="collapse" href="#scriptsPanelBody">'
    + '         <span>Scripts panel</span>'
    + '     </div>'
    + '     <div id="scriptsPanelBody" class="card-body p-0">'
    + '     </div>'
    + '</div>')

export function toggleScript(callable) {
    const button = document.getElementById(callable.name);
    if (intervals[callable.name]) {
        clearInterval(intervals[callable.name]);
        intervals[callable.name] = undefined;
        button.classList.remove('btn-primary');
    } else {
        intervals[callable.name] = setInterval(callable);
        button.classList.add('btn-primary');
    }
}

export function appendToggleButton(label, callable) {
    const button = addTemplateNode(`
        <button
            id="${callable.name}"
            class="btn"
            onclick="toggleScript(${callable.name})"
        >
            ${label}
        </button>
    `);
    document.getElementById('scriptsPanelBody').appendChild(button);
}
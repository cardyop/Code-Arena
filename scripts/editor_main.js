// Load project name
const projectName = localStorage.getItem('current_project_name') || 'Project'
document.getElementById('projectName').textContent = projectName
document.getElementById('tabName').textContent = 'main.py'
document.getElementById('statusProject').textContent = '📁 ' + projectName

// ICON BAR — toggle panels
const iconBtns = document.querySelectorAll('.icon-btn')
const leftPanel = document.getElementById('leftPanel')

document.getElementById('iconFiles').addEventListener('click', () => {
    togglePanel('filesPanel', 'iconFiles')
})

document.getElementById('iconSearch').addEventListener('click', () => {
    togglePanel('searchPanel', 'iconSearch')
})

document.getElementById('iconExtensions').addEventListener('click', () => {
    togglePanel('extensionsPanel', 'iconExtensions')
})

document.getElementById('iconSave').addEventListener('click', () => {
    saveCode()
})

function togglePanel(panelId, iconId) {
    const allPanels = document.querySelectorAll('.panel-section')
    const clickedPanel = document.getElementById(panelId)
    const isOpen = !clickedPanel.classList.contains('hidden')

    allPanels.forEach(p => p.classList.add('hidden'))
    iconBtns.forEach(b => b.classList.remove('active'))

    if (isOpen) {
        leftPanel.classList.add('collapsed')
    } else {
        leftPanel.classList.remove('collapsed')
        clickedPanel.classList.remove('hidden')
        document.getElementById(iconId).classList.add('active')
    }
}

// CLOSE PANEL BUTTONS
document.getElementById('closePanel').addEventListener('click', () => {
    leftPanel.classList.add('collapsed')
    iconBtns.forEach(b => b.classList.remove('active'))
})


function saveCode() {
    if (window.editor) {
        localStorage.setItem('code_' + projectName, window.editor.getValue())
    }
}

// AUTO SAVE on Ctrl+S
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        saveCode()
    }
})

// RUN BUTTON (simulated for now)
document.getElementById('runBtn').addEventListener('click', () => {
    document.getElementById('outputContent').innerHTML = 
        '<span style="color:#22C55E">▶ Running...</span><br><span style="color:#ccc">Hello, CodeArena!</span>'
})
// OUTPUT TABS
document.querySelectorAll('.output-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.output-tab').forEach(t => t.classList.remove('active'))
        this.classList.add('active')
    })
}) 
// NEW FILE
document.getElementById('newFileBtn').addEventListener('click', () => {
    const name = prompt('Enter file name:')
    if (name) {
        const file = document.createElement('div')
        file.className = 'file'
        file.textContent = '📄 ' + name
        file.addEventListener('click', () => {
            document.querySelectorAll('.file').forEach(f => f.classList.remove('active'))
            file.classList.add('active')
            document.getElementById('tabName').textContent = name
        })
        document.getElementById('folderContents').appendChild(file)
    }
})
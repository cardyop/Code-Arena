const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            sandbox: false 
        }
    })
    win.setMenu(null)
    win.webContents.openDevTools()
    win.loadFile('pages/auth.html')
}

app.setAsDefaultProtocolClient('codearena')

app.whenReady().then(createWindow)

app.on('open-url', (event, url) => {
    event.preventDefault()
    handleOAuthCallback(url)
})

// For Windows
app.on('second-instance', (event, commandLine) => {
    const url = commandLine.find(arg => arg.startsWith('codearena://'))
    if (url) handleOAuthCallback(url)
})

function handleOAuthCallback(url) {
    const urlParams = new URL(url)
    const token = urlParams.searchParams.get('token')
    const user = urlParams.searchParams.get('user')

    if (token && user) {
        // Send to renderer process
        const win = BrowserWindow.getAllWindows()[0]
        win.webContents.executeJavaScript(`
            localStorage.setItem('ca_user', '${user}')
            localStorage.setItem('ca_token', '${token}')
            window.location.href = 'gatekeeper.html'
        `)
    }
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
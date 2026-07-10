const db = {
    // PROJECTS
    getProjects() { return JSON.parse(localStorage.getItem('ca_projects') || '[]') },
    saveProject(project) {
        const projects = this.getProjects()
        projects.unshift(project)
        localStorage.setItem('ca_projects', JSON.stringify(projects))
    },
    deleteProject(name) {
        const projects = this.getProjects().filter(p => p.name !== name)
        localStorage.setItem('ca_projects', JSON.stringify(projects))
    },

    // PVP
    getPvpHistory() { return JSON.parse(localStorage.getItem('pvp_history') || '[]') },
    savePvpMatch(match) {
        const history = this.getPvpHistory()
        history.unshift(match)
        localStorage.setItem('pvp_history', JSON.stringify(history))
    },
    getElo() { return parseInt(localStorage.getItem('pvp_elo') || '1200') },
    setElo(elo) { localStorage.setItem('pvp_elo', elo) },
    getWins() { return parseInt(localStorage.getItem('pvp_wins') || '0') },
    getLosses() { return parseInt(localStorage.getItem('pvp_losses') || '0') },
    addWin() { localStorage.setItem('pvp_wins', this.getWins() + 1) },
    addLoss() { localStorage.setItem('pvp_losses', this.getLosses() + 1) },
    getBestTime() { return localStorage.getItem('pvp_best_time') || '--:--' },
    setBestTime(time) { localStorage.setItem('pvp_best_time', time) },

    // USER
    getUser() { return JSON.parse(localStorage.getItem('ca_user') || 'null') },
    saveUser(user) { localStorage.setItem('ca_user', JSON.stringify(user)) }
}
// Load stats from localStorage
function loadStats() {
    const history = db.getPvpHistory()
    const elo = db.getElo()
    const wins = db.getWins()
    const losses = db.getLosses()
    const bestTime = db.getBestTime()
    const bestSpace = 'O(n)'

    // ELO
    document.getElementById('eloNumber').textContent = elo
    document.getElementById('totalWins').textContent = wins
    document.getElementById('totalLosses').textContent = losses
    document.getElementById('winRate').textContent = 
        wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) + '%' : '0%'

    // Best stats
    document.getElementById('bestTime').textContent = bestTime
    document.getElementById('bestSpace').textContent = bestSpace

    // Rank
    let rank = '🥉 Bronze'
    let progress = ((elo - 1000) / 500) * 100
    if (elo >= 1500) { rank = '🥈 Silver'; progress = ((elo - 1500) / 500) * 100 }
    if (elo >= 2000) { rank = '🥇 Gold'; progress = ((elo - 2000) / 500) * 100 }
    if (elo >= 2500) { rank = '💎 Diamond'; progress = ((elo - 2500) / 500) * 100 }
    if (elo >= 3000) { rank = '👑 Grandmaster'; progress = 100 }

    document.getElementById('rankBadge').textContent = rank
    document.getElementById('rankFill').style.width = Math.min(progress, 100) + '%'

    // History
    const historyList = document.getElementById('historyList')
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-state">No matches yet. Start your first PVP!</div>'
    } else {
        historyList.innerHTML = history.map(h => `
            <div class="history-item">
                <span>⚔️ vs ${h.opponent}</span>
                <span class="result-badge ${h.result}">${h.result.toUpperCase()}</span>
                <span style="color:${h.result === 'win' ? '#22C55E' : '#EF4444'}">
                    ${h.result === 'win' ? '+25' : '-20'} ELO
                </span>
            </div>
        `).join('')
    }
}

// Start PVP
document.getElementById('startPvpBtn').addEventListener('click', () => {
    window.location.href = '../pages/pvp.html'
})

// Back to home
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '../pages/home_page.html'
})

loadStats()
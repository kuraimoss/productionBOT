module.exports = {
    name: "typodetect",
    function: true,
    typo: true,
    desc: "Fungsi typo-detect: mendeteksi typo pada command dan memberi saran command yang benar.",
    async handler(m, { conn, isCreator, prefix, command }) {
        try {
            if (!command) return
            const plugins = Object.values(attr.commands).filter(plugin => !plugin.disabled && !plugin.ignored)
            const cmdList = []
            for (const cemde of plugins) {
                const cmds = Array.isArray(cemde.cmd) ? cemde.cmd : cemde.cmd ? [cemde.cmd] : []
                for (const ps of cmds) {
                    if (ps && typeof ps === "string") cmdList.push(ps.toLowerCase())
                }
            }
            const uniqueCmds = [...new Set(cmdList)]
            const input = String(command).toLowerCase()
            if (uniqueCmds.includes(input)) return

            const scored = uniqueCmds.map((cand) => {
                const lev = levenshteinDistance(input, cand)
                const base = 1 - lev / Math.max(input.length, cand.length)
                const prefixBoost = cand.startsWith(input) || input.startsWith(cand) ? 0.15 : 0
                const containsBoost = cand.includes(input) || input.includes(cand) ? 0.1 : 0
                const first2Boost = input.slice(0, 2) === cand.slice(0, 2) ? 0.1 : 0
                const firstBoost = input[0] === cand[0] ? 0.05 : 0
                const overlap = bigramSimilarity(input, cand) * 0.2
                const score = base + prefixBoost + containsBoost + first2Boost + firstBoost + overlap
                return { cand, score, base, lev }
            }).sort((a, b) => b.score - a.score)

            const best = scored[0]
            if (!best) return
            const threshold = input.length <= 4 ? 0.5 : 0.6
            const hasSuggestion = best.score >= threshold

            if (hasSuggestion) {
                const top = scored.slice(0, 3)
                const suggestions = top.map((s) => {
                    let acc = Math.min(s.base, 0.99)
                    if (s.lev === 0) acc = 1
                    return `• ${prefix}${s.cand} ${Math.round(acc * 100)}%`
                })
                const avg =
                    top.reduce((sum, s) => {
                        let acc = Math.min(s.base, 0.99)
                        if (s.lev === 0) acc = 1
                        return sum + acc
                    }, 0) / top.length
                m.reply(
                    `❗ *Command tidak ditemukan*\n\n` +
                    `Mungkin maksud kamu:\n` +
                    suggestions.join("\n") +
                    `\n\n_Akurasi rata-rata: ${Math.round(avg * 100)}%_`
                )
            } else {
                m.reply(
                    `❗ *Command tidak ditemukan*\n\n` +
                    `Aku belum bisa menebak command yang kamu maksud.\n` +
                    `Coba ketik *${prefix}menu* untuk lihat daftar fitur.`
                )
            }
        } catch {
        }
    }
}

function levenshteinDistance(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    const dp = [];

    for (let i = 0; i <= m; i++) {
        dp[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + 1
                );
            }
        }
    }

    return dp[m][n];
}

function bigramSimilarity(a, b) {
    const setA = new Set();
    const setB = new Set();
    for (let i = 0; i < a.length - 1; i++) setA.add(a.slice(i, i + 2));
    for (let i = 0; i < b.length - 1; i++) setB.add(b.slice(i, i + 2));
    const inter = [...setA].filter((x) => setB.has(x)).length;
    const total = setA.size + setB.size;
    if (total === 0) return 0;
    return (2 * inter) / total;
}

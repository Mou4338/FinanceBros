// Lets other pages (Learn, Home) open a specific calculator: openTool('ppf')
let pending = null
export function openTool(key) { pending = key; window.location.hash = 'calculators' }
export function takePendingTool() { const k = pending; pending = null; return k }

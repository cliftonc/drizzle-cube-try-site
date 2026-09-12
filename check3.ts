import { productivityDashboardConfig as d } from './src/dashboard-config'
const ps = d.config.portlets
for (const id of ['section-activity', 'code-activity-grid', 'data-driven-narrative']) {
  const p = ps.find(x => x.id === id)
  console.log(id.padEnd(24), JSON.stringify({ x: p?.x, y: p?.y, w: p?.w, h: p?.h }))
}
// Every portlet must be referenced exactly once across rows and group cells.
const refs = new Map<string, number>()
const bump = (id: string) => refs.set(id, (refs.get(id) ?? 0) + 1)
for (const r of d.config.rows ?? []) for (const c of r.columns) {
  if (c.portletId) bump(c.portletId)
  if (c.groupId) d.config.groups?.find(g => g.id === c.groupId)?.cells.forEach(cell => cell.portletIds.forEach(bump))
}
const bad = ps.filter(p => refs.get(p.id) !== 1).map(p => `${p.id}=${refs.get(p.id) ?? 0}`)
console.log('portlets:', ps.length, 'rows:', d.config.rows?.length, 'groups:', d.config.groups?.length)
console.log('referenced exactly once:', bad.length === 0 ? 'yes' : bad.join(', '))

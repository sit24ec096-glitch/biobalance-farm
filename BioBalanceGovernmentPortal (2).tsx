"use client"
// BioBalance Government Portal – single-file v0-ready component (React + TS + Tailwind + Recharts + Lucide).
// ALL DATA IS FICTIONAL PROTOTYPE/DEMO DATA.
import { useMemo, useState } from "react"
import { Bell, Search, Menu, X, ChevronDown } from "lucide-react"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

type Ver = "Verified" | "Pending" | "Requires Review"
type Cat = "Balanced" | "Biodiversity Improving" | "Economically Strong" | "Needs Support"
interface Farm { id: string; place: string; region: string; acres: number; eco: number; bio: number; credits: number; imp: number; ver: Ver }

const inr = (n: number) => "₹" + n.toLocaleString("en-IN")
const score = (f: Farm) => Math.round((f.eco + f.bio) / 2)
const catOf = (f: Farm): Cat => f.eco >= 65 && f.bio >= 65 ? "Balanced" : f.bio < 65 && f.imp >= 15 ? "Biodiversity Improving" : f.eco >= 65 ? "Economically Strong" : "Needs Support"
const incOf = (f: Farm) => f.ver !== "Verified" ? "Review" : score(f) >= 50 ? "Eligible" : "Not eligible"
const COLORS: Record<Cat, string> = { Balanced: "#15803d", "Biodiversity Improving": "#eab308", "Economically Strong": "#2563eb", "Needs Support": "#dc2626" }
const CATS = Object.keys(COLORS) as Cat[]

const F = (id: string, place: string, region: string, acres: number, eco: number, bio: number, credits: number, imp: number, ver: Ver): Farm => ({ id, place, region, acres, eco, bio, credits, imp, ver })
const FARMERS: Farm[] = [
  F("BB-1025", "Pune", "Maharashtra", 4.5, 81, 74, 182, 26, "Verified"), F("BB-1182", "Nashik", "Maharashtra", 3.2, 70, 58, 96, 14, "Pending"),
  F("BB-1240", "Mysuru", "Karnataka", 6, 77, 82, 214, 22, "Verified"), F("BB-1311", "Dharwad", "Karnataka", 2.8, 52, 61, 88, 18, "Verified"),
  F("BB-1407", "Coimbatore", "Tamil Nadu", 5.1, 84, 79, 201, 19, "Verified"), F("BB-1466", "Thanjavur", "Tamil Nadu", 3.9, 58, 47, 54, 6, "Verified"),
  F("BB-1533", "Ludhiana", "Punjab", 9.5, 90, 55, 120, 9, "Verified"), F("BB-1598", "Amritsar", "Punjab", 7.4, 72, 63, 110, 12, "Pending"),
  F("BB-1640", "Anand", "Gujarat", 4, 79, 71, 158, 17, "Verified"), F("BB-1712", "Rajkot", "Gujarat", 8.2, 68, 66, 143, 15, "Verified"),
  F("BB-1789", "Kolhapur", "Maharashtra", 2.5, 46, 52, 61, 11, "Requires Review"), F("BB-1856", "Madurai", "Tamil Nadu", 3.6, 63, 69, 132, 21, "Verified"),
]
let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
const REGS = ["Maharashtra", "Karnataka", "Tamil Nadu", "Punjab", "Gujarat"]
const DOTS: Farm[] = [...FARMERS, ...Array.from({ length: 120 }, (_, i) => F(`BB-${3000 + i}`, REGS[i % 5], REGS[i % 5], 3, Math.round(35 + rnd() * 60), Math.round(30 + rnd() * 65), Math.round(60 + rnd() * 150), Math.round(rnd() * 30), rnd() > 0.15 ? "Verified" : "Pending"))]
const REGION_ROWS = [
  { r: "Maharashtra", farms: 3240, score: 76, bio: 78, cred: 82, imp: 21 }, { r: "Karnataka", farms: 2180, score: 73, bio: 75, cred: 76, imp: 18 },
  { r: "Tamil Nadu", farms: 1920, score: 77, bio: 80, cred: 84, imp: 23 }, { r: "Punjab", farms: 1640, score: 69, bio: 64, cred: 65, imp: 12 },
  { r: "Gujarat", farms: 1450, score: 74, bio: 72, cred: 73, imp: 17 },
]
const PRACTICE_CREDITS = [
  { p: "Crop diversification", v: 18500 }, { p: "Crop rotation", v: 15200 }, { p: "Pollinator habitat", v: 12600 },
  { p: "Native vegetation", v: 9800 }, { p: "Water efficiency", v: 17400 }, { p: "Reduced chemicals", v: 13200 },
]
const VERIFS = [
  { id: "BB-1025", practice: "Pollinator habitat", ev: "Photo + location", st: "Verified", c: "+8" }, { id: "BB-1182", practice: "Native vegetation", ev: "Photo", st: "Pending", c: "+15" },
  { id: "BB-1240", practice: "Crop rotation", ev: "Field log + photo", st: "Verified", c: "+10" }, { id: "BB-1789", practice: "Intercropping", ev: "Photo unclear", st: "Requires Review", c: "+10" },
]
const NAV = [["🏠", "Overview", "overview"], ["👨‍🌾", "Farmers", "farmers"], ["🌱", "Biodiversity", "balance"], ["💰", "Economic Performance", "balance"], ["🪙", "BioBalance Credits", "credits"],
  ["💳", "Incentives", "incentives"], ["🗺️", "Regional Analysis", "regional"], ["🔍", "Verification", "verification"], ["📊", "Reports", "flow"]]

const Card = ({ id, title, children }: { id?: string; title?: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">{title && <h2 className="mb-3 text-xl font-semibold text-green-900">{title}</h2>}{children}</section>)
const Pill = ({ t }: { t: string }) => {
  const c = /Verified|Eligible|Balanced/.test(t) && !/Not/.test(t) ? "bg-green-100 text-green-800" : /Pending|Review|Improving/.test(t) ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{t}</span>
}
const Sel = ({ label, v, o, on }: { label: string; v: string; o: string[]; on: (x: string) => void }) => (
  <label className="flex items-center gap-2 text-sm text-stone-600">{label}<select value={v} onChange={e => on(e.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-1">{o.map(x => <option key={x}>{x}</option>)}</select></label>)
const Bar2 = ({ v }: { v: number }) => <div className="h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-green-700" style={{ width: `${v}%` }} /></div>

export default function BioBalanceGovernmentPortal() {
  const [period, setPeriod] = useState("Current Season"), [region, setRegion] = useState("All"), [status, setStatus] = useState("All")
  const [sel, setSel] = useState<Farm | null>(null), [menu, setMenu] = useState(false), [sort, setSort] = useState<"farms" | "score" | "bio" | "cred" | "imp">("score"), [vf, setVf] = useState("All")

  const match = (f: Farm) => (region === "All" || f.region === region) && (status === "All" || (status === "Needs Support" ? catOf(f) === "Needs Support" : f.ver === status))
  const table = useMemo(() => FARMERS.filter(match), [region, status])
  const dots = useMemo(() => DOTS.filter(match), [region, status])
  const reg = REGION_ROWS.find(x => x.r === region)
  const pf = period === "Previous Season" ? 0.92 : period === "Year" ? 1.6 : 1
  const k = reg
    ? { farms: Math.round(reg.farms * pf), score: reg.score, cred: reg.farms * reg.cred, viable: 89.2, bio: reg.imp, pool: +(18.6 * reg.farms / 12548 * pf).toFixed(1) }
    : { farms: Math.round(12548 * pf), score: 74.6, cred: Math.round(936420 * pf), viable: 89.2, bio: 18.7, pool: +(18.6 * pf).toFixed(1) }
  const rows = [...REGION_ROWS].sort((a, b) => b[sort] - a[sort])
  const go = () => setMenu(false)

  return (
    <div className="flex min-h-screen bg-[#f4f8f1] text-stone-800">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-green-950 p-5 text-green-50 transition-transform lg:static lg:translate-x-0 ${menu ? "" : "-translate-x-full"}`}>
        <div className="text-2xl font-bold">🏛️ BioBalance</div><div className="text-sm text-green-300">Government Portal</div>
        <nav className="mt-6 flex-1 space-y-1">{NAV.map(([e, n, id]) => <a key={n} href={`#${id}`} onClick={go} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-green-800"><span>{e}</span>{n}</a>)}</nav>
        <div className="border-t border-green-800 pt-3 text-sm"><b>Cloud Status</b><div className="text-xs text-green-300">🟢 Data synchronized</div></div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="bg-amber-100 px-4 py-1 text-center text-xs font-semibold text-amber-900">Prototype dataset — all statistics, credits and incentive amounts are fictional demonstration data.</div>
        <header id="overview" className="flex flex-wrap items-center gap-3 p-4 lg:px-8">
          <button className="lg:hidden" aria-label="Menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
          <div className="min-w-0 flex-1"><p className="text-xs text-green-800">🏛️ BioBalance Government Portal · Agricultural Sustainability & Biodiversity Monitoring System</p>
            <h1 className="text-2xl font-bold text-green-950">Government Overview</h1><p className="text-sm text-stone-600">Verified information received from participating farms.</p></div>
          <Search size={18} /><Bell size={18} /><span className="rounded-full bg-green-800 px-3 py-1 text-sm text-white">Government Admin</span>
          <span className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-stone-300">{period}</span>
        </header>
        <div className="flex flex-wrap gap-4 px-4 pb-4 lg:px-8">
          <Sel label="Monitoring Period" v={period} o={["Current Season", "Previous Season", "Year"]} on={setPeriod} />
          <Sel label="Region" v={region} o={["All", ...REGS]} on={setRegion} />
          <Sel label="Status" v={status} o={["All", "Verified", "Pending", "Needs Support"]} on={setStatus} />
        </div>

        <div className="space-y-6 px-4 pb-10 lg:px-8">
          {/* Section 1: KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[["Participating Farmers", k.farms.toLocaleString("en-IN"), "Verified farms"], ["Average BioBalance Score", `${k.score} / 100`, "↑ 8.4% from baseline"],
              ["Total BioBalance Credits", k.cred.toLocaleString("en-IN"), "Verified credits"], ["Economically Viable Farms", `${k.viable}%`, "Above farmer-defined livelihood threshold"],
              ["Biodiversity Improvement", `+${k.bio}%`, "Average improvement from baseline"], ["Proposed Incentive Requirement", `₹${k.pool} Cr`, "Prototype estimate"]].map(([l, v, sub]) => (
              <div key={l} className="rounded-2xl bg-gradient-to-br from-white to-green-50 p-5 shadow-sm ring-1 ring-green-100"><div className="text-sm text-stone-600">{l}</div><div className="mt-1 text-3xl font-bold text-green-900">{v}</div><div className="text-xs text-stone-500">{sub}</div></div>))}
          </div>

          {/* Section 2: Farmer table */}
          <Card id="farmers" title="Verified Farmer Records">
            <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-sm">
              <thead><tr className="border-b text-stone-500">{["Farmer ID", "Region", "Farm Size", "Economic", "Biodiversity", "BioBalance", "Credits", "Improvement", "Verification", "Incentive Status"].map(h => <th key={h} className="py-2 pr-3">{h}</th>)}</tr></thead>
              <tbody>{table.map(f => <tr key={f.id} onClick={() => setSel(f)} className="cursor-pointer border-b border-stone-100 hover:bg-green-50">
                <td className="py-2 font-semibold">{f.id}</td><td>{f.place}, {f.region}</td><td>{f.acres} acres</td><td>{f.eco}</td><td>{f.bio}</td><td>{score(f)}</td><td>{f.credits}</td>
                <td className="text-green-700">+{f.imp}</td><td><Pill t={f.ver} /></td><td><Pill t={incOf(f)} /></td></tr>)}</tbody></table>
              {!table.length && <p className="py-4 text-sm text-stone-500">No sample records match these filters.</p>}</div>
            <p className="mt-2 text-xs text-stone-500">Select a row for the farmer summary. Farmer IDs are anonymous.</p>
          </Card>

          {/* Section 4: Scatter */}
          <Card id="balance" title="Economic Viability vs Biodiversity">
            <div className="mb-2 flex flex-wrap gap-3 text-xs">{CATS.map(c => <span key={c} className="flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[c] }} />{c}</span>)}</div>
            <ResponsiveContainer width="100%" height={360}><ScatterChart margin={{ top: 10, right: 20, bottom: 25, left: 0 }}><CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="eco" domain={[30, 100]} label={{ value: "Economic Score", position: "insideBottom", offset: -12 }} />
              <YAxis type="number" dataKey="bio" domain={[25, 100]} label={{ value: "Biodiversity Score", angle: -90, position: "insideLeft" }} />
              <Tooltip content={({ active, payload }: any) => { if (!active || !payload?.length) return null; const f: Farm = payload[0].payload
                return <div className="rounded-lg bg-white p-2 text-xs shadow ring-1 ring-stone-200"><b>{f.id}</b> · {f.region}<br />Economic {f.eco} · Biodiversity {f.bio}<br />BioBalance {score(f)} · Credits {f.credits}</div> }} />
              {CATS.map(c => <Scatter key={c} data={dots.filter(f => catOf(f) === c)} fill={COLORS[c]} />)}</ScatterChart></ResponsiveContainer>
          </Card>

          {/* Section 5: Credits by practice */}
          <Card id="credits" title="BioBalance Credits by Practice">
            <ResponsiveContainer width="100%" height={300}><BarChart data={PRACTICE_CREDITS} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="p" width={130} /><Tooltip /><Bar dataKey="v" name="Credits" fill="#166534" radius={4} /></BarChart></ResponsiveContainer>
            <p className="text-xs text-stone-500">Shows which sustainability practices are adopted most. Prototype weights; would need ecological validation.</p>
          </Card>

          {/* Section 6: Regional */}
          <Card id="regional" title="Regional Sustainability Overview">
            <Sel label="Sort by" v={{ score: "BioBalance", bio: "Biodiversity", cred: "Credits", imp: "Improvement", farms: "Number of farms" }[sort]} o={["BioBalance", "Biodiversity", "Credits", "Improvement", "Number of farms"]}
              on={x => setSort(({ BioBalance: "score", Biodiversity: "bio", Credits: "cred", Improvement: "imp", "Number of farms": "farms" } as const)[x as "BioBalance"])} />
            <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b text-stone-500">{["Region", "Farms", "Avg BioBalance", "Biodiversity", "Avg Credits", "Improvement"].map(h => <th key={h} className="py-2">{h}</th>)}</tr></thead>
              <tbody>{rows.map(r => <tr key={r.r} className="border-b border-stone-100"><td className="py-2 font-semibold">{r.r}</td><td>{r.farms.toLocaleString("en-IN")}</td><td>{r.score}</td><td>{r.bio}</td><td>{r.cred}</td><td className="text-green-700">+{r.imp}%</td></tr>)}</tbody></table></div>
            <p className="mt-2 text-xs text-stone-500">All values are fictional demonstration data.</p>
          </Card>

          {/* Section 7: Insights */}
          <Card title="🌱 Government Insights">
            <div className="grid gap-3 md:grid-cols-2">{[["Biodiversity Opportunity", "1,248 verified farms show strong economic viability but relatively low biodiversity scores. These farms may be suitable for targeted biodiversity-support programs."],
              ["Economic Support", "642 farms are below their selected livelihood threshold and may require technical or financial support."], ["High Improvement", "2,180 farms have improved their BioBalance Score by more than 20 points from baseline."],
              ["Practice Adoption", "Crop diversification is currently the most frequently verified ecological practice."]].map(([t, b]) => <div key={t} className="rounded-xl bg-green-50 p-4"><div className="font-semibold text-green-900">{t}</div><p className="text-sm">{b}</p></div>)}</div>
            <p className="mt-2 text-xs text-stone-500">Generated from the mock dataset, not real statistics.</p>
          </Card>

          {/* Section 8: Incentives */}
          <Card id="incentives" title="Proposed Incentive Allocation">
            <div className="grid gap-3 md:grid-cols-3">{[["Basic Support", "50–69", "3,420", "₹10,000"], ["Enhanced Support", "70–84", "4,120", "₹20,000"], ["High-Performance Support", "85–100", "886", "₹30,000"]].map(([t, r, n, a]) =>
              <div key={t} className="rounded-xl bg-green-50 p-4"><div className="font-semibold text-green-900">{t}</div><div className="text-sm">BioBalance: {r}</div><div className="text-sm">Eligible farms: {n}</div><div className="text-lg font-bold text-green-800">{a}</div><div className="text-xs text-stone-500">Prototype support</div></div>)}</div>
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-sm font-semibold text-amber-900">Prototype incentive framework. Actual eligibility, amounts and funding decisions would be determined by the responsible government authority.</p>
          </Card>

          {/* Section 9: Verification */}
          <Card id="verification" title="Verification Status">
            <div className="grid gap-3 sm:grid-cols-3">{[["🟢 Verified", "10,842"], ["🟡 Pending", "1,326"], ["🔴 Requires Review", "380"]].map(([l, v]) => <div key={l} className="rounded-xl bg-stone-50 p-4"><div className="text-sm">{l}</div><div className="text-2xl font-bold">{v}</div></div>)}</div>
            <div className="my-3 flex gap-2">{["All", "Verified", "Pending", "Requires Review"].map(o => <button key={o} onClick={() => setVf(o)} className={`rounded-full px-3 py-1 text-sm ${vf === o ? "bg-green-800 text-white" : "bg-stone-100"}`}>{o}</button>)}</div>
            <div className="overflow-x-auto"><table className="w-full min-w-[500px] text-left text-sm"><thead><tr className="border-b text-stone-500">{["Farmer ID", "Practice", "Evidence", "Status", "Credits"].map(h => <th key={h} className="py-2">{h}</th>)}</tr></thead>
              <tbody>{VERIFS.filter(v => vf === "All" || v.st === vf).map(v => <tr key={v.id + v.practice} className="border-b border-stone-100"><td className="py-2 font-semibold">{v.id}</td><td>{v.practice}</td><td>{v.ev}</td><td><Pill t={v.st} /></td><td>{v.c}</td></tr>)}</tbody></table></div>
          </Card>

          {/* Section 10: Data flow */}
          <Card id="flow" title="Data Flow">
            <div className="flex flex-col items-center gap-1 text-center text-sm font-semibold">
              {["👨‍🌾 Farmer", "Farm Data + Practices", "⚖️ BioBalance Engine", "Economic + Biodiversity Analysis", "🔐 Verification", "☁️ Cloud", "🏛️ Government Dashboard", "📊 Monitor", "💰 Incentive / Support Planning"].map((t, i, a) => (
                <div key={t} className="flex flex-col items-center gap-1"><span className={`rounded-xl px-5 py-2 ${i % 2 === 0 ? "bg-green-800 text-white" : "bg-green-100 text-green-900"}`}>{t}</span>{i < a.length - 1 && <ChevronDown size={18} className="text-green-700" />}</div>))}
            </div>
          </Card>

          {/* Section 12: Responsible data */}
          <Card title="Responsible Data Use">
            <ul className="grid gap-1 text-sm sm:grid-cols-2">{["Use verified information", "Protect farmer privacy", "Display only necessary information", "Make credit calculations explainable", "Use scores to identify support opportunities", "Allow human review before incentive decisions"].map(t => <li key={t}>✓ {t}</li>)}</ul>
            <p className="mt-2 text-xs text-stone-500">Neutral language only: High improvement · Economically viable · Biodiversity improving · Needs support · Verification pending.</p>
          </Card>
          <h2 className="pt-4 text-center text-xl font-semibold text-green-900">🌱 “Measure sustainability. Recognize effort. Support farmers. Protect biodiversity.”</h2>
        </div>
      </main>

      {/* Section 3: Farmer drawer */}
      {sel && (() => {
        const rev = Math.round(sel.acres * 31500 / 1000) * 1000, cost = Math.round(sel.acres * 17300 / 1000) * 1000, profit = rev - cost, sc = score(sel)
        const support = sel.id === "BB-1025" ? 25000 : sc >= 85 ? 30000 : sc >= 70 ? 20000 : sc >= 50 ? 10000 : 0
        const prac = ["Crop diversification", "Crop rotation", "Pollinator habitat", "Water-efficient irrigation", "Native vegetation"].slice(0, Math.max(2, Math.ceil(sel.bio / 15)))
        return (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSel(null)}>
            <aside className="h-full w-full max-w-md space-y-4 overflow-y-auto bg-white p-6 text-sm" onClick={e => e.stopPropagation()}>
              <button aria-label="Close" className="float-right rounded p-1 hover:bg-stone-100" onClick={() => setSel(null)}><X size={18} /></button>
              <h3 className="text-2xl font-bold text-green-900">Farmer {sel.id}</h3>
              <div><b>Farm Overview</b><p>{sel.place}, {sel.region} · {sel.acres} acres · 2026 Season</p></div>
              <div><b>Economic Performance · {sel.eco} / 100</b><p>Expected revenue {inr(rev)} · Estimated cultivation cost {inr(cost)} · Estimated profit {inr(profit)}</p><p>Farmer's minimum acceptable profit: {inr(60000)}</p><Pill t={profit >= 60000 ? "🟢 Above Livelihood Guard" : "Needs Support"} /></div>
              <div><b>Biodiversity Performance · {sel.bio} / 100</b><ul>{prac.map(p => <li key={p}>{p} ✓</li>)}</ul></div>
              <div><b>BioBalance Credits · {sel.credits}</b><p>Crop diversification +10 · Crop rotation +10 · Pollinator habitat +8 · Native vegetation +15 · Water efficiency +8 · Other verified practices +{Math.max(0, sel.credits - 51)}</p></div>
              <div><b>Baseline Comparison</b><div className="mt-1 flex justify-between"><span>Before: {sc - sel.imp}</span><span>Current: {sc}</span><span className="font-bold text-green-700">+{sel.imp}</span></div><Bar2 v={sc - sel.imp} /><div className="mt-1"><Bar2 v={sc} /></div></div>
              <div><b>Verification</b> <Pill t={sel.ver} /><p>Sample evidence: practice declaration, farm photographs, location verification</p></div>
              <div className="rounded-xl bg-green-50 p-3"><b>Incentive Status: {incOf(sel)}</b><p>Potential support: {inr(support)}</p><p className="text-xs text-stone-500">Prototype estimate — subject to government policy and verification rules.</p></div>
              <div className="flex flex-wrap gap-2">{["View Evidence", "Review Record", "Add to Support Program"].map(b => <button key={b} className="rounded-lg border border-green-800 px-3 py-2 text-green-800 hover:bg-green-50">{b}</button>)}</div>
            </aside>
          </div>)
      })()}
    </div>
  )
}

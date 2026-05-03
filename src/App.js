import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:"#f5f5f7", bgDark:"#1d1d1f", bgCard:"#ffffff", bgCardHov:"#f0f0f2",
  text:"#1d1d1f", textSub:"#6e6e73", textLight:"#a1a1a6",
  border:"#d2d2d7", borderSub:"#e8e8ed", white:"#ffffff",
  accent:"#0071e3", red:"#ff3b30",
};

const CATEGORIES = [
  { id:"founders",     label:"Founders & Builders" },
  { id:"investors",    label:"Investors & Capital" },
  { id:"commencement", label:"Commencement Speeches" },
  { id:"cnbc",         label:"Classic TV & Archives" },
  { id:"tech",         label:"Tech Visionaries" },
  { id:"leadership",   label:"Leadership & Culture" },
  { id: "wef",         label: "WEF Davos 2026" },
];

const TALKS = [
  { id:1,  title:"The Lost Interview",               person:"Steve Jobs",     org:"Apple · NeXT",              year:1995, duration:"1h 12m", category:["featured","tech","founders"],              tags:["Vision","Creativity","Failure"],           featured:true,  accent:"#ff6b35", description:"Filmed just before his return to Apple, Jobs speaks candidly about being ousted, building NeXT, and what makes great products. Raw, unfiltered, prophetic.",                            youtubeId:"GnO7D5UaDig" },
  { id:2,  title:"University of Georgia Q&A",        person:"Warren Buffett", org:"Berkshire Hathaway",        year:2001, duration:"58m",    category:["featured","investors","commencement"],     tags:["Investing","Life Advice","Integrity"],     featured:true,  accent:"#2563eb", description:"Buffett takes unscripted questions from students — covering careers, integrity, and why your inner scorecard matters more than the outer one.",                                          youtubeId:"2MHIcabnjrA" },
  { id:3,  title:"Regret Minimization Framework",    person:"Jeff Bezos",     org:"Amazon",                    year:2008, duration:"3m",     category:["featured","founders","tech"],              tags:["Decision Making","Risk","Entrepreneurship"],featured:true, accent:"#f59e0b", description:"In minutes, Bezos explains the mental model that led him to leave Wall Street and start Amazon — imagine yourself at 80 looking back.",                                                    youtubeId:"jwG_qR6XmDQ" },
  { id:4,  title:"Stanford Commencement 2005",       person:"Steve Jobs",     org:"Apple",                     year:2005, duration:"15m",    category:["commencement","tech"],                     tags:["Purpose","Death","Passion"],               featured:false, accent:"#7c3aed", description:"Three stories. Connecting the dots. Love and loss. Death. One of the greatest commencement addresses ever delivered.",                                                                    youtubeId:"UF8uR6Z6KLc" },
  { id:5,  title:"Psychology of Human Misjudgment",  person:"Charlie Munger", org:"Berkshire Hathaway",        year:1995, duration:"1h 5m",  category:["investors","leadership"],                  tags:["Mental Models","Psychology","Wisdom"],     featured:false, accent:"#059669", description:"Munger's legendary Harvard speech laying out 25 cognitive biases — arguably the most important talk in investing history.",                                                              youtubeId:"pqzcCfUglws" },
  { id:6,  title:"Stanford Q&A — Before It All",     person:"Elon Musk",      org:"SpaceX · Tesla",            year:2003, duration:"45m",    category:["founders","tech"],                         tags:["First Principles","Risk","Space"],          featured:false, accent:"#dc2626", description:"A young Musk explains why he's betting everything on rockets and electric cars despite near-certain failure.",                                                                            youtubeId:"tnBQmEqBCY0" },
  { id:7,  title:"Harvard Commencement 2007",        person:"Bill Gates",     org:"Microsoft · Gates Foundation",year:2007, duration:"22m",  category:["commencement","tech","leadership"],        tags:["Inequality","Purpose","Privilege"],         featured:false, accent:"#0891b2", description:"Gates returns to Harvard — which he dropped out of — and delivers a call to action on global inequality.",                                                                             youtubeId:"wug9n5Atk8c" },
  { id:8,  title:"The Netflix Culture Deck",         person:"Reed Hastings",  org:"Netflix",                   year:2009, duration:"35m",    category:["founders","leadership"],                   tags:["Culture","Talent","Freedom"],               featured:false, accent:"#e11d48", description:"The talk that shaped Silicon Valley's approach to culture — radical honesty, no vacation policy, paying top of market.",                                                                  youtubeId:"o3e1lnixKBM" },
  { id:9,  title:"One Up on Wall Street",            person:"Peter Lynch",    org:"Fidelity Magellan",         year:1994, duration:"42m",    category:["investors","cnbc"],                        tags:["Stock Picking","Research","Common Sense"],  featured:false, accent:"#16a34a", description:"Lynch explains how ordinary people have an edge over Wall Street by investing in companies they know from daily life.",                                                                    youtubeId:"TGa-1D-O_e4" },
  { id:10, title:"Harvard Commencement 2013",        person:"Oprah Winfrey",  org:"OWN Network",               year:2013, duration:"30m",    category:["commencement","leadership"],               tags:["Failure","Resilience","Purpose"],           featured:false, accent:"#b45309", description:"Oprah opens up about being fired from her first TV job and how each failure pointed her toward her calling.",                                                                             youtubeId:"GMoqkWMKGqE" },
  { id:11, title:"Execution, Candor & GE",           person:"Jack Welch",     org:"General Electric",          year:2005, duration:"48m",    category:["cnbc","leadership"],                       tags:["Management","Differentiation","Candor"],    featured:false, accent:"#4f46e5", description:"The man who made GE the world's most valuable company shares his controversial management philosophy.",                                                                                   youtubeId:"eO2i4_EoJBM" },
  { id:12, title:"Building Starbucks",               person:"Howard Schultz", org:"Starbucks",                 year:2011, duration:"55m",    category:["founders","cnbc"],                         tags:["Culture","Brand","Comeback"],               featured:false, accent:"#065f46", description:"Schultz recounts growing up poor, discovering Italian espresso, and returning to rescue a struggling Starbucks.",                                                                         youtubeId:"0SKmjGHVEBs" },
  { id:13, title:"Principles for Life & Work",       person:"Ray Dalio",      org:"Bridgewater Associates",    year:2017, duration:"1h 10m", category:["investors","leadership"],                  tags:["Transparency","Mistakes","Principles"],     featured:false, accent:"#1d4ed8", description:"Dalio walks through principles developed after near-bankruptcy in 1982 — a framework built on radical truth.",                                                                              youtubeId:"B9XGUpQZY38" },
  { id:14, title:"The Retail Revolution",            person:"Sam Walton",     org:"Walmart",                   year:1992, duration:"38m",    category:["cnbc","founders"],                         tags:["Retail","Frugality","Scale"],               featured:false, accent:"#0369a1", description:"A rare archival interview with America's greatest retailer — obsessive frugality and customer obsession.",                                                                               youtubeId:"oN7DTmLBOsY" },
  { id:15, title:"How to Get Rich",                  person:"Naval Ravikant", org:"AngelList",                 year:2018, duration:"2h 10m", category:["investors","founders"],                    tags:["Wealth","Leverage","Specificity"],          featured:false, accent:"#6d28d9", description:"Naval explains specific knowledge, leverage, and why you should never rent out your time to get wealthy.",                                                                                 youtubeId:"1-TZqOsVCNM" },
  { id:16, title:"Microsoft's Lost Decade",          person:"Steve Ballmer",  org:"Microsoft",                 year:2013, duration:"50m",    category:["cnbc","tech"],                             tags:["Mobile","Transition","Lessons"],            featured:false, accent:"#be123c", description:"A candid interview where Ballmer reflects on missing mobile and what he would have done differently.",                                                                                    youtubeId:"Vhh_GeBPOhs" },
  { id: 17,  title: "WEF Davos 2026 — Conversation with Elon Musk",  person: "Elon Musk",  org: "Tesla · SpaceX · xAI",  year: 2026,  duration: "45m",  category: ["featured", "tech", "founders"],  tags: ["AI", "Future", "Innovation", "Davos"],  featured: false,  accent: "#dc2626",  description: "Elon Musk joins BlackRock CEO Larry Fink at WEF Davos 2026 to discuss AI, robotics, energy, and the technologies he believes will shape the next decade.", youtubeId: "IgifEgm1-e0"  },
  { id: 18,  title: "WEF Davos 2026 — Conversation with Jamie Dimon",  person: "Jamie Dimon",  org: "JPMorgan Chase",  year: 2026,  duration: "50m",  category: ["investors", "leadership", "cnbc"],  tags: ["Banking", "AI", "Economy", "Davos"],  featured: false,  accent: "#2563eb",  description: "JPMorgan CEO Jamie Dimon speaks candidly with The Economist editor-in-chief on AI, geopolitics, tariffs, US growth, and the qualities that made JPMorgan the world's most powerful bank.",  youtubeId: "TEhy1JtzxIc" },
  { id: 19,  title: "WEF Davos 2026 — Conversation with Jensen Huang",  person: "Jensen Huang",  org: "NVIDIA",  year: 2026,  duration: "40m",  category: ["tech", "founders", "investors"],  tags: ["AI", "Chips", "Infrastructure", "Davos"],  featured: false,  accent: "#16a34a", description: "NVIDIA CEO Jensen Huang — making his first-ever Davos appearance — talks to Larry Fink about AI as a platform shift, the future of computing, jobs, and why every nation needs its own AI.",  youtubeId: "hoDYYCyxMuE" },
];

// ─── ICONS ─────────────────────────────────────────────────────────────────────
const IPlay  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg>;
const IClose = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ISearch= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IChevR = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>;
const IChevL = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>;
const IPlus  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IBook  = ({on}) => <svg viewBox="0 0 24 24" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const IUser  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IOut   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IList  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;

// ─── STORAGE ───────────────────────────────────────────────────────────────────
const store = {
  get:(k)=>{ try{return JSON.parse(localStorage.getItem(k))}catch{return null} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v))}catch{} },
};

// ─── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({ onLogin, onClose }) {
  const [mode, setMode]   = useState("login");
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");
  const inp = { width:"100%", padding:"11px 14px", border:`1px solid ${T.border}`,
    borderRadius:"10px", fontSize:"14px", color:T.text, background:T.bg,
    outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

  const submit = () => {
    setErr("");
    if (!email||!pass) return setErr("Please fill all fields.");
    if (mode==="signup"&&!name) return setErr("Please enter your name.");
    const users = store.get("eksoch_users")||{};
    if (mode==="signup") {
      if (users[email]) return setErr("Account already exists. Please log in.");
      const u = { name:name.trim(), email, password:pass, watchlist:[], joined:new Date().toISOString() };
      users[email]=u; store.set("eksoch_users",users); onLogin(u);
    } else {
      const u = users[email];
      if (!u) return setErr("No account found. Please sign up.");
      if (u.password!==pass) return setErr("Incorrect password.");
      onLogin(u);
    }
  };

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:2000,
      background:"rgba(29,29,31,0.72)",backdropFilter:"blur(20px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"400px",
        background:T.white,borderRadius:"24px",padding:"40px",
        boxShadow:"0 40px 100px rgba(0,0,0,0.25)" }}>
        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:"28px" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
            <div style={{ width:"32px",height:"32px",background:T.text,borderRadius:"8px",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontFamily:"Georgia,serif",fontSize:"16px",color:T.white,fontStyle:"italic" }}>E</span>
            </div>
            <span style={{ fontFamily:"Georgia,serif",fontSize:"20px",color:T.text }}>
              EkSoch<span style={{ color:T.accent }}>.AI</span>
            </span>
          </div>
          <p style={{ margin:0,fontSize:"14px",color:T.textSub }}>
            {mode==="login"?"Welcome back — sign in to your account":"Create your free account"}
          </p>
        </div>
        {/* Toggle */}
        <div style={{ display:"flex",background:T.bg,borderRadius:"12px",padding:"4px",marginBottom:"22px" }}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{
              flex:1,padding:"9px",borderRadius:"9px",border:"none",cursor:"pointer",
              fontSize:"13px",fontWeight:"600",fontFamily:"inherit",
              background:mode===m?T.white:"transparent",
              color:mode===m?T.text:T.textSub,
              boxShadow:mode===m?"0 1px 4px rgba(0,0,0,0.1)":"none",
              transition:"all 0.18s" }}>
              {m==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px" }}>
          {mode==="signup"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inp}/>}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email" style={inp}/>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password" type="password" style={inp}
            onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        {err&&<p style={{ margin:"10px 0 0",fontSize:"13px",color:T.red,textAlign:"center" }}>{err}</p>}
        <button onClick={submit} style={{ width:"100%",marginTop:"18px",padding:"13px",
          background:T.text,color:T.white,border:"none",borderRadius:"12px",
          fontSize:"15px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit" }}>
          {mode==="login"?"Log In":"Create Account"}
        </button>
        <p style={{ margin:"14px 0 0",fontSize:"12px",color:T.textLight,textAlign:"center" }}>
          {mode==="login"?"No account? ":"Already have one? "}
          <button onClick={()=>setMode(mode==="login"?"signup":"login")}
            style={{ background:"none",border:"none",color:T.accent,fontSize:"12px",
              cursor:"pointer",fontFamily:"inherit",fontWeight:"600" }}>
            {mode==="login"?"Sign up free":"Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── USER MENU ─────────────────────────────────────────────────────────────────
function UserMenu({ user, onLogout, onWatchlist, wlCount }) {
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",fn);
    return()=>document.removeEventListener("mousedown",fn);
  },[]);
  const initials=user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return (
    <div ref={ref} style={{ position:"relative",flexShrink:0 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ display:"flex",alignItems:"center",
        gap:"8px",background:open?T.bgCardHov:T.white,border:`1px solid ${T.border}`,
        borderRadius:"100px",padding:"5px 12px 5px 5px",cursor:"pointer" }}>
        <div style={{ width:"26px",height:"26px",borderRadius:"50%",background:T.accent,
          color:T.white,fontSize:"11px",fontWeight:"700",
          display:"flex",alignItems:"center",justifyContent:"center" }}>{initials}</div>
        <span style={{ fontSize:"13px",fontWeight:"500",color:T.text }}>{user.name.split(" ")[0]}</span>
      </button>
      {open&&(
        <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",background:T.white,
          border:`1px solid ${T.border}`,borderRadius:"16px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.12)",width:"210px",padding:"8px",zIndex:500 }}>
          <div style={{ padding:"12px 12px 10px",borderBottom:`1px solid ${T.borderSub}`,marginBottom:"6px" }}>
            <div style={{ fontSize:"13px",fontWeight:"600",color:T.text }}>{user.name}</div>
            <div style={{ fontSize:"11px",color:T.textLight,marginTop:"2px" }}>{user.email}</div>
          </div>
          <button onClick={()=>{onWatchlist();setOpen(false);}} style={{ width:"100%",
            display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",
            borderRadius:"10px",border:"none",background:"none",cursor:"pointer",
            fontFamily:"inherit",color:T.text,fontSize:"13px",fontWeight:"500",textAlign:"left" }}>
            <span style={{ color:T.textSub }}><IList/></span>
            My Watchlist
            {wlCount>0&&<span style={{ marginLeft:"auto",background:T.accent,color:T.white,
              borderRadius:"100px",fontSize:"10px",fontWeight:"700",padding:"1px 7px" }}>{wlCount}</span>}
          </button>
          <button onClick={()=>{onLogout();setOpen(false);}} style={{ width:"100%",
            display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",
            borderRadius:"10px",border:"none",background:"none",cursor:"pointer",
            fontFamily:"inherit",color:T.red,fontSize:"13px",fontWeight:"500",textAlign:"left" }}>
            <IOut/> Log Out
          </button>
        </div>
      )}
    </div>
  );
}

// ─── WATCHLIST PANEL ───────────────────────────────────────────────────────────
function WatchlistPanel({ user, talks, onSelect, onRemove, onClose }) {
  const saved=talks.filter(t=>user.watchlist.includes(t.id));
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:1500,
      background:"rgba(29,29,31,0.5)",backdropFilter:"blur(12px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ position:"absolute",right:0,top:0,bottom:0,
        width:"min(400px,100%)",background:T.white,
        boxShadow:"-20px 0 60px rgba(0,0,0,0.15)",display:"flex",flexDirection:"column",
        animation:"slideInRight 0.28s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ padding:"28px 24px 18px",borderBottom:`1px solid ${T.borderSub}` }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <h2 style={{ margin:0,fontFamily:"Georgia,serif",fontSize:"21px",
                fontWeight:"400",color:T.text }}>My Watchlist</h2>
              <p style={{ margin:"4px 0 0",fontSize:"13px",color:T.textSub }}>
                {saved.length} saved talk{saved.length!==1?"s":""}</p>
            </div>
            <button onClick={onClose} style={{ width:"32px",height:"32px",borderRadius:"50%",
              background:T.bg,border:`1px solid ${T.border}`,color:T.textSub,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <IClose/>
            </button>
          </div>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"14px 16px" }}>
          {saved.length===0?(
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div style={{ fontSize:"36px",marginBottom:"12px" }}>🔖</div>
              <p style={{ color:T.textSub,fontSize:"14px",lineHeight:"1.6" }}>
                No talks saved yet.<br/>Tap the bookmark icon on any talk.
              </p>
            </div>
          ):saved.map(item=>(
            <div key={item.id} style={{ display:"flex",gap:"12px",padding:"12px",
              borderRadius:"12px",marginBottom:"8px",background:T.bg,
              border:`1px solid ${T.borderSub}`,alignItems:"center" }}>
              <div style={{ width:"42px",height:"42px",borderRadius:"10px",flexShrink:0,
                background:`linear-gradient(135deg,${item.accent}28,${item.accent}08)`,
                border:`1px solid ${item.accent}25`,
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontFamily:"Georgia,serif",fontSize:"14px",color:item.accent,fontStyle:"italic" }}>
                  {item.person.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:"10px",color:item.accent,fontWeight:"600",
                  letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"2px" }}>{item.person}</div>
                <div style={{ fontSize:"13px",color:T.text,fontFamily:"Georgia,serif",
                  lineHeight:"1.3",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{item.title}</div>
                <div style={{ fontSize:"11px",color:T.textLight,marginTop:"2px" }}>{item.year} · {item.duration}</div>
              </div>
              <div style={{ display:"flex",gap:"6px",flexShrink:0 }}>
                <button onClick={()=>{onSelect(item);onClose();}} style={{ width:"30px",height:"30px",
                  borderRadius:"50%",background:T.accent,border:"none",color:T.white,
                  cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <IPlay/>
                </button>
                <button onClick={()=>onRemove(item.id)} style={{ width:"30px",height:"30px",
                  borderRadius:"50%",background:"none",border:`1px solid ${T.border}`,
                  color:T.textSub,cursor:"pointer",fontSize:"16px",
                  display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SEARCH OVERLAY ────────────────────────────────────────────────────────────
function SearchOverlay({ talks, onSelect, onClose }) {
  const [q,setQ]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>{ inputRef.current?.focus(); },[]);
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[onClose]);

  const results=q.length<2?[]:talks.filter(t=>
    t.title.toLowerCase().includes(q.toLowerCase())||
    t.person.toLowerCase().includes(q.toLowerCase())||
    t.tags.some(tag=>tag.toLowerCase().includes(q.toLowerCase()))||
    t.org.toLowerCase().includes(q.toLowerCase())||
    String(t.year).includes(q)
  ).slice(0,8);

  const hl=(text)=>{
    if(!q)return text;
    const idx=text.toLowerCase().indexOf(q.toLowerCase());
    if(idx===-1)return text;
    return <>{text.slice(0,idx)}<mark style={{ background:`${T.accent}20`,color:T.accent,
      borderRadius:"2px",padding:"0 1px" }}>{text.slice(idx,idx+q.length)}</mark>{text.slice(idx+q.length)}</>;
  };

  const HINTS=["Steve Jobs","Warren Buffett","Elon Musk","Commencement","Investing","Leadership"];

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:2000,
      background:"rgba(29,29,31,0.65)",backdropFilter:"blur(20px)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"80px 24px 24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"600px",
        background:T.white,borderRadius:"20px",boxShadow:"0 40px 100px rgba(0,0,0,0.3)",overflow:"hidden" }}>
        {/* Input */}
        <div style={{ display:"flex",alignItems:"center",gap:"10px",padding:"16px 20px",
          borderBottom:results.length?`1px solid ${T.borderSub}`:"none" }}>
          <span style={{ color:T.textSub,flexShrink:0 }}><ISearch/></span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search by name, topic, year, company..."
            style={{ flex:1,border:"none",outline:"none",fontSize:"16px",
              color:T.text,background:"none",fontFamily:"inherit" }}/>
          {q&&<button onClick={()=>setQ("")} style={{ background:"none",border:"none",
            color:T.textLight,cursor:"pointer",fontSize:"20px",lineHeight:1,padding:"0 4px" }}>×</button>}
          <button onClick={onClose} style={{ background:T.bg,border:`1px solid ${T.border}`,
            borderRadius:"8px",padding:"5px 10px",fontSize:"12px",color:T.textSub,
            cursor:"pointer",fontFamily:"inherit",flexShrink:0 }}>Esc</button>
        </div>
        {/* Results */}
        {results.length>0&&(
          <div style={{ maxHeight:"400px",overflowY:"auto" }}>
            {results.map((item,i)=>(
              <div key={item.id} onClick={()=>{onSelect(item);onClose();}}
                style={{ display:"flex",gap:"14px",padding:"14px 20px",cursor:"pointer",
                  borderBottom:i<results.length-1?`1px solid ${T.borderSub}`:"none",
                  transition:"background 0.12s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ width:"40px",height:"40px",borderRadius:"10px",flexShrink:0,
                  background:`linear-gradient(135deg,${item.accent}25,${item.accent}08)`,
                  border:`1px solid ${item.accent}22`,
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontFamily:"Georgia,serif",fontSize:"13px",color:item.accent,fontStyle:"italic" }}>
                    {item.person.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:"10px",color:item.accent,fontWeight:"700",
                    letterSpacing:"0.5px",textTransform:"uppercase",marginBottom:"2px" }}>
                    {hl(item.person)} · {item.org}</div>
                  <div style={{ fontSize:"14px",color:T.text,fontFamily:"Georgia,serif",marginBottom:"2px" }}>
                    {hl(item.title)}</div>
                  <div style={{ fontSize:"11px",color:T.textLight }}>{item.year} · {item.duration}</div>
                </div>
                <span style={{ color:T.textLight,display:"flex",alignItems:"center",flexShrink:0 }}><IPlay/></span>
              </div>
            ))}
          </div>
        )}
        {q.length>=2&&results.length===0&&(
          <div style={{ padding:"36px 20px",textAlign:"center",color:T.textSub,fontSize:"14px" }}>
            No results for <strong style={{ color:T.text }}>"{q}"</strong>
          </div>
        )}
        {q.length<2&&(
          <div style={{ padding:"16px 20px",display:"flex",gap:"8px",flexWrap:"wrap" }}>
            {HINTS.map(h=>(
              <button key={h} onClick={()=>setQ(h)} style={{ padding:"6px 14px",borderRadius:"100px",
                border:`1px solid ${T.borderSub}`,background:T.bg,color:T.textSub,
                fontSize:"12px",fontWeight:"500",cursor:"pointer",fontFamily:"inherit" }}>{h}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TALK CARD ─────────────────────────────────────────────────────────────────
function TalkCard({ item, onClick, onToggle, inWL, user }) {
  const [hov,setHov]=useState(false);
  const ini=item.person.split(" ").map(w=>w[0]).join("").slice(0,2);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ flexShrink:0,width:"200px",background:hov?T.bgCardHov:T.bgCard,
        border:`1px solid ${hov?T.border:T.borderSub}`,borderRadius:"16px",overflow:"hidden",
        cursor:"pointer",transition:"all 0.22s ease",
        transform:hov?"translateY(-4px)":"none",
        boxShadow:hov?"0 12px 40px rgba(0,0,0,0.12)":"0 2px 8px rgba(0,0,0,0.04)" }}>
      <div onClick={()=>onClick(item)} style={{ height:"110px",position:"relative",
        display:"flex",alignItems:"center",justifyContent:"center",
        borderBottom:`1px solid ${T.borderSub}`,
        background:`linear-gradient(145deg,${item.accent}18,${item.accent}06)` }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:"40px",color:item.accent,
          opacity:0.18,userSelect:"none",letterSpacing:"-2px" }}>{ini}</div>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",
          background:item.accent,opacity:0.7 }}/>
        <div style={{ position:"absolute",bottom:"10px",left:"12px",background:T.white,
          border:`1px solid ${T.borderSub}`,borderRadius:"6px",padding:"2px 8px",
          fontSize:"10px",color:T.textSub }}>{item.year}</div>
        {/* Bookmark btn */}
        {user&&(
          <button onClick={e=>{e.stopPropagation();onToggle(item.id);}}
            style={{ position:"absolute",top:"8px",right:"8px",width:"28px",height:"28px",
              borderRadius:"50%",background:inWL?T.accent:"rgba(255,255,255,0.92)",
              border:inWL?"none":`1px solid ${T.border}`,color:inWL?T.white:T.textSub,
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 2px 8px rgba(0,0,0,0.1)",transition:"all 0.18s",zIndex:2 }}>
            <IBook on={inWL}/>
          </button>
        )}
        {hov&&(
          <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",
            justifyContent:"center",background:"rgba(255,255,255,0.5)",backdropFilter:"blur(2px)" }}>
            <div style={{ width:"36px",height:"36px",borderRadius:"50%",background:T.white,
              boxShadow:"0 4px 16px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",
              justifyContent:"center",color:item.accent }}><IPlay/></div>
          </div>
        )}
      </div>
      <div onClick={()=>onClick(item)} style={{ padding:"14px 14px 16px" }}>
        <div style={{ fontSize:"10px",fontWeight:"600",color:item.accent,
          letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"4px" }}>{item.person}</div>
        <div style={{ fontSize:"13px",fontFamily:"Georgia,serif",color:T.text,
          lineHeight:"1.35",marginBottom:"8px",display:"-webkit-box",
          WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{item.title}</div>
        <div style={{ fontSize:"11px",color:T.textLight }}>{item.duration}</div>
      </div>
    </div>
  );
}

// ─── SCROLL ROW ────────────────────────────────────────────────────────────────
function ScrollRow({ label, items, onSelect, onToggle, watchlist, user }) {
  const ref=useRef(null);
  if(!items.length)return null;
  return (
    <div style={{ marginBottom:"52px" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"18px" }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:"12px" }}>
          <h2 style={{ margin:0,fontFamily:"Georgia,serif",fontSize:"22px",
            fontWeight:"400",color:T.text,letterSpacing:"-0.3px" }}>{label}</h2>
          <span style={{ fontSize:"12px",color:T.textLight }}>{items.length} talks</span>
        </div>
        <div style={{ display:"flex",gap:"6px" }}>
          {[IChevL,IChevR].map((Icon,i)=>(
            <button key={i} onClick={()=>ref.current?.scrollBy({left:(i?1:-1)*460,behavior:"smooth"})}
              style={{ width:"28px",height:"28px",borderRadius:"50%",background:T.white,
                border:`1px solid ${T.border}`,color:T.textSub,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center" }}><Icon/></button>
          ))}
        </div>
      </div>
      <div ref={ref} style={{ display:"flex",gap:"14px",overflowX:"auto",paddingBottom:"8px",scrollbarWidth:"none" }}>
        {items.map(item=>(
          <TalkCard key={item.id} item={item} onClick={onSelect}
            onToggle={onToggle} inWL={watchlist.includes(item.id)} user={user}/>
        ))}
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero({ items, onSelect }) {
  const [idx,setIdx]=useState(0);
  const featured=items.filter(i=>i.featured);
  const item=featured[idx%featured.length];
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>i+1),6500); return()=>clearInterval(t); },[]);
  return (
    <div style={{ margin:"0 0 52px",borderRadius:"20px",overflow:"hidden",
      position:"relative",background:T.bgDark,minHeight:"400px",display:"flex" }}>
      <div style={{ position:"absolute",inset:0,transition:"background 1s",
        background:`radial-gradient(ellipse at 70% 50%,${item.accent}22 0%,transparent 60%)` }}/>
      <div style={{ position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",
        justifyContent:"center",padding:"52px 56px",maxWidth:"580px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"18px" }}>
          <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:item.accent }}/>
          <span style={{ fontSize:"11px",fontWeight:"600",color:"rgba(255,255,255,0.45)",
            letterSpacing:"1.2px",textTransform:"uppercase" }}>Featured Talk</span>
        </div>
        <div style={{ fontSize:"13px",color:item.accent,fontWeight:"600",marginBottom:"10px" }}>
          {item.person} · {item.org}</div>
        <h1 style={{ margin:"0 0 14px",fontFamily:"Georgia,serif",
          fontSize:"clamp(24px,3.5vw,40px)",fontWeight:"400",
          color:T.white,lineHeight:"1.15",letterSpacing:"-0.5px" }}>{item.title}</h1>
        <p style={{ margin:"0 0 24px",fontSize:"15px",color:"rgba(255,255,255,0.58)",
          fontWeight:"300",lineHeight:"1.65" }}>{item.description}</p>
        <div style={{ display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"28px" }}>
          {item.tags.map(t=>(
            <span key={t} style={{ fontSize:"11px",fontWeight:"500",color:"rgba(255,255,255,0.5)",
              background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.1)",
              padding:"4px 12px",borderRadius:"100px" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex",gap:"12px" }}>
          <button onClick={()=>onSelect(item)} style={{ display:"flex",alignItems:"center",
            gap:"8px",background:T.white,color:T.text,border:"none",borderRadius:"100px",
            padding:"13px 28px",fontSize:"14px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit" }}>
            <IPlay/> Watch Now</button>
          <button onClick={()=>onSelect(item)} style={{ background:"rgba(255,255,255,0.1)",
            color:T.white,border:"1px solid rgba(255,255,255,0.15)",borderRadius:"100px",
            padding:"13px 24px",fontSize:"14px",fontWeight:"500",cursor:"pointer",
            backdropFilter:"blur(8px)",fontFamily:"inherit" }}>More Info</button>
        </div>
      </div>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:"45%",
        display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        <div style={{ fontFamily:"Georgia,serif",fontSize:"clamp(120px,16vw,200px)",
          fontWeight:"400",fontStyle:"italic",color:item.accent,opacity:0.07,
          userSelect:"none",letterSpacing:"-8px",lineHeight:1,transition:"color 1s" }}>
          {item.person.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
      </div>
      <div style={{ position:"absolute",bottom:"24px",left:"56px",display:"flex",gap:"6px" }}>
        {featured.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)} style={{
            width:i===idx%featured.length?"20px":"6px",height:"6px",borderRadius:"3px",
            background:i===idx%featured.length?item.accent:"rgba(255,255,255,0.25)",
            border:"none",cursor:"pointer",padding:0,transition:"all 0.3s" }}/>
        ))}
      </div>
    </div>
  );
}

// ─── WATCH MODAL ───────────────────────────────────────────────────────────────
function WatchModal({ item, onClose, onToggle, inWL, user }) {
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[onClose]);
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:1000,
      background:"rgba(29,29,31,0.75)",backdropFilter:"blur(20px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"720px",
        background:T.white,borderRadius:"20px",overflow:"hidden",
        boxShadow:"0 40px 100px rgba(0,0,0,0.3)" }}>
        <div style={{ position:"relative",paddingBottom:"56.25%",background:"#000" }}>
          <iframe src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
            title={item.title} allow="autoplay; encrypted-media" allowFullScreen
            style={{ position:"absolute",inset:0,width:"100%",height:"100%",border:"none" }}/>
        </div>
        <div style={{ padding:"24px 28px 28px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px" }}>
            <div style={{ flex:1,paddingRight:"14px" }}>
              <div style={{ fontSize:"11px",fontWeight:"600",color:item.accent,
                letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"5px" }}>
                {item.person} · {item.org}</div>
              <h2 style={{ margin:"0 0 5px",fontFamily:"Georgia,serif",fontSize:"22px",
                fontWeight:"400",color:T.text }}>{item.title}</h2>
              <div style={{ fontSize:"13px",color:T.textLight }}>{item.year} · {item.duration}</div>
            </div>
            <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
              {user&&(
                <button onClick={()=>onToggle(item.id)} style={{ display:"flex",alignItems:"center",
                  gap:"6px",padding:"8px 16px",borderRadius:"100px",
                  background:inWL?T.accent:T.bg,border:`1px solid ${inWL?T.accent:T.border}`,
                  color:inWL?T.white:T.textSub,cursor:"pointer",fontSize:"12px",fontWeight:"600",
                  fontFamily:"inherit",transition:"all 0.18s" }}>
                  <IBook on={inWL}/>{inWL?"Saved":"Save"}
                </button>
              )}
              <button onClick={onClose} style={{ width:"34px",height:"34px",borderRadius:"50%",
                background:T.bg,border:`1px solid ${T.border}`,color:T.textSub,
                cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><IClose/></button>
            </div>
          </div>
          <div style={{ height:"1px",background:T.borderSub,margin:"0 0 14px" }}/>
          <p style={{ margin:"0 0 16px",fontSize:"14px",lineHeight:"1.7",color:T.textSub,fontWeight:"300" }}>
            {item.description}</p>
          <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
            {item.tags.map(t=>(
              <span key={t} style={{ fontSize:"11px",fontWeight:"500",color:item.accent,
                background:`${item.accent}12`,border:`1px solid ${item.accent}28`,
                padding:"4px 12px",borderRadius:"100px" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ─────────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdd }) {
  const [f,setF]=useState({ title:"",person:"",org:"",year:"",duration:"",
    youtubeId:"",description:"",tags:"",category:"founders",accent:"#0071e3" });
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!f.title||!f.person||!f.youtubeId)return;
    onAdd({...f,id:Date.now(),year:parseInt(f.year)||2024,
      tags:f.tags.split(",").map(t=>t.trim()).filter(Boolean),
      category:[f.category],featured:false});
    onClose();
  };
  const inp={ width:"100%",padding:"10px 14px",border:`1px solid ${T.border}`,
    borderRadius:"10px",fontSize:"14px",color:T.text,background:T.bg,
    outline:"none",fontFamily:"inherit",boxSizing:"border-box" };
  const L=({c})=><label style={{ display:"block",marginBottom:"5px",fontSize:"11px",
    fontWeight:"600",color:T.textSub,letterSpacing:"0.5px",textTransform:"uppercase" }}>{c}</label>;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:1000,
      background:"rgba(29,29,31,0.55)",backdropFilter:"blur(16px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:"24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:"100%",maxWidth:"480px",
        background:T.white,borderRadius:"20px",padding:"32px",
        boxShadow:"0 40px 100px rgba(0,0,0,0.2)",maxHeight:"85vh",overflowY:"auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"22px" }}>
          <h2 style={{ margin:0,fontFamily:"Georgia,serif",fontSize:"21px",fontWeight:"400",color:T.text }}>
            Add a Talk</h2>
          <button onClick={onClose} style={{ width:"30px",height:"30px",borderRadius:"50%",
            background:T.bg,border:`1px solid ${T.border}`,color:T.textSub,
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><IClose/></button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:"13px" }}>
          {[["Talk Title *","title","e.g. The Lost Interview"],
            ["Speaker Name *","person","e.g. Steve Jobs"],["Organisation","org","e.g. Apple · NeXT"],
            ["YouTube Video ID *","youtubeId","e.g. GnO7D5UaDig"],
            ["Year","year","e.g. 1995"],["Duration","duration","e.g. 1h 12m"],
            ["Tags (comma separated)","tags","Vision, Creativity, Failure"]
          ].map(([label,key,ph])=>(
            <div key={key}><L c={label}/>
              <input value={f[key]} onChange={e=>upd(key,e.target.value)} placeholder={ph} style={inp}/>
            </div>
          ))}
          <div><L c="Description"/>
            <textarea value={f.description} onChange={e=>upd("description",e.target.value)}
              placeholder="Brief description..." rows={3} style={{...inp,resize:"vertical",lineHeight:"1.5"}}/>
          </div>
          <div><L c="Category"/>
            <select value={f.category} onChange={e=>upd("category",e.target.value)} style={{...inp,cursor:"pointer"}}>
              {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:"14px" }}>
            <div><L c="Card Colour"/>
              <input type="color" value={f.accent} onChange={e=>upd("accent",e.target.value)}
                style={{ width:"48px",height:"38px",borderRadius:"8px",
                  border:`1px solid ${T.border}`,cursor:"pointer",padding:"2px" }}/>
            </div>
            <div style={{ flex:1,height:"38px",borderRadius:"10px",marginTop:"20px",
              background:`${f.accent}18`,border:`2px solid ${f.accent}30`,
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:"12px",color:f.accent,fontWeight:"600" }}>Preview</span>
            </div>
          </div>
        </div>
        <button onClick={submit} style={{ width:"100%",marginTop:"22px",padding:"13px",
          background:T.text,color:T.white,border:"none",borderRadius:"12px",
          fontSize:"15px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit" }}>
          Add to Library
        </button>
      </div>
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ cat, setCat, user, onLogin, onLogout, onWatchlist, wlCount, onSearch }) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  return (
    <nav style={{ position:"sticky",top:0,zIndex:100,
      background:scrolled?"rgba(245,245,247,0.88)":"rgba(245,245,247,0.97)",
      backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
      borderBottom:`1px solid ${scrolled?T.border:"transparent"}`,transition:"all 0.2s" }}>
      <div style={{ maxWidth:"1280px",margin:"0 auto",padding:"0 32px",
        height:"60px",display:"flex",alignItems:"center",gap:"20px" }}>
        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:"8px",flexShrink:0 }}>
          <div style={{ width:"28px",height:"28px",background:T.text,borderRadius:"7px",
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontFamily:"Georgia,serif",fontSize:"15px",color:T.white,fontStyle:"italic" }}>E</span>
          </div>
          <span style={{ fontFamily:"Georgia,serif",fontSize:"18px",color:T.text,letterSpacing:"-0.3px" }}>
            EkSoch<span style={{ color:T.accent }}>.AI</span>
          </span>
        </div>
        {/* Pills */}
        <div style={{ display:"flex",gap:"3px",overflowX:"auto",flex:1,scrollbarWidth:"none" }}>
          {[{id:"all",label:"All"},...CATEGORIES].map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} style={{ flexShrink:0,
              padding:"5px 13px",borderRadius:"100px",fontSize:"12px",fontFamily:"inherit",
              fontWeight:cat===c.id?"600":"400",
              color:cat===c.id?T.white:T.textSub,
              background:cat===c.id?T.text:"transparent",
              border:`1px solid ${cat===c.id?T.text:"transparent"}`,
              cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap" }}>{c.label}</button>
          ))}
        </div>
        {/* Right */}
        <div style={{ display:"flex",alignItems:"center",gap:"8px",flexShrink:0 }}>
          <button onClick={onSearch} style={{ display:"flex",alignItems:"center",gap:"8px",
            background:T.white,border:`1px solid ${T.border}`,borderRadius:"10px",
            padding:"7px 14px",cursor:"pointer",color:T.textSub,fontSize:"13px",fontFamily:"inherit" }}>
            <ISearch/> Search
            <span style={{ fontSize:"10px",color:T.textLight,background:T.bg,
              border:`1px solid ${T.borderSub}`,borderRadius:"5px",padding:"1px 5px" }}>⌘K</span>
          </button>
          {user?(
            <UserMenu user={user} onLogout={onLogout} onWatchlist={onWatchlist} wlCount={wlCount}/>
          ):(
            <button onClick={onLogin} style={{ display:"flex",alignItems:"center",gap:"7px",
              background:T.text,color:T.white,border:"none",borderRadius:"100px",
              padding:"8px 16px",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit" }}>
              <IUser/> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [talks,setTalks]           = useState(TALKS);
  const [selected,setSelected]     = useState(null);
  const [showAdd,setShowAdd]       = useState(false);
  const [showAuth,setShowAuth]     = useState(false);
  const [showSearch,setShowSearch] = useState(false);
  const [showWL,setShowWL]         = useState(false);
  const [cat,setCat]               = useState("all");
  const [user,setUser]             = useState(()=>store.get("eksoch_session"));

  useEffect(()=>{
    const fn=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setShowSearch(true);}};
    window.addEventListener("keydown",fn);
    return()=>window.removeEventListener("keydown",fn);
  },[]);

  const saveUser=(u)=>{ store.set("eksoch_session",u); setUser(u); };
  const handleLogin=(u)=>{ saveUser(u); setShowAuth(false); };
  const handleLogout=()=>{ store.set("eksoch_session",null); setUser(null); };

  const toggleWL=(id)=>{
    if(!user){ setShowAuth(true); return; }
    const users=store.get("eksoch_users")||{};
    const wl=user.watchlist||[];
    const updated=wl.includes(id)?wl.filter(x=>x!==id):[...wl,id];
    const u={...user,watchlist:updated};
    users[user.email]=u; store.set("eksoch_users",users); saveUser(u);
  };

  const watchlist=user?.watchlist||[];
  const filtered=cat==="all"?talks:talks.filter(t=>t.category.includes(cat));
  const getRow=id=>filtered.filter(i=>i.category.includes(id));
  const isDefault=cat==="all";

  return (
    <div style={{ minHeight:"100vh",background:T.bg,fontFamily:"system-ui,sans-serif" }}>
      <style>{`
        @keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
        *{box-sizing:border-box} ::-webkit-scrollbar{display:none}
        button,input,select,textarea{font-family:inherit}
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      <Nav cat={cat} setCat={setCat} user={user} onLogin={()=>setShowAuth(true)}
        onLogout={handleLogout} onWatchlist={()=>setShowWL(true)}
        wlCount={watchlist.length} onSearch={()=>setShowSearch(true)}/>

      <main style={{ maxWidth:"1280px",margin:"0 auto",padding:"36px 32px 80px" }}>
        {isDefault&&<Hero items={talks} onSelect={setSelected}/>}

        {!isDefault&&(
          <div style={{ marginBottom:"32px" }}>
            <h1 style={{ margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:"32px",
              fontWeight:"400",color:T.text,letterSpacing:"-0.5px" }}>
              {CATEGORIES.find(c=>c.id===cat)?.label}</h1>
            <p style={{ margin:0,fontSize:"14px",color:T.textSub }}>
              {filtered.length} talk{filtered.length!==1?"s":""}</p>
          </div>
        )}

        {!isDefault&&(
          <div style={{ display:"flex",flexWrap:"wrap",gap:"14px",marginBottom:"52px" }}>
            {filtered.map(item=>(
              <TalkCard key={item.id} item={item} onClick={setSelected}
                onToggle={toggleWL} inWL={watchlist.includes(item.id)} user={user}/>
            ))}
          </div>
        )}

        {isDefault&&CATEGORIES.map(c=>(
          <ScrollRow key={c.id} label={c.label} items={getRow(c.id)}
            onSelect={setSelected} onToggle={toggleWL} watchlist={watchlist} user={user}/>
        ))}

        {/* Add talk CTA */}
        <div style={{ padding:"28px 32px",background:T.white,border:`1px solid ${T.borderSub}`,
          borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"24px" }}>
          <div>
            <h3 style={{ margin:"0 0 4px",fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"400",color:T.text }}>
              Know a great talk?</h3>
            <p style={{ margin:0,fontSize:"13px",color:T.textSub }}>
              Add any YouTube talk — CEO interviews, speeches, fireside chats.</p>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{ display:"flex",alignItems:"center",
            gap:"8px",background:T.text,color:T.white,border:"none",borderRadius:"100px",
            padding:"11px 20px",fontSize:"13px",fontWeight:"600",cursor:"pointer",flexShrink:0 }}>
            <IPlus/> Add a Talk
          </button>
        </div>
      </main>

      <footer style={{ borderTop:`1px solid ${T.borderSub}`,padding:"24px 32px",
        maxWidth:"1280px",margin:"0 auto",
        display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Georgia,serif",fontSize:"15px",color:T.textLight,fontStyle:"italic" }}>
          EkSoch<span style={{ color:`${T.accent}88` }}>.AI</span></span>
        <span style={{ fontSize:"12px",color:T.textLight }}>
          {talks.length} curated talks · Wisdom on Demand</span>
      </footer>

      {selected&&<WatchModal item={selected} onClose={()=>setSelected(null)}
        onToggle={toggleWL} inWL={watchlist.includes(selected.id)} user={user}/>}
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={t=>setTalks(p=>[...p,t])}/>}
      {showAuth&&<AuthModal onLogin={handleLogin} onClose={()=>setShowAuth(false)}/>}
      {showSearch&&<SearchOverlay talks={talks} onSelect={setSelected} onClose={()=>setShowSearch(false)}/>}
      {showWL&&user&&<WatchlistPanel user={user} talks={talks} onSelect={setSelected}
        onRemove={toggleWL} onClose={()=>setShowWL(false)}/>}
    </div>
  );
}

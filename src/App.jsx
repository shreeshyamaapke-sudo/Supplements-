import { useState, useEffect } from "react";

const SUPPLEMENTS = {
  morning: {
    label: "🌅 Subah",
    time: "8:00 AM",
    color: "#F59E0B",
    items: [
      { id: "d3k2", name: "D3 + K2", brand: "Tata", note: "Khane ke saath" },
      { id: "fishoil", name: "Fish Oil / Algae Omega-3", brand: "Carbamide Forte", note: "Khane ke saath" },
      { id: "zinc", name: "Zinc Picolinate + Vit C", brand: "Carbamide Forte", note: "Khane ke saath" },
    ],
  },
  lunch: {
    label: "☀️ Dopahar",
    time: "1:00 PM",
    color: "#10B981",
    items: [
      { id: "coq10", name: "CoQ10 200mg + Selenium", brand: "Carbamide Forte", note: "Khane ke beech" },
    ],
  },
  evening: {
    label: "🌰 Shaam Snack",
    time: "4:30 PM",
    color: "#6366F1",
    items: [
      { id: "nuts", name: "Nuts + Seeds + Makhana", brand: "Daily Snack", note: "Mutthi bhar" },
    ],
  },
  night: {
    label: "🌙 Raat",
    time: "9:30 PM",
    color: "#8B5CF6",
    items: [
      { id: "triphal", name: "Triphal Powder Mix (15g)", brand: "Triphal", note: "Garam dudh + ghee + mishri" },
      { id: "shilajit", name: "Shilajit", brand: "Zandu", note: "Dudh ke saath" },
      { id: "lcarnitine", name: "L-Carnitine Tartrate", brand: "Carbamide Forte", note: "Dudh ke 10 min baad" },
    ],
  },
};

const REMINDER_TIMES = {
  morning: { hour: 8, minute: 0 },
  lunch: { hour: 13, minute: 0 },
  evening: { hour: 16, minute: 30 },
  night: { hour: 21, minute: 30 },
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getStreak(history) {
  let streak = 0;
  const today = getTodayKey();
  let d = new Date();
  while (true) {
    const key = d.toISOString().split("T")[0];
    if (key === today) { d.setDate(d.getDate() - 1); continue; }
    const dayData = history[key];
    if (!dayData) break;
    const all = Object.values(SUPPLEMENTS).flatMap(s => s.items);
    const done = all.filter(i => dayData[i.id]).length;
    if (done < all.length) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function App() {
  const [checked, setChecked] = useState({});
  const [history, setHistory] = useState({});
  const [notifGranted, setNotifGranted] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const [showMotivation, setShowMotivation] = useState(false);

  const todayKey = getTodayKey();

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("supp_history") || "{}");
      setHistory(stored);
      setChecked(stored[todayKey] || {});
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const updated = { ...history, [todayKey]: checked };
      localStorage.setItem("supp_history", JSON.stringify(updated));
      setHistory(updated);
    } catch {}
  }, [checked]);

  const requestNotif = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifGranted(perm === "granted");
      if (perm === "granted") scheduleReminders();
    }
  };

  const scheduleReminders = () => {
    const msgs = {
      morning: "🌅 Subah ke supplements lo! D3 + Fish Oil + Zinc",
      lunch: "☀️ CoQ10 lena mat bhoolo!",
      evening: "🌰 Shaam ka snack time — Nuts + Makhana!",
      night: "🌙 Raat ka Triphal + Shilajit + L-Carnitine pi lo!",
    };
    Object.entries(REMINDER_TIMES).forEach(([slot, { hour, minute }]) => {
      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      const delay = target - now;
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("💊 Supplement Reminder", { body: msgs[slot], icon: "/favicon.ico" });
        }
      }, delay);
    });
  };

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allItems = Object.values(SUPPLEMENTS).flatMap(s => s.items);
  const totalDone = allItems.filter(i => checked[i.id]).length;
  const totalCount = allItems.length;
  const percent = Math.round((totalDone / totalCount) * 100);

  const streak = getStreak(history);

  const motivations = [
    "90 din baad results khud bolenge! 💪",
    "Aaj ka consistency = Kal ki fertility 🌱",
    "Stack pe ₹10,000+ laga diye — waste mat karo! 🔥",
    "Har supplement ek step hai goal ki taraf! 🎯",
    "Body repair mode ON hai — bas support karo! ⚡",
  ];

  const todayDate = new Date().toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0f0a 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0",
      padding: "0 0 80px 0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0d1117 0%, transparent 100%)",
        padding: "24px 20px 16px",
        position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Health Aapki</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f0fdf4" }}>💊 Supplement Tracker</div>
              <div style={{ fontSize: 12, color: "#4ade80", marginTop: 2 }}>{todayDate}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `conic-gradient(#4ade80 ${percent * 3.6}deg, #1f2937 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "#0a0a0f",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexDirection: "column",
                }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#4ade80", lineHeight: 1 }}>{percent}%</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{totalDone}/{totalCount} liye</div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <div style={{
              flex: 1, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 12, padding: "10px 14px", textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#4ade80" }}>🔥 {streak}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Din ki streak</div>
            </div>
            <div style={{
              flex: 1, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "10px 14px", textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#818cf8" }}>{Object.keys(history).length}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Total din track</div>
            </div>
            <div style={{
              flex: 1, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 12, padding: "10px 14px", textAlign: "center"
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>90</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Din ka goal</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

        {/* Notification button */}
        {!notifGranted && (
          <div style={{
            marginTop: 16,
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)",
            borderRadius: 14, padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>🔔 Reminders Enable Karo</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>4 baar daily reminder aayega</div>
            </div>
            <button onClick={requestNotif} style={{
              background: "#fbbf24", color: "#000", border: "none",
              borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>Enable</button>
          </div>
        )}

        {notifGranted && (
          <div style={{
            marginTop: 16,
            background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: 14, padding: "10px 16px", fontSize: 12, color: "#4ade80"
          }}>
            ✅ Reminders ON hain — 4 baar aayenge daily!
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Aaj ki progress</span>
            <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>{totalDone} of {totalCount} complete</span>
          </div>
          <div style={{ height: 8, background: "#1f2937", borderRadius: 99 }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${percent}%`,
              background: percent === 100
                ? "linear-gradient(90deg, #4ade80, #22d3ee)"
                : "linear-gradient(90deg, #4ade80, #86efac)",
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Supplement Slots */}
        {Object.entries(SUPPLEMENTS).map(([slot, { label, time, color, items }]) => {
          const slotDone = items.filter(i => checked[i.id]).length;
          const slotComplete = slotDone === items.length;
          return (
            <div key={slot} style={{ marginTop: 20 }}>
              {/* Slot header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 4, height: 20, background: color, borderRadius: 99 }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>{label}</span>
                  <span style={{
                    fontSize: 11, color: color, background: `${color}18`,
                    border: `1px solid ${color}40`,
                    borderRadius: 20, padding: "2px 10px"
                  }}>{time}</span>
                </div>
                <span style={{ fontSize: 12, color: slotComplete ? "#4ade80" : "#6b7280" }}>
                  {slotComplete ? "✅ Done!" : `${slotDone}/${items.length}`}
                </span>
              </div>

              {/* Items */}
              {items.map(item => {
                const done = !!checked[item.id];
                return (
                  <div key={item.id}
                    onClick={() => toggle(item.id)}
                    style={{
                      background: done
                        ? `linear-gradient(135deg, ${color}15, ${color}08)`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${done ? color + "40" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 14, padding: "14px 16px",
                      marginBottom: 8, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 14,
                      transition: "all 0.2s ease",
                      opacity: done ? 1 : 0.85,
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      border: `2px solid ${done ? color : "#374151"}`,
                      background: done ? color : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {done && <span style={{ fontSize: 14, color: "#000", fontWeight: 900 }}>✓</span>}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600,
                        color: done ? "#f0fdf4" : "#d1d5db",
                        textDecoration: done ? "none" : "none",
                      }}>{item.name}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: done ? color : "#6b7280" }}>{item.brand}</span>
                        <span style={{ fontSize: 10, color: "#4b5563" }}>•</span>
                        <span style={{ fontSize: 11, color: "#4b5563" }}>{item.note}</span>
                      </div>
                    </div>

                    {done && <span style={{ fontSize: 18 }}>💚</span>}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* All done celebration */}
        {percent === 100 && (
          <div style={{
            marginTop: 24,
            background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,211,238,0.1))",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 18, padding: "20px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 36 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#4ade80", marginTop: 8 }}>
              Aaj ka stack complete!
            </div>
            <div style={{ fontSize: 13, color: "#86efac", marginTop: 6 }}>
              Body repair mode ON hai — great work bhai! 💪
            </div>
          </div>
        )}

        {/* Motivation */}
        <div style={{ marginTop: 20 }}>
          <button onClick={() => setShowMotivation(!showMotivation)} style={{
            width: "100%",
            background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 14, padding: "12px",
            color: "#a78bfa", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            💡 Motivation chahiye?
          </button>
          {showMotivation && (
            <div style={{
              marginTop: 8,
              background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)",
              borderRadius: 14, padding: "16px",
              fontSize: 14, color: "#c4b5fd", lineHeight: 1.7, textAlign: "center"
            }}>
              {motivations[Math.floor(Math.random() * motivations.length)]}
            </div>
          )}
        </div>

        {/* History */}
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>📅 Pichle Din</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {Array.from({ length: 14 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (13 - i));
              const key = d.toISOString().split("T")[0];
              const dayData = history[key] || {};
              const done = allItems.filter(item => dayData[item.id]).length;
              const isToday = key === todayKey;
              const pct = Math.round((done / totalCount) * 100);
              const dayName = d.toLocaleDateString("en", { weekday: "narrow" });
              const dayNum = d.getDate();
              return (
                <div key={key} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#4b5563", marginBottom: 4 }}>{dayName}</div>
                  <div style={{
                    width: "100%", aspectRatio: "1",
                    borderRadius: 8,
                    background: pct === 0 ? "#111827"
                      : pct === 100 ? "linear-gradient(135deg, #4ade80, #22d3ee)"
                      : `rgba(74,222,128,${pct / 100 * 0.7})`,
                    border: isToday ? "2px solid #4ade80" : "1px solid #1f2937",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: isToday ? 800 : 600,
                    color: pct === 100 ? "#000" : pct > 0 ? "#4ade80" : "#374151",
                  }}>
                    {dayNum}
                  </div>
                  <div style={{ fontSize: 9, color: "#4b5563", marginTop: 3 }}>{pct > 0 ? `${pct}%` : ""}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset today */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button onClick={() => setChecked({})} style={{
            background: "transparent", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "8px 20px",
            color: "rgba(239,68,68,0.6)", fontSize: 12, cursor: "pointer",
          }}>
            🔄 Aaj reset karo
          </button>
        </div>

      </div>
    </div>
  );
                         }

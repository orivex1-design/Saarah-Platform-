import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── CONFIG — Apni keys yahan daalo ───────────────────────────────────────
const SUPABASE_URL = "https://tlcwmknpjaewfmquiutb.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // Baad mein add karenge
const RAZORPAY_KEY = "YOUR_RAZORPAY_KEY_ID"; // Apni Razorpay key yahan

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── COLORS ───────────────────────────────────────────────────────────────
const C = {
  bg: "#08080e", surface: "#0f0f18", card: "#13131e",
  border: "#ffffff0d", borderGlow: "#ff3d6e33",
  accent: "#ff3d6e", accentSoft: "#ff3d6e1a", accentMid: "#ff3d6e44",
  pink: "#ff6b9d", gold: "#ffcc44", goldSoft: "#ffcc441a",
  cyan: "#00d4ff", cyanSoft: "#00d4ff15",
  purple: "#b06cff", purpleSoft: "#b06cff18",
  text: "#f2f2f8", muted: "#6b6b85", dim: "#3a3a55",
  success: "#00e676", successSoft: "#00e67618",
};

// ─── SAARAH PROFILE ───────────────────────────────────────────────────────
const SAARAH = {
  name: "Saarah",
  handle: "@its_s4arah",
  bio: "Your favourite desi girl 🌸 Exclusive content, behind-the-scenes, fashion, life & more. Only for my special fans 💕",
  location: "Lucknow, India 🕌",
  upiId: "saarah@upi",
  subscriptionINR: { monthly: 199, yearly: 1799 },
};

const GIFTS = [
  { emoji: "🌹", name: "Rose", priceINR: 49 },
  { emoji: "💎", name: "Diamond", priceINR: 499 },
  { emoji: "🧿", name: "Nazar", priceINR: 99 },
  { emoji: "👑", name: "Crown", priceINR: 999 },
  { emoji: "🔥", name: "Fire", priceINR: 79 },
  { emoji: "🫶", name: "Love", priceINR: 149 },
  { emoji: "🌙", name: "Moon", priceINR: 199 },
  { emoji: "💐", name: "Bouquet", priceINR: 299 },
];

const INR_TIPS = [49, 99, 199, 499, 999, 2999];

function inr(amount) { return `₹${amount}`; }

// ─── RAZORPAY PAYMENT ─────────────────────────────────────────────────────
function openRazorpay({ amount, description, fanEmail, fanName, onSuccess }) {
  const options = {
    key: RAZORPAY_KEY,
    amount: amount * 100,
    currency: "INR",
    name: "Saarah",
    description: description,
    image: "https://i.imgur.com/n5tjHFD.png",
    prefill: { name: fanName || "", email: fanEmail || "" },
    theme: { color: "#ff3d6e" },
    handler: function (response) { onSuccess(response); },
    modal: { ondismiss: function () { console.log("Payment cancelled"); } },
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}

// ─── FAN AUTH MODAL ───────────────────────────────────────────────────────
function FanAuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase
          .from("fans")
          .select("*")
          .eq("email", email)
          .single();
        if (error || !data) { setMsg("Fan not found. Please sign up first!"); }
        else { onLogin(data); onClose(); }
      } else {
        if (!name) { setMsg("Please enter your name!"); setLoading(false); return; }
        const { data, error } = await supabase
          .from("fans")
          .insert([{ email, name }])
          .select()
          .single();
        if (error) { setMsg("Email already registered. Please login!"); }
        else { onLogin(data); onClose(); }
      }
    } catch (e) { setMsg("Something went wrong. Try again!"); }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000d0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.borderGlow}`, borderRadius: 24, padding: "28px 24px", width: 360, maxWidth: "95vw", boxShadow: "0 40px 80px #000c" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💕</div>
          <div style={{ fontWeight: 900, fontSize: 20, color: C.text }}>{isLogin ? "Welcome Back!" : "Join Saarah's World"}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{isLogin ? "Login to access exclusive content" : "Create your fan account"}</div>
        </div>
        {!isLogin && (
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" style={{ width: "100%", background: "#ffffff08", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit" }} />
        )}
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your Email" type="email" style={{ width: "100%", background: "#ffffff08", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16, fontFamily: "inherit" }} />
        {msg && <div style={{ color: C.accent, fontSize: 12, marginBottom: 12, textAlign: "center" }}>{msg}</div>}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: "#fff", border: "none", borderRadius: 14, padding: "13px", fontWeight: 900, fontSize: 15, cursor: "pointer", marginBottom: 14 }}>
          {loading ? "Please wait..." : isLogin ? "Login 💕" : "Join Now 🌸"}
        </button>
        <div style={{ textAlign: "center", color: C.muted, fontSize: 13 }}>
          {isLogin ? "New fan? " : "Already a fan? "}
          <span onClick={() => { setIsLogin(!isLogin); setMsg(""); }} style={{ color: C.pink, cursor: "pointer", fontWeight: 700 }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── TIP MODAL ─────────────────────────────────────────────────────────────
function TipModal({ fan, onClose, onAuthRequired }) {
  const [amount, setAmount] = useState(99);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  const handleTip = async () => {
    if (!fan) { onAuthRequired(); onClose(); return; }
    openRazorpay({
      amount, description: `Tip to Saarah${msg ? ` — "${msg}"` : ""}`,
      fanEmail: fan.email, fanName: fan.name,
      onSuccess: async (response) => {
        await supabase.from("payments").insert([{
          fan_id: fan.id, type: "tip", amount_inr: amount,
          razorpay_payment_id: response.razorpay_payment_id,
          message: msg, status: "success"
        }]);
        setDone(true);
        setTimeout(onClose, 2500);
      }
    });
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }}>
      <div style={{ background: C.card, borderRadius: 24, padding: "40px 32px", textAlign: "center", border: `1px solid ${C.borderGlow}` }}>
        <div style={{ fontSize: 52 }}>💸</div>
        <div style={{ color: C.success, fontWeight: 900, fontSize: 20, marginTop: 12 }}>Tip Sent! 💕</div>
        <div style={{ color: C.muted, marginTop: 6 }}>Saarah received your {inr(amount)} tip</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.borderGlow}`, borderRadius: 24, padding: "28px 24px", width: 380, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 4 }}>Send Saarah a Tip 💸</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Show your love & support 💕</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {INR_TIPS.map(p => (
            <button key={p} onClick={() => setAmount(p)} style={{ background: amount === p ? C.accent : "#ffffff08", color: amount === p ? "#fff" : C.muted, border: `1px solid ${amount === p ? C.accent : C.border}`, borderRadius: 9, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {inr(p)}
            </button>
          ))}
        </div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min={1} style={{ width: "100%", background: "#ffffff08", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px", color: C.accent, fontSize: 26, fontWeight: 900, textAlign: "center", outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "monospace" }} />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Leave a sweet message for Saarah… (optional)" rows={3} style={{ width: "100%", background: "#ffffff08", border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", color: C.text, fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 18, fontFamily: "inherit" }} />
        <button onClick={handleTip} style={{ width: "100%", background: `linear-gradient(135deg, ${C.gold}, ${C.accent})`, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
          💸 Tip {inr(amount)}
        </button>
      </div>
    </div>
  );
}

// ─── GIFT MODAL ────────────────────────────────────────────────────────────
function GiftModal({ fan, onClose, onAuthRequired }) {
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const handleGift = async () => {
    if (!fan) { onAuthRequired(); onClose(); return; }
    if (!selected) return;
    openRazorpay({
      amount: selected.priceINR,
      description: `${selected.emoji} ${selected.name} Gift for Saarah`,
      fanEmail: fan.email, fanName: fan.name,
      onSuccess: async (response) => {
        await supabase.from("payments").insert([{
          fan_id: fan.id, type: "gift", amount_inr: selected.priceINR,
          razorpay_payment_id: response.razorpay_payment_id,
          message: selected.name, status: "success"
        }]);
        setDone(true);
        setTimeout(onClose, 2500);
      }
    });
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }}>
      <div style={{ background: C.card, borderRadius: 24, padding: "40px 32px", textAlign: "center", border: `1px solid ${C.borderGlow}` }}>
        <div style={{ fontSize: 52 }}>{selected?.emoji}</div>
        <div style={{ color: C.success, fontWeight: 900, fontSize: 20, marginTop: 12 }}>Gift Sent!</div>
        <div style={{ color: C.muted, marginTop: 6 }}>{selected?.name} delivered to Saarah 💕</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.borderGlow}`, borderRadius: 24, padding: "28px 24px", width: 400, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 20 }}>Send a Gift 🎁</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {GIFTS.map(g => (
            <div key={g.name} onClick={() => setSelected(g)} style={{ background: selected?.name === g.name ? C.accentSoft : "#ffffff06", border: `1.5px solid ${selected?.name === g.name ? C.accent : C.border}`, borderRadius: 14, padding: "12px 6px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 26 }}>{g.emoji}</div>
              <div style={{ fontSize: 10, color: C.text, fontWeight: 600, marginTop: 4 }}>{g.name}</div>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 800 }}>{inr(g.priceINR)}</div>
            </div>
          ))}
        </div>
        <button onClick={handleGift} disabled={!selected} style={{ width: "100%", background: selected ? `linear-gradient(135deg, #ff6b00, ${C.accent})` : "#ffffff10", color: selected ? "#fff" : C.muted, border: "none", borderRadius: 14, padding: "14px", fontWeight: 900, fontSize: 15, cursor: selected ? "pointer" : "default" }}>
          {selected ? `🎁 Send ${selected.emoji} — ${inr(selected.priceINR)}` : "Select a gift first"}
        </button>
      </div>
    </div>
  );
}

// ─── SUBSCRIBE MODAL ───────────────────────────────────────────────────────
function SubscribeModal({ fan, onClose, onAuthRequired }) {
  const [plan, setPlan] = useState("monthly");
  const [done, setDone] = useState(false);
  const plans = [
    { id: "monthly", label: "Monthly", price: SAARAH.subscriptionINR.monthly, desc: "Full access · Cancel anytime" },
    { id: "yearly", label: "Yearly", price: SAARAH.subscriptionINR.yearly, desc: "Save 25% · Best value 🔥" },
  ];
  const selected = plans.find(p => p.id === plan);

  const handleSubscribe = async () => {
    if (!fan) { onAuthRequired(); onClose(); return; }
    openRazorpay({
      amount: selected.price,
      description: `Saarah ${selected.label} Subscription`,
      fanEmail: fan.email, fanName: fan.name,
      onSuccess: async (response) => {
        const until = plan === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await supabase.from("fans").update({ is_subscribed: true, subscribed_until: until }).eq("id", fan.id);
        await supabase.from("payments").insert([{
          fan_id: fan.id, type: "subscription", amount_inr: selected.price,
          razorpay_payment_id: response.razorpay_payment_id, status: "success"
        }]);
        setDone(true);
        setTimeout(onClose, 2500);
      }
    });
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }}>
      <div style={{ background: C.card, borderRadius: 24, padding: "40px 32px", textAlign: "center", border: `1px solid ${C.borderGlow}` }}>
        <div style={{ fontSize: 52 }}>💕</div>
        <div style={{ color: C.success, fontWeight: 900, fontSize: 20, marginTop: 12 }}>Subscribed!</div>
        <div style={{ color: C.muted, marginTop: 6 }}>Welcome to Saarah's exclusive world 🌸</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.borderGlow}`, borderRadius: 24, padding: "28px 24px", width: 400, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: C.text }}>Subscribe to Saarah 💕</div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {plans.map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)} style={{ flex: 1, background: plan === p.id ? C.cyanSoft : "#ffffff06", border: `1.5px solid ${plan === p.id ? C.cyan : C.border}`, borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ color: plan === p.id ? C.cyan : C.text, fontWeight: 700, fontSize: 13 }}>{p.label}</div>
              <div style={{ color: C.text, fontWeight: 900, fontSize: 24, margin: "6px 0", fontFamily: "monospace" }}>{inr(p.price)}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <ul style={{ color: C.muted, fontSize: 13, paddingLeft: 18, marginBottom: 22, lineHeight: 2 }}>
          {["All exclusive posts & reels", "Subscriber-only photos & videos", "Behind the scenes content", "Early drops & surprises"].map(f => (
            <li key={f} style={{ color: C.text }}><span style={{ color: C.pink }}>✦</span> {f}</li>
          ))}
        </ul>
        <button onClick={handleSubscribe} style={{ width: "100%", background: `linear-gradient(135deg, ${C.cyan}cc, ${C.purple})`, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
          ✨ Subscribe for {inr(selected.price)}
        </button>
      </div>
    </div>
  );
}

// ─── PPV MODAL ─────────────────────────────────────────────────────────────
function PPVModal({ post, fan, onClose, onAuthRequired, onUnlocked }) {
  const [done, setDone] = useState(false);

  const handleUnlock = async () => {
    if (!fan) { onAuthRequired(); onClose(); return; }
    openRazorpay({
      amount: post.price_inr,
      description: `Unlock: ${post.title}`,
      fanEmail: fan.email, fanName: fan.name,
      onSuccess: async (response) => {
        await supabase.from("payments").insert([{
          fan_id: fan.id, type: "ppv", amount_inr: post.price_inr,
          razorpay_payment_id: response.razorpay_payment_id,
          post_id: post.id, status: "success"
        }]);
        await supabase.from("unlocked_posts").insert([{ fan_id: fan.id, post_id: post.id }]);
        setDone(true);
        onUnlocked(post.id);
        setTimeout(onClose, 2500);
      }
    });
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }}>
      <div style={{ background: C.card, borderRadius: 24, padding: "40px 32px", textAlign: "center", border: `1px solid ${C.borderGlow}` }}>
        <div style={{ fontSize: 52 }}>🔓</div>
        <div style={{ color: C.success, fontWeight: 900, fontSize: 20, marginTop: 12 }}>Unlocked!</div>
        <div style={{ color: C.muted, marginTop: 6 }}>{post.title}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div style={{ background: C.card, border: `1px solid ${C.borderGlow}`, borderRadius: 24, padding: "28px 24px", width: 400, maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 900, fontSize: 17, color: C.text, marginBottom: 8 }}>{post.title}</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>{post.preview}</div>
        <div style={{ background: C.accentSoft, border: `1px solid ${C.accentMid}`, borderRadius: 14, padding: "16px", textAlign: "center", marginBottom: 20 }}>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>One-Time Unlock</div>
          <div style={{ color: C.accent, fontSize: 36, fontWeight: 900, fontFamily: "monospace" }}>{inr(post.price_inr)}</div>
        </div>
        <button onClick={handleUnlock} style={{ width: "100%", background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 900, fontSize: 15, cursor: "pointer" }}>
          🔑 Unlock for {inr(post.price_inr)}
        </button>
      </div>
    </div>
  );
}

// ─── POST CARD ─────────────────────────────────────────────────────

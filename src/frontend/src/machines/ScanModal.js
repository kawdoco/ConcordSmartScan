// machines/ScanModal.js
import { useState, useEffect, useRef, useCallback } from "react";
import "./ScanModal.css";
import axios from "axios";

const API_URL = "http://localhost:8080/api/machines";

/**
 * ScanModal — scan a machine QR code, then finds matching replacement machines
 * sorted by distance from the scanned machine's current garment location.
 *
 * Props:
 *   onClose      – callback to close the modal
 *   onRequest    – callback(machineId) when technician clicks "Request" for a match
 *   showToast    – optional callback(message, type) for notifications
 */

/* ── jsQR CDN loader with fallbacks ─────────────────────────── */
const JSQR_URLS = [
  "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js",
  "https://unpkg.com/jsqr@1.4.0/dist/jsQR.js",
];

function useJsQR() {
  const [state, setState] = useState(
    window.jsQR ? "ready" : "loading"  // "loading" | "ready" | "error"
  );

  useEffect(() => {
    if (window.jsQR) { setState("ready"); return; }
    let idx = 0;
    const tryNext = () => {
      if (idx >= JSQR_URLS.length) { setState("error"); return; }
      const s   = document.createElement("script");
      s.src     = JSQR_URLS[idx++];
      s.onload  = () => (window.jsQR ? setState("ready") : tryNext());
      s.onerror = () => tryNext();
      document.head.appendChild(s);
    };
    tryNext();
  }, []);

  return state;   // "loading" | "ready" | "error"
}

/* ── Icons ───────────────────────────────────────────────────── */
function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconShoppingCart() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

/* ── Haversine distance (km) ─────────────────────────────────── */
function haversine(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a    = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Main component ──────────────────────────────────────────── */
export default function ScanModal({ onClose, onRequest, showToast }) {
  const jsqrState  = useJsQR();

  const [tab,        setTab]        = useState("camera");  // "camera" | "upload"
  const [camState,   setCamState]   = useState("idle");    // "idle"|"active"|"stopped"
  const [camError,   setCamError]   = useState("");

  const [scanResult, setScanResult] = useState(null);      // { ok, data } | null
  const [matches,    setMatches]    = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [requested,  setRequested]  = useState(new Set());
  const [purchaseSent, setPurchaseSent] = useState(false);

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const fileRef   = useRef(null);

  /* ── Close on Escape ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* ── Stop camera on unmount or tab change ── */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setCamState("stopped");
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (tab === "upload") stopCamera();
  }, [tab, stopCamera]);

  /* ── Camera scan loop ── */
  const tick = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !window.jsQR) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx  = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(img.data, img.width, img.height);
    if (code) {
      stopCamera();
      handleQRData(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [stopCamera]);   // eslint-disable-line react-hooks/exhaustive-deps

  const startCamera = useCallback(async () => {
    setCamError("");
    setScanResult(null);
    setMatches([]);
    setPurchaseSent(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamState("active");
        rafRef.current = requestAnimationFrame(tick);
      }
    } catch {
      setCamError("Camera access denied. Allow camera permission or use the Upload tab.");
      setCamState("idle");
    }
  }, [tick]);

  /* ── Handle decoded QR data ── */
  const handleQRData = useCallback(async (raw) => {
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch { /* not JSON */ }

    if (!parsed || !parsed.machineId) {
      setScanResult({ ok: false, raw });
      return;
    }

    setScanResult({ ok: true, data: parsed });
    await fetchMatches(parsed);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Fetch matching machines from API ── */
  const fetchMatches = async (parsed) => {
    setLoadingMatches(true);
    setMatches([]);
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = res.data;

      // Match: same type, at a Store (location starts with ST), exclude same machine
      const matching = all.filter(
        (m) =>
          m.machineId !== parsed.machineId &&
          m.type?.toLowerCase() === parsed.type?.toLowerCase() &&
          m.location?.toUpperCase().startsWith("ST")
      );

      // Sort by distance if coordinates available, else keep API order
      const withDist = matching.map((m) => {
        const dist =
          parsed.latitude && parsed.longitude && m.latitude && m.longitude
            ? haversine(parsed.latitude, parsed.longitude, m.latitude, m.longitude)
            : null;
        return { ...m, _dist: dist };
      });

      withDist.sort((a, b) => {
        if (a._dist === null && b._dist === null) return 0;
        if (a._dist === null) return 1;
        if (b._dist === null) return -1;
        return a._dist - b._dist;
      });

      setMatches(withDist);
    } catch {
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  /* ── File upload scan ── */
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanResult(null);
    setMatches([]);
    setPurchaseSent(false);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      const id = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
      if (window.jsQR) {
        const code = window.jsQR(id.data, id.width, id.height);
        if (code) { handleQRData(code.data); }
        else { setScanResult({ ok: false, raw: "No QR code detected in this image." }); }
      } else {
        setScanResult({ ok: false, raw: "QR scanner not loaded yet. Please wait and retry." });
      }
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  /* ── Request machine ── */
  const handleRequest = async (machine) => {
    try {
      const token = localStorage.getItem("token");
      // POST to your request endpoint — adjust URL as needed
      await axios.post(
        `http://localhost:8080/api/requests`,
        {
          requestedMachineId: machine.id,
          machineId:          scanResult?.data?.machineId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {
      // If endpoint not yet implemented, still mark as requested in UI
    }
    setRequested((prev) => new Set([...prev, machine.machineId]));
    if (onRequest) onRequest(machine.machineId);
    if (showToast) showToast(`Request sent to Chief Manager for ${machine.machineId}.`, "success");
  };

  /* ── Send purchase request ── */
  const handlePurchaseRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/requests/purchase`,
        { machineId: scanResult?.data?.machineId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch { /* endpoint may not be ready */ }
    setPurchaseSent(true);
    if (showToast) showToast("Purchase request sent to Chief Manager.", "info");
  };

  /* ── Reset to re-scan ── */
  const handleRescan = () => {
    setScanResult(null);
    setMatches([]);
    setRequested(new Set());
    setPurchaseSent(false);
    setCamError("");
    setCamState("idle");
  };

  /* ─────────────────────────────── RENDER ─────────────────────── */
  return (
    <div className="scm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="scm-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="scm-header">
          <div>
            <h2 className="scm-title">Scan Machine QR Code</h2>
            <p className="scm-subtitle">
              Scan a broken machine's QR to find matching replacements in stores.
            </p>
          </div>
          <button className="scm-close" onClick={onClose} aria-label="Close"><IconX /></button>
        </div>

        {/* Only show scanner UI if no result yet */}
        {!scanResult && (
          <>
            {/* Tabs */}
            <div className="scm-tabs">
              {[["camera", "📷  Camera"], ["upload", "🖼  Upload Image"]].map(([t, lbl]) => (
                <button
                  key={t}
                  className={`scm-tab${tab === t ? " active" : ""}`}
                  onClick={() => { setTab(t); setCamError(""); }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {/* ── Camera tab ── */}
            {tab === "camera" && (
              <div className="scm-camera-section">
                <div className="scm-video-wrap">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="scm-video"
                    style={{ display: camState === "active" ? "block" : "none" }}
                  />
                  <canvas ref={canvasRef} style={{ display: "none" }} />

                  {/* Idle placeholder */}
                  {camState !== "active" && (
                    <div className="scm-video-placeholder">
                      <IconCamera />
                      <p>{camError || "Click Start Camera to begin scanning."}</p>
                    </div>
                  )}

                  {/* Scanning overlay */}
                  {camState === "active" && (
                    <div className="scm-scan-overlay">
                      <div className="scm-frame">
                        <span className="scm-corner tl" />
                        <span className="scm-corner tr" />
                        <span className="scm-corner bl" />
                        <span className="scm-corner br" />
                        <div className="scm-scan-line" />
                      </div>
                      <p className="scm-scan-hint">Point camera at QR code</p>
                    </div>
                  )}
                </div>

                {camError && (
                  <div className="scm-alert scm-alert--error">{camError}</div>
                )}

                <div className="scm-camera-actions">
                  {camState !== "active" ? (
                    jsqrState === "error" ? (
                      <div className="scm-alert scm-alert--error">
                        QR scanner failed to load. Please use the Upload tab instead.
                      </div>
                    ) : jsqrState === "loading" ? (
                      <div className="scm-loading-hint">
                        <span className="scm-mini-spinner" />
                        Loading QR scanner…
                      </div>
                    ) : (
                      <button className="scm-btn-primary scm-btn-full" onClick={startCamera}>
                        Start Camera
                      </button>
                    )
                  ) : (
                    <button className="scm-btn-ghost scm-btn-full" onClick={stopCamera}>
                      Stop Camera
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Upload tab ── */}
            {tab === "upload" && (
              <div className="scm-upload-section">
                <div
                  className="scm-dropzone"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) { fileRef.current.files = e.dataTransfer.files; handleFile({ target: { files: [file], value: "" } }); }
                  }}
                >
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                  <IconUpload />
                  <p className="scm-dropzone-title">Click or drag &amp; drop a QR image</p>
                  <p className="scm-dropzone-sub">PNG, JPG or JPEG · max 10 MB</p>
                </div>
                {jsqrState === "loading" && (
                  <div className="scm-loading-hint">
                    <span className="scm-mini-spinner" />
                    Loading QR scanner…
                  </div>
                )}
                {jsqrState === "error" && (
                  <div className="scm-alert scm-alert--error">
                    QR scanner failed to load. Try refreshing the page.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Scan result ── */}
        {scanResult && (
          <div className="scm-results-section">
            {/* Result badge */}
            {scanResult.ok ? (
              <div className="scm-result-badge scm-result-badge--ok">
                ✓ Scanned: <strong>{scanResult.data.machineId}</strong>
                &nbsp;·&nbsp;{scanResult.data.type}
                &nbsp;·&nbsp;{scanResult.data.brand} {scanResult.data.model}
              </div>
            ) : (
              <div className="scm-result-badge scm-result-badge--err">
                ⚠ {scanResult.raw || "Could not decode QR code."}
              </div>
            )}

            {/* Matches */}
            {scanResult.ok && (
              <div className="scm-matches">
                <div className="scm-matches-header">
                  <h3 className="scm-matches-title">
                    {loadingMatches
                      ? "Searching store inventory…"
                      : matches.length > 0
                      ? `${matches.length} Matching Machine${matches.length !== 1 ? "s" : ""} Found`
                      : "No Matching Machines in Stores"}
                  </h3>
                  {!loadingMatches && (
                    <p className="scm-matches-sub">
                      Available <strong>{scanResult.data.type}</strong> machines at stores
                      {matches.length > 0 ? ", sorted by distance." : "."}
                    </p>
                  )}
                </div>

                {/* Loading */}
                {loadingMatches && (
                  <div className="scm-matches-loading">
                    <span className="scm-mini-spinner" /> Searching…
                  </div>
                )}

                {/* Match cards */}
                {!loadingMatches && matches.map((m) => (
                  <div key={m.id} className="scm-match-card">
                    <div className="scm-match-left">
                      <span className="scm-match-id">{m.machineId}</span>
                      <span className="scm-match-model">{m.brand} {m.model}</span>
                      <div className="scm-match-meta">
                        <span>{m.type}</span>
                        <span className="scm-match-location">
                          <IconPin /> {m.location}{m.storeName ? ` · ${m.storeName}` : ""}
                        </span>
                        {m._dist !== null && (
                          <span className="scm-match-dist">{m._dist.toFixed(1)} km away</span>
                        )}
                      </div>
                    </div>
                    <button
                      className={`scm-btn-request${requested.has(m.machineId) ? " sent" : ""}`}
                      onClick={() => !requested.has(m.machineId) && handleRequest(m)}
                      disabled={requested.has(m.machineId)}
                    >
                      {requested.has(m.machineId) ? "✓ Requested" : <><IconSend /> Request</>}
                    </button>
                  </div>
                ))}

                {/* No matches — show purchase request */}
                {!loadingMatches && matches.length === 0 && (
                  <div className="scm-no-match">
                    <p>No available <strong>{scanResult.data.type}</strong> machines found in any store.</p>
                    {!purchaseSent ? (
                      <button className="scm-btn-purchase" onClick={handlePurchaseRequest}>
                        <IconShoppingCart /> Send Purchase Request to Chief Manager
                      </button>
                    ) : (
                      <div className="scm-purchase-sent">✓ Purchase request sent to Chief Manager.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Re-scan */}
            <div className="scm-rescan-row">
              <button className="scm-btn-ghost" onClick={handleRescan}>
                ← Scan Another Machine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

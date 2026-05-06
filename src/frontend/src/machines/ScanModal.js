// machines/ScanModal.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import apiClient from "../services/api";
import "./ScanModal.css";
import { formatMachineId } from "./machineId";

/**
 * ScanModal — scan a machine QR code, then shows matching replacement
 * machines (same type + model, at stores) sorted by distance from the
 * logged-in technician's garment location.
 *
 * Props:
 *   onClose   – close the modal
 *   showToast – optional (message, type) notification callback
 */

/* ── jsQR CDN loader ─────────────────────────────────────────── */
const JSQR_URLS = [
  "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js",
  "https://unpkg.com/jsqr@1.4.0/dist/jsQR.js",
];

function useJsQR() {
  const [state, setState] = useState(window.jsQR ? "ready" : "loading");
  useEffect(() => {
    if (window.jsQR) { setState("ready"); return; }
    let idx = 0;
    const tryNext = () => {
      if (idx >= JSQR_URLS.length) { setState("error"); return; }
      const s = document.createElement("script");
      s.src     = JSQR_URLS[idx++];
      s.onload  = () => (window.jsQR ? setState("ready") : tryNext());
      s.onerror = () => tryNext();
      document.head.appendChild(s);
    };
    tryNext();
  }, []);
  return state;
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
function IconMapPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconDistance() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M5 12h14"/>
    </svg>
  );
}
function IconStore() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
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
function IconUser() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function ScanModal({ onClose, showToast }) {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const jsqrState   = useJsQR();

  const [tab,            setTab]            = useState("camera");
  const [camState,       setCamState]       = useState("idle");
  const [camError,       setCamError]       = useState("");

  const [scanResult,     setScanResult]     = useState(null);
  const [matches,        setMatches]        = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchError,     setMatchError]     = useState("");
  const [requested,      setRequested]      = useState(new Set());

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

  /* ── Stop camera ── */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setCamState("stopped");
  }, []);

  useEffect(() => { return () => stopCamera(); }, [stopCamera]);
  useEffect(() => { if (tab === "upload") stopCamera(); }, [tab, stopCamera]);

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
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = window.jsQR(imgData.data, imgData.width, imgData.height);
    if (code) {
      stopCamera();
      handleQRData(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [stopCamera]); // eslint-disable-line react-hooks/exhaustive-deps

  const startCamera = useCallback(async () => {
    setCamError("");
    setScanResult(null);
    setMatches([]);
    setMatchError("");
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

  /* ── Decode QR data ── */
  const handleQRData = useCallback(async (raw) => {
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch { /* not JSON */ }

    if (!parsed || !parsed.machineId) {
      setScanResult({ ok: false, raw });
      return;
    }

    setScanResult({ ok: true, data: parsed });
    await fetchMatches(parsed.machineId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Call the backend scan endpoint ── */
  const fetchMatches = async (machineCode) => {
    setLoadingMatches(true);
    setMatches([]);
    setMatchError("");
    try {
      const techId = user?.id ?? null;
      const params = techId ? { technicianId: techId } : {};
      const res = await apiClient.get(`/scan/${encodeURIComponent(machineCode)}`, { params });
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setMatchError("This machine was not found in the system. The QR code may be outdated.");
      } else {
        setMatchError("Could not load matching machines. Please check your connection and try again.");
      }
    } finally {
      setLoadingMatches(false);
    }
  };

  /* ── File upload ── */
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanResult(null);
    setMatches([]);
    setMatchError("");
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
    e.target.value = "";
  };

  /* ── Request a machine ── */
  const handleRequest = (match) => {
    const displayId = match.machineId || formatMachineId(match.id);
    if (requested.has(displayId)) return;
    setRequested((prev) => new Set([...prev, displayId]));
    onClose();
    const storeId = match.location || (match.storeLocationId ? `STO-${String(match.storeLocationId).padStart(3, "0")}` : "");
    const params  = new URLSearchParams({
      type:        "transfer",
      machineId:   displayId,
      machineType: match.type || "",
      fromStoreId: storeId,
    });
    navigate(`/requests/new?${params.toString()}`);
  };

  /* ── Purchase request ── */
  const handlePurchaseRequest = () => {
    onClose();
    const params = new URLSearchParams({
      type:        "purchase",
      machineType: scanResult?.data?.type || "",
    });
    navigate(`/requests/new?${params.toString()}`);
  };

  /* ── Reset ── */
  const handleRescan = () => {
    setScanResult(null);
    setMatches([]);
    setMatchError("");
    setRequested(new Set());
    setCamError("");
    setCamState("idle");
  };

  /* ── Distance display ── */
  const distLabel = (km) => {
    if (km === null || km === undefined) return null;
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
  };

  const garmentLabel = user?.garmentName || user?.location || null;

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="scm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="scm-modal" role="dialog" aria-modal="true">

        {/* Header */}
        <div className="scm-header">
          <div>
            <h2 className="scm-title">Scan Machine QR Code</h2>
            <p className="scm-subtitle">
              Scan a broken machine's QR to find matching replacements at stores.
            </p>
            {garmentLabel && (
              <p className="scm-garment-hint">
                <IconUser /> Distances from <strong>{garmentLabel}</strong>
              </p>
            )}
          </div>
          <button className="scm-close" onClick={onClose} aria-label="Close"><IconX /></button>
        </div>

        {/* Scanner UI */}
        {!scanResult && (
          <>
            <div className="scm-tabs">
              {[["camera", "📷  Camera"], ["upload", "🖼  Upload Image"]].map(([t, lbl]) => (
                <button key={t}
                  className={`scm-tab${tab === t ? " active" : ""}`}
                  onClick={() => { setTab(t); setCamError(""); }}>
                  {lbl}
                </button>
              ))}
            </div>

            {tab === "camera" && (
              <div className="scm-camera-section">
                <div className="scm-video-wrap">
                  <video ref={videoRef} playsInline muted className="scm-video"
                    style={{ display: camState === "active" ? "block" : "none" }} />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  {camState !== "active" && (
                    <div className="scm-video-placeholder">
                      <IconCamera /><p>{camError || "Click Start Camera to begin scanning."}</p>
                    </div>
                  )}
                  {camState === "active" && (
                    <div className="scm-scan-overlay">
                      <div className="scm-frame">
                        <span className="scm-corner tl" /><span className="scm-corner tr" />
                        <span className="scm-corner bl" /><span className="scm-corner br" />
                        <div className="scm-scan-line" />
                      </div>
                      <p className="scm-scan-hint">Point camera at QR code</p>
                    </div>
                  )}
                </div>
                {camError && <div className="scm-alert scm-alert--error">{camError}</div>}
                <div className="scm-camera-actions">
                  {camState !== "active" ? (
                    jsqrState === "error" ? (
                      <div className="scm-alert scm-alert--error">QR scanner failed to load. Use the Upload tab.</div>
                    ) : jsqrState === "loading" ? (
                      <div className="scm-loading-hint"><span className="scm-mini-spinner" /> Loading QR scanner…</div>
                    ) : (
                      <button className="scm-btn-primary scm-btn-full" onClick={startCamera}>Start Camera</button>
                    )
                  ) : (
                    <button className="scm-btn-ghost scm-btn-full" onClick={stopCamera}>Stop Camera</button>
                  )}
                </div>
              </div>
            )}

            {tab === "upload" && (
              <div className="scm-upload-section">
                <div className="scm-dropzone"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const f = e.dataTransfer.files[0];
                    if (f) handleFile({ target: { files: [f], value: "" } });
                  }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                  <IconUpload />
                  <p className="scm-dropzone-title">Click or drag &amp; drop a QR image</p>
                  <p className="scm-dropzone-sub">PNG, JPG or JPEG · max 10 MB</p>
                </div>
                {jsqrState === "loading" && <div className="scm-loading-hint"><span className="scm-mini-spinner" /> Loading QR scanner…</div>}
                {jsqrState === "error"   && <div className="scm-alert scm-alert--error">QR scanner failed to load. Try refreshing.</div>}
              </div>
            )}
          </>
        )}

        {/* Results */}
        {scanResult && (
          <div className="scm-results-section">

            {scanResult.ok ? (
              <div className="scm-result-badge scm-result-badge--ok">
                <span className="scm-result-check">✓</span>
                <div className="scm-result-info">
                  <strong>{formatMachineId(scanResult.data.machineId) || scanResult.data.machineId}</strong>
                  <span>{scanResult.data.brand} {scanResult.data.model}</span>
                  <span className="scm-result-type">{scanResult.data.type}</span>
                </div>
              </div>
            ) : (
              <div className="scm-result-badge scm-result-badge--err">
                ⚠ {scanResult.raw || "Could not decode QR code."}
              </div>
            )}

            {scanResult.ok && (
              <div className="scm-matches">
                <div className="scm-matches-header">
                  <h3 className="scm-matches-title">
                    {loadingMatches
                      ? "Searching store inventory…"
                      : matchError
                      ? "Search Error"
                      : matches.length > 0
                      ? `${matches.length} Matching Machine${matches.length !== 1 ? "s" : ""} Found`
                      : "No Matching Machines in Stores"}
                  </h3>
                  {!loadingMatches && !matchError && (
                    <p className="scm-matches-sub">
                      <strong>{scanResult.data.type}</strong> · <strong>{scanResult.data.model}</strong> at stores
                      {matches.length > 0 && garmentLabel
                        ? `, sorted by distance from ${garmentLabel}.`
                        : matches.length > 0 ? ", sorted by distance." : "."}
                    </p>
                  )}
                </div>

                {loadingMatches && (
                  <div className="scm-matches-loading">
                    <span className="scm-mini-spinner" /> Searching store inventory…
                  </div>
                )}

                {!loadingMatches && matchError && (
                  <div className="scm-alert scm-alert--error scm-alert--spaced">{matchError}</div>
                )}

                {!loadingMatches && !matchError && matches.map((m) => {
                  const displayId  = m.machineId || formatMachineId(m.id);
                  const isReq      = requested.has(displayId);
                  const dist       = distLabel(m.distanceKm);

                  return (
                    <div key={m.id} className={`scm-match-card${isReq ? " scm-match-card--requested" : ""}`}>
                      <div className="scm-match-left">

                        <div className="scm-match-top-row">
                          <span className="scm-match-id">{displayId}</span>
                          {dist && (
                            <span className="scm-dist-badge">
                              <IconDistance /> {dist} away
                            </span>
                          )}
                        </div>

                        <span className="scm-match-model">{m.brand} {m.model}</span>

                        <div className="scm-match-meta">
                          <span className="scm-match-type-pill">{m.type}</span>

                          <span className="scm-match-location-row">
                            <IconMapPin />
                            <span>{m.location}</span>
                            {m.storeName && <span className="scm-store-name">· {m.storeName}</span>}
                          </span>

                          {m.storeAddress && (
                            <span className="scm-store-address">
                              <IconStore /> {m.storeAddress}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className={`scm-btn-request${isReq ? " sent" : ""}`}
                        onClick={() => handleRequest(m)}
                        disabled={isReq}>
                        {isReq ? "✓ Requested" : <><IconSend /> Request</>}
                      </button>
                    </div>
                  );
                })}

                {!loadingMatches && !matchError && matches.length === 0 && (
                  <div className="scm-no-match">
                    <p>
                      No <strong>{scanResult.data.type}</strong> · <strong>{scanResult.data.model}</strong> machines
                      available at any store.
                    </p>
                    <button className="scm-btn-purchase" onClick={handlePurchaseRequest}>
                      <IconShoppingCart /> Send Purchase Request to Chief Manager
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="scm-rescan-row">
              <button className="scm-btn-ghost" onClick={handleRescan}>
              -- Scan Another Machine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

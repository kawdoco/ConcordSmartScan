// machines/QRModal.js
import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import { getMachineDisplayId } from "./machineId";
import "./QRModal.css";

/**
 * QRModal — shows and lets you download the QR code for a machine.
 *
 * Props:
 *   machine  – machine object (must have machineId, type, brand, model, serialNumber, location)
 *   onClose  – callback to close the modal
 */

function getQRUrl(data, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&format=png&margin=12&color=0-0-0&bgcolor=255-255-255`;
}

function buildQRData(machine) {
  const machineDisplayId = getMachineDisplayId(machine);
  return JSON.stringify({
    machineId:    machineDisplayId,
    type:         machine.type,
    brand:        machine.brand,
    model:        machine.model,
    serialNumber: machine.serialNumber,
    location:     machine.location,
  });
}

function IconDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconPrint() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export default function QRModal({ machine, onClose }) {
  const { showToast } = useToast();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const machineDisplayId = getMachineDisplayId(machine);
  const qrData = buildQRData(machine);
  const qrUrl  = getQRUrl(qrData, 220);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Download via blob so the browser actually saves it instead of navigating
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(qrUrl);
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `QR-${machineDisplayId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`QR code for ${machineDisplayId} downloaded.`);
    } catch {
      // Fallback: draw on canvas, then download
      try {
        const img      = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          img.onload  = resolve;
          img.onerror = reject;
          img.src     = qrUrl + "&_=" + Date.now();
        });
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a   = document.createElement("a");
          a.href     = url;
          a.download = `QR-${machineDisplayId}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast(`QR code for ${machineDisplayId} downloaded.`);
        }, "image/png");
      } catch {
        // Last resort — open in new tab
        window.open(qrUrl, "_blank");
        showToast("Opened in new tab — right-click to save.", "info");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>QR — ${machineDisplayId}</title>
      <style>
        body { margin:0; display:flex; flex-direction:column;
               align-items:center; justify-content:center; min-height:100vh;
               font-family:sans-serif; }
        img  { width:260px; height:260px; }
        p    { margin:6px 0 2px; font-size:13px; color:#64748b; }
        h2   { margin:0; font-size:16px; }
      </style></head>
      <body>
        <img src="${qrUrl}" />
        <h2>${machineDisplayId}</h2>
        <p>${machine.brand} ${machine.model} · ${machine.type}</p>
        <p>${machine.location}</p>
        <script>window.onload=()=>window.print();</script>
      </body></html>
    `);
    win.document.close();
  };

  return (
    <div className="qrm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="qrm-modal" role="dialog" aria-modal="true" aria-label="QR Code">

        {/* Header */}
        <div className="qrm-header">
          <div>
            <h2 className="qrm-title">QR Code</h2>
            <p className="qrm-subtitle">Machine ID: <strong>{machineDisplayId}</strong></p>
          </div>
          <button className="qrm-close" onClick={onClose} aria-label="Close"><IconX /></button>
        </div>

        {/* QR image */}
        <div className="qrm-body">
          <div className="qrm-img-wrap">
            {!imgLoaded && !imgError && (
              <div className="qrm-skeleton" aria-label="Loading QR…">
                <div className="qrm-spinner" />
                <span>Generating QR…</span>
              </div>
            )}
            {imgError && (
              <div className="qrm-error-state">
                <span>⚠ Could not load QR image.</span>
                <a href={qrUrl} target="_blank" rel="noreferrer" className="qrm-link">Open in new tab</a>
              </div>
            )}
            <img
              src={qrUrl}
              alt={`QR code for ${machineDisplayId}`}
              className="qrm-img"
              style={{ display: imgLoaded ? "block" : "none" }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>

          {/* Machine info under QR */}
          <div className="qrm-meta">
            <span className="qrm-meta-id">{machineDisplayId}</span>
            <span className="qrm-meta-line">{machine.brand} {machine.model}</span>
            <span className="qrm-meta-line">{machine.type} · {machine.location}</span>
          </div>

          {/* Encoded data info */}
          <div className="qrm-encoded-hint">
            Encodes: Machine ID, type, brand, model, serial number &amp; location.
            Affix this QR to the physical machine.
          </div>
        </div>

        {/* Actions */}
        <div className="qrm-actions">
          <button className="qrm-btn-ghost" onClick={handlePrint}>
            <IconPrint /> Print
          </button>
          <button
            className="qrm-btn-primary"
            onClick={handleDownload}
            disabled={downloading}
          >
            <IconDownload />
            {downloading ? "Downloading…" : "Download PNG"}
          </button>
        </div>

        {/* Close link */}
        <div className="qrm-footer">
          <button className="qrm-btn-text" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

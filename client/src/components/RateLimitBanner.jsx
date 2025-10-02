export default function RateLimitBanner({ onRetry, onDismiss }) {
  return (
    <div className="banner warn" role="status" aria-live="polite">
      <div>
        <strong>Rate limited by NASA DEMO_KEY.</strong> Please wait a moment—requests are being throttled.
      </div>
      <div className="banner-actions">
        <button className="btn" onClick={onRetry} aria-label="Retry now">Retry now</button>
        <button className="btn ghost" onClick={onDismiss} aria-label="Dismiss">Dismiss</button>
      </div>
    </div>
  );
}

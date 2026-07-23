export default function ResultBanner({
    message,
    onDismiss,
}) {
    if (!message) {
        return null;
    }

    return (
        <div
            className={`result-banner ${
                message.type || "error"
            }`}
            role="status"
        >
            <span>
                {message.type === "success" ? "✓" : "!"}
            </span>

            <div>
                <strong>{message.text}</strong>

                {message.detail && (
                    <small>{message.detail}</small>
                )}
            </div>

            <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss message"
            >
                ×
            </button>
        </div>
    );
}
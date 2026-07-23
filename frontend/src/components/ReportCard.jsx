import { Download, LoaderCircle } from "lucide-react";

export default function ReportCard({
    description,
    icon: Icon,
    isGenerating,
    onDownload,
    title,
}) {
    return (
        <article className="report-card">
            <div className="report-card-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={2} />
            </div>

            <div className="report-card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

            <button
                className="report-download-button"
                type="button"
                onClick={onDownload}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <LoaderCircle
                        className="report-spinner"
                        size={16}
                        aria-hidden="true"
                    />
                ) : (
                    <Download size={16} aria-hidden="true" />
                )}
                {isGenerating ? "Generating..." : "Download PDF"}
            </button>
        </article>
    );
}

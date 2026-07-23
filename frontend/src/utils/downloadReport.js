export async function downloadReport({
    api,
    endpoint,
    fileName,
    selection,
}) {
    const response = await api.get(endpoint, {
        params: selection,
        responseType: "blob",
    });

    const fileUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);
}

import { useState } from "react";
import { downloadMyDocument } from "../api";
import toast from "react-hot-toast";

export const useDownloadMyDocument = () => {
  const [downloadingId, setDownloadingId] = useState(null);

  const download = async (document) => {
    if (downloadingId) return;

    setDownloadingId(document.id);
    try {
      const response = await downloadMyDocument(document.id);

      const contentDisposition = response.headers["content-disposition"];
      let fileName = document.file_name || "download";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+?)"?(?:;|$)/);
        if (match) fileName = match[1];
      }

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully.");
    } catch {
      toast.error("Failed to download document.");
    } finally {
      setDownloadingId(null);
    }
  };

  return { download, downloadingId };
};

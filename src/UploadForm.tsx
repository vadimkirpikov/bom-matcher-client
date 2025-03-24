import { useState } from "react";
import "./UploadForm.css";

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [googleSheetLink, setGoogleSheetLink] = useState("");
    const [sheetName, setSheetName] = useState("");
    const [fastMode, setFastMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setDragActive(false);

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setFile(event.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            return alert("Please choose a PDF file!");
        }

        if (!googleSheetLink.trim()) {
            return alert("Please provide the Google Sheets link!");
        }

        if (!sheetName.trim()) {
            return alert("Please provide the Google Sheet's sheet name!");
        }

        setLoading(true);
        setStatus("idle");

        const formData = new FormData();
        formData.append("pdf", file);

        try {
            const response = await fetch(
                `http://52.15.140.47:80/upload?googleSheetUrl=${encodeURIComponent(googleSheetLink)}&sheetName=${encodeURIComponent(sheetName)}&fastMode=${fastMode}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Upload PDF</h1>

            <div
                className={`w-96 p-6 border-2 ${
                    dragActive ? "border-blue-500" : "border-gray-300"
                } border-dashed rounded-lg flex flex-col items-center justify-center bg-white`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                />
                <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex flex-col items-center"
                >
                    <p className="text-gray-600">Drag and drop PDF here</p>
                    <p className="text-blue-500 underline">or select a file</p>
                </label>
            </div>

            {file && <p className="mt-2 text-gray-700">Selected file: {file.name}</p>}

            <div className="mt-4">
                <input
                    type="text"
                    value={googleSheetLink}
                    onChange={(e) => setGoogleSheetLink(e.target.value)}
                    placeholder="Paste your Google Sheets link"
                    className="w-96 p-2 border-2 border-gray-300 rounded-lg"
                />
            </div>

            <div className="mt-4">
                <input
                    type="text"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="Enter the sheet name"
                    className="w-96 p-2 border-2 border-gray-300 rounded-lg"
                />
            </div>

            <div className="mt-4 flex items-center">
                <input
                    type="checkbox"
                    checked={fastMode}
                    onChange={(e) => setFastMode(e.target.checked)}
                    className="mr-2"
                />
                <label className="text-gray-700">Fast mode</label>
            </div>

            <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading || !sheetName.trim()}
            >
                {loading ? "Uploading..." : "Submit"}
            </button>

            {loading && <div className="mt-4 text-blue-500">⏳ Uploading...</div>}
            {status === "success" && <div className="mt-4 text-green-500 text-2xl">✅</div>}
            {status === "error" && <div className="mt-4 text-red-500 text-2xl">❌</div>}
        </div>
    );
};

export default UploadForm;

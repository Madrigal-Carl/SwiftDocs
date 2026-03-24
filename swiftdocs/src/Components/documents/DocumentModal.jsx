import { useState } from "react";
import { X, FileText } from "lucide-react";

export default function DocumentModal({
    isOpen,
    onClose,
    onSubmit,
    document,
    mode = "create", // create | edit
}) {
    const [name, setName] = useState(document?.name || "");
    const [price, setPrice] = useState(document?.price || "");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            if (onSubmit) {
                await onSubmit({ name, price });
            }

            setName("");
            setPrice("");
        } finally {
            setSubmitting(false);
        }
    };

    const isEdit = mode === "edit";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="glass-morphism w-full max-w-md rounded-xl shadow-xl p-6 animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-(--text-dark)">
                        {isEdit ? "Edit Document" : "Add Document"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-(--bg-light)"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Info Preview */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-(--bg-light) mb-5">
                    <FileText className="w-4 h-4 mt-1 text-(--primary-600)" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Document Preview
                        </p>
                        <p className="text-sm font-semibold text-(--text-dark)">
                            {name || "Document Name"}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4 mb-6">

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                            Document Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter document name..."
                            className="w-full mt-2 p-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500)"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider">
                            Price
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Ensure non-negative numbers only
                                setPrice(value < 0 ? "0" : value);
                            }}
                            placeholder="Enter price..."
                            className="w-full mt-2 p-3 text-sm border border-(--border-light) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary-500) 
                                    appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&-moz-appearance:textfield]"
                        />
                    </div>

                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2 text-sm rounded-lg border border-(--border-light) hover:bg-(--bg-light) disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-5 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-colors
              ${submitting ? "opacity-60 cursor-not-allowed" : ""}
              bg-(--primary-600) hover:bg-(--primary-700)
            `}
                    >
                        {submitting
                            ? "Processing..."
                            : isEdit
                                ? "Save Changes"
                                : "Add Document"}
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, X } from "lucide-react";

export default function ImageUpload({ file, setFile, disabled }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const selected = acceptedFiles[0];
                // Create a preview URL
                selected.preview = URL.createObjectURL(selected);
                setFile(selected);
            }
        },
        [setFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".webp"],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        disabled,
    });

    const removeFile = (e) => {
        e.stopPropagation();
        if (file?.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
    };

    return (
        <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                : file
                    ? "border-primary-500/30 bg-primary-50 dark:bg-primary-500/5"
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary-400 dark:border-white/10 dark:bg-transparent dark:hover:border-white/20 dark:hover:bg-white/5 text-gray-900 dark:text-white"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            <input {...getInputProps()} />

            {file ? (
                <div className="space-y-4">
                    <div className="relative inline-block">
                        <img
                            src={file.preview}
                            alt="Preview"
                            className="max-h-48 rounded-xl object-contain mx-auto"
                        />
                        {!disabled && (
                            <button
                                onClick={removeFile}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-dark-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent rounded-2xl flex items-center justify-center mx-auto shadow-sm dark:shadow-none">
                        {isDragActive ? (
                            <Image className="w-8 h-8 text-primary-500 dark:text-primary-400 animate-bounce" />
                        ) : (
                            <Upload className="w-8 h-8 text-gray-400 dark:text-dark-400" />
                        )}
                    </div>
                    <div>
                        <p className="text-lg font-medium">
                            {isDragActive ? (
                                <span className="text-primary-600 dark:text-primary-400">Drop your image here</span>
                            ) : (
                                <>
                                    <span className="text-primary-600 dark:text-primary-400">Click to upload</span>
                                    <span className="text-gray-500 dark:text-dark-400"> or drag & drop</span>
                                </>
                            )}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-dark-500 mt-1">
                            PNG, JPG, JPEG, WEBP up to 10MB
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

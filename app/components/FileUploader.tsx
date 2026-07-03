import {type ChangeEvent, type DragEvent, useRef, useState} from 'react'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState('');
    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const selectFile = (selectedFile: File | null) => {
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
            setError('Please upload a PDF file.');
            return;
        }

        if (selectedFile.size > maxFileSize) {
            setError(`File must be smaller than ${formatSize(maxFileSize)}.`);
            return;
        }

        setFile(selectedFile);
        setError('');
        onFileSelect?.(selectedFile);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        selectFile(e.target.files?.[0] || null);
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        selectFile(e.dataTransfer.files?.[0] || null);
    }

    const handleRemove = () => {
        setFile(null);
        setError('');
        if (inputRef.current) inputRef.current.value = '';
        onFileSelect?.(null);
    }

    return (
        <div className="w-full gradient-border">
            <div
                className={`uplader-drag-area ${isDragActive ? 'gradient-hover' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                }}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleInputChange}
                />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button type="button" className="p-2 cursor-pointer" onClick={handleRemove}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    ): (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
            </div>
        </div>
    )
}
export default FileUploader

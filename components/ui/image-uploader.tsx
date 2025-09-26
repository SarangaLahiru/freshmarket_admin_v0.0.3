'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';

type ImageUploaderProps = {
    label?: string;
    description?: string;
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    accept?: string;
    maxSizeMB?: number;
    className?: string;
    helperText?: string;
};

export function ImageUploader({
    label = 'Image',
    description = 'Drag & drop or paste an image URL',
    value,
    onChange,
    disabled,
    accept = 'image/*',
    maxSizeMB = 5,
    className,
    helperText,
}: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const onPaste = (e: ClipboardEvent) => {
            if (disabled) return;
            const text = e.clipboardData?.getData('text');
            if (text && isLikelyUrl(text)) {
                onChange(text.trim());
            }
            const items = e.clipboardData?.items;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (file) handleFiles([file]);
                    }
                }
            }
        };
        window.addEventListener('paste', onPaste);
        return () => window.removeEventListener('paste', onPaste);
    }, [disabled]);

    const isLikelyUrl = (text: string) => /^https?:\/\//i.test(text);

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            if (!files || files.length === 0) return;
            const file = files[0];
            setError(null);

            // basic validations
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }
            const maxBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxBytes) {
                setError(`Image must be smaller than ${maxSizeMB}MB.`);
                return;
            }

            // Simulate upload with progress (replace with real upload if backend ready)
            setUploading(true);
            setProgress(0);
            const simulated = setInterval(() => {
                setProgress((p) => {
                    const next = Math.min(100, p + 10 + Math.random() * 15);
                    if (next >= 100) {
                        clearInterval(simulated);
                        // For demo, create object URL. In real app, replace with server URL.
                        const objectUrl = URL.createObjectURL(file);
                        onChange(objectUrl);
                        setUploading(false);
                    }
                    return next;
                });
            }, 150);
        },
        [maxSizeMB, onChange]
    );

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled) return;
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const openFilePicker = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        onChange(e.target.value);
    };

    const clearImage = () => {
        onChange('');
    };

    return (
        <div className={className}>
            {label && <Label>{label}</Label>}
            <div
                className={`mt-2 border-2 border-dashed rounded-lg p-4 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200'
                    } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                {value ? (
                    <div className="flex items-start gap-4">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-32 h-24 object-cover rounded-md border"
                        />
                        <div className="flex-1 space-y-2">
                            <Input
                                value={value}
                                onChange={onUrlChange}
                                placeholder="https://example.com/image.jpg"
                            />
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" onClick={openFilePicker}>
                                    <UploadCloud className="w-4 h-4 mr-2" />
                                    Replace
                                </Button>
                                <Button type="button" variant="ghost" onClick={clearImage}>
                                    <X className="w-4 h-4 mr-2" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-8 gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="text-gray-700 font-medium">{description}</div>
                        <div className="text-xs text-gray-500">PNG, JPG up to {maxSizeMB}MB</div>
                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={openFilePicker}>
                                <UploadCloud className="w-4 h-4 mr-2" />
                                Choose file
                            </Button>
                            <span className="text-sm text-gray-500">or paste image URL</span>
                        </div>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files || [])}
                />
                {uploading && (
                    <div className="mt-3">
                        <Progress value={progress} />
                    </div>
                )}
                {helperText && !error && (
                    <p className="text-xs text-gray-500 mt-2">{helperText}</p>
                )}
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default ImageUploader;


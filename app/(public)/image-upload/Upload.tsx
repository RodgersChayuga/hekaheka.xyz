// app/(public)/image-upload/Upload.tsx


"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

type PhotoUploadProps = {
    character: string;
    files: File[];
    setFiles: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number;
};

const PhotoUpload = ({ character, files, setFiles, maxFiles = 2, maxSize = 5 * 1024 * 1024 }: PhotoUploadProps) => {
    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    return (
        <div className="flex flex-col gap-2 items-start justify-center border-2 border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="text-lg font-bold">Upload: {character}</h3>
            <FileUpload
                maxFiles={maxFiles}
                maxSize={maxSize}
                className="w-full max-w-md bg-white"
                value={files}
                onValueChange={setFiles}
                onFileReject={onFileReject}
                multiple
                aria-label={`Upload images for ${character}`}
            >
                <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">Drag & drop files here</p>
                        <p className="text-muted-foreground text-xs">
                            Or click to browse (max {maxFiles} files, up to {maxSize / 1024 / 1024}MB each)
                        </p>
                    </div>
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Browse files
                        </Button>
                    </FileUploadTrigger>
                </FileUploadDropzone>
                <FileUploadList>
                    {files.map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <FileUploadItemDelete asChild>
                                <Button variant="ghost" size="icon" className="size-7">
                                    <X />
                                </Button>
                            </FileUploadItemDelete>
                        </FileUploadItem>
                    ))}
                </FileUploadList>
            </FileUpload>
        </div>
    );
};

export default PhotoUpload;
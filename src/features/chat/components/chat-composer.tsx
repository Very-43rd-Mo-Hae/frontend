import { useId, useState } from 'react';

import fileSvg from '@/assets/icons/file.svg';
import photoSvg from '@/assets/icons/photo.svg';
import { InlineSvgIcon } from '@/components/common/inline-svg-icon';

type AttachmentType = 'photo' | 'file';

type SelectedAttachment = {
    type: AttachmentType;
    name: string;
};

export function ChatComposer() {
    const photoInputId = useId();
    const fileInputId = useId();
    const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<SelectedAttachment | null>(null);

    const handleAttachmentChange = (type: AttachmentType, files: FileList | null) => {
        const file = files?.[0];

        if (!file) {
            return;
        }

        setSelectedAttachment({ type, name: file.name });
        setIsAttachmentOpen(false);
    };

    return (
        <form className="shrink-0 border-t border-relink-card bg-relink-white px-4 py-3">
            {isAttachmentOpen ? (
                <div className="mb-3 flex gap-2">
                    <label
                        htmlFor={photoInputId}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-relink-lavender-soft py-3 font-display text-md text-relink-gray-700"
                    >
                        <InlineSvgIcon svg={photoSvg} className="h-5 w-5" />
                        사진
                    </label>
                    <label
                        htmlFor={fileInputId}
                        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-relink-lavender-soft py-3 font-display text-md text-relink-gray-700"
                    >
                        <InlineSvgIcon svg={fileSvg} className="h-5 w-5" />
                        파일
                    </label>
                </div>
            ) : null}

            {selectedAttachment ? (
                <div className="mb-3 flex items-center justify-between rounded-lg bg-relink-lavender-soft px-3 py-2">
                    <span className="min-w-0 truncate font-display text-sm text-relink-gray-700">
                        {selectedAttachment.type === 'photo' ? '사진' : '파일'}: {selectedAttachment.name}
                    </span>
                    <button
                        type="button"
                        className="ml-3 shrink-0 font-display text-sm text-relink-lavender-intense"
                        onClick={() => setSelectedAttachment(null)}
                    >
                        삭제
                    </button>
                </div>
            ) : null}

            <div className="flex items-center gap-2">
                <input
                    id={photoInputId}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleAttachmentChange('photo', event.currentTarget.files)}
                />
                <input
                    id={fileInputId}
                    type="file"
                    className="sr-only"
                    onChange={(event) => handleAttachmentChange('file', event.currentTarget.files)}
                />

                <button
                    type="button"
                    aria-label="사진 또는 파일 첨부"
                    aria-expanded={isAttachmentOpen}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-relink-lavender-soft font-display text-2xl text-relink-lavender-intense"
                    onClick={() => setIsAttachmentOpen((current) => !current)}
                >
                    +
                </button>
                <input
                    aria-label="메시지 입력"
                    placeholder="메시지를 입력하세요"
                    className="min-w-0 flex-1 rounded-full bg-relink-lavender-soft px-4 py-3 font-display text-md text-relink-ink outline-none placeholder:text-relink-gray-400"
                />
                <button
                    type="submit"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-relink-lavender-intense font-display text-lg text-relink-white"
                    aria-label="메시지 보내기"
                >
                    ↑
                </button>
            </div>
        </form>
    );
}

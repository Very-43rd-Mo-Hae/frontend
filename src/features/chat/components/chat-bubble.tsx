import type { ChatMessage } from '@/features/chat/types';

type ChatBubbleProps = {
    message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
    if (message.sender === 'system') {
        return (
            <div className="flex justify-center">
                <p className="max-w-[260px] rounded-full bg-relink-lavender-soft px-4 py-2 text-center font-display text-sm text-relink-gray-500">
                    {message.text}
                </p>
            </div>
        );
    }

    const isMine = message.sender === 'me';

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[78%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <p
                    className={`rounded-2xl px-4 py-3 font-display text-md shadow-sm ${
                        isMine
                            ? 'rounded-br-md bg-relink-lavender-intense text-relink-white'
                            : 'rounded-bl-md bg-relink-lavender-soft text-relink-ink'
                    }`}
                >
                    {message.text}
                </p>
                <span className="mt-1 px-1 font-display text-[11px] leading-4 text-relink-gray-400">
                    {message.time}
                </span>
            </div>
        </div>
    );
}

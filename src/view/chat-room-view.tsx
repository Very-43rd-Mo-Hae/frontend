import { Navigate, useParams } from 'react-router-dom';

import { routePaths } from '@/constants/route-paths';
import { chatRooms } from '@/features/chat/chat-data';
import { ChatRoomScreen } from '@/features/chat/components/chat-room-screen';

export function ChatRoomView() {
    const { roomId } = useParams();
    const room = chatRooms.find((chatRoom) => chatRoom.id === roomId);

    if (!room) {
        return <Navigate to={routePaths.chat} replace />;
    }

    return <ChatRoomScreen room={room} />;
}

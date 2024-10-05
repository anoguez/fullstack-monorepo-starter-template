export type RequestPayload = {
    message: Message;
}

export type Message = {
    id: number;
    type: 'user' | 'bot';
    content: string;
    file?: File;
}
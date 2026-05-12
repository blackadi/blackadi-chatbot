import {type IMessage} from '~/interface/IMessage';

export const useIsChatting = () => useState("isChatting", () => false);
export const useMessages = () => useState<IMessage[]>("messages", () => [])
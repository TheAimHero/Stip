'use client';

import { type groupMembers } from '@/server/db/schema/groups';
import { useLocalStorage } from '@uidotdev/usehooks';
import React, {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from 'react';

interface Props {
  children: ReactNode;
}

type GroupMemberType = typeof groupMembers.$inferSelect;

export type GroupContextType = {
  groupMember: GroupMemberType | undefined;
  setGroupMember: Dispatch<SetStateAction<GroupMemberType | undefined>>;
};

const GroupContext = createContext<GroupContextType>({
  groupMember: undefined,
  setGroupMember: () => undefined,
});

const GroupContextProvider: FC<Props> = ({ children }) => {
  const [currentGroup] = useLocalStorage<GroupMemberType | undefined>(
    'currentGroup',
    undefined,
  );
  const [groupMember, setGroupMember] = useState<GroupMemberType | undefined>(
    currentGroup,
  );
  return (
    <GroupContext.Provider value={{ groupMember, setGroupMember }}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContextProvider;

export function useGroups() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentGroup, setCurrentGroup] = useLocalStorage<
    GroupMemberType | undefined
  >('currentGroup', undefined);
  const context = useContext(GroupContext);
  useEffect(() => {
    setCurrentGroup(context.groupMember);
  }, [context.groupMember]);
  return context;
}

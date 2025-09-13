"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {
  refetchNotiications: boolean;
  sendNotification: (recipientId: string) => void;
  handleNotifications: () => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = useSession();
  const user = session?.data?.user;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [refetchNotiications, setRefetchNotifications] = useState(false);

  const sendNotification = useCallback(
    (recipientId: string) => {
      if (!socket) return;
      if (socket && user && isSocketConnected)
        socket.emit("onNotification", recipientId);
    },
    [socket, user, isSocketConnected]
  );

  const handleNotifications = () => {
    setRefetchNotifications((prev) => !prev);
  };

  //initialize a new socket connection
  useEffect(() => {
    if (!user) return;
    const newSocket = io();
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // listen for connection events
  useEffect(() => {
    if (socket === null) return;
    const onConnect = () => {
      setIsSocketConnected(true);
      console.log("Socket connected");
    };
    const onDisconnect = () => {
      setIsSocketConnected(false);
    };
    const onNotifications = () => {
      handleNotifications();
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("onNotification", onNotifications);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("onNotification", onNotifications);
    };
  }, [socket]);

  // setup online user
  useEffect(() => {
    if (!socket || !isSocketConnected || !user) return;
    socket.emit("addOnlineUser", user.id);
  }, [socket, user, isSocketConnected]);

  return (
    <SocketContext.Provider
      value={{
        handleNotifications,
        refetchNotiications,
        sendNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (context === null) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

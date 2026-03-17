import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";

export function useUserData() {
    return useContext(UserDataContext);
}
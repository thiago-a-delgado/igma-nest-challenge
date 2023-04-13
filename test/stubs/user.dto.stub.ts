import { UserDTO } from "src/user/dto/user.dto";

export const UserDTOStub = (): UserDTO => {
    return {
        id: "1",
        username: "igma",
        password: "secret"
    };
};
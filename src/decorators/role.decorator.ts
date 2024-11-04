import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/entities";

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
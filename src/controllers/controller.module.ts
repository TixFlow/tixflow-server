import { ClassSerializerInterceptor, Module, UseInterceptors } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BlogModule } from "./blog/blog.module";
import { TicketModule } from "./ticket/ticket.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        BlogModule,
        TicketModule
    ],
})
export class ControllerModule {
}
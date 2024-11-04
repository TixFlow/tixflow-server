import { ClassSerializerInterceptor, Module, UseInterceptors } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BlogModule } from "./blog/blog.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        BlogModule
    ],
})
export class ControllerModule {
}
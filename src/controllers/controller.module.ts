import { ClassSerializerInterceptor, Module, UseInterceptors } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BlogModule } from "./blog/blog.module";
import { TicketModule } from "./ticket/ticket.module";
import { OrderModule } from "./order/order.module";
import { TransactionModule } from "./transaction/transaction.module";
import { PayosModule } from "./payos/payos.module";

@Module({
    imports: [
        AuthModule,
        UserModule,
        BlogModule,
        TicketModule,
        OrderModule,
        TransactionModule,
        PayosModule
    ],
})
export class ControllerModule {
}
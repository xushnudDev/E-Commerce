import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
    @Get(":id")
    async getUserById(@Param("id") id: number) {
        return this.userService.getUserById({id});
    }
    @Post("register")
    async registerUser(@Body() body: any) {
        return this.userService.registerUser(body);
    }

    @Post("login")
    async loginUser(@Body() body: any) {
        return this.userService.loginUser(body);
    }

    @Put(":id")
    async updateUser(@Param("id") id: number, @Body() body: any) {
        return this.userService.updateUser({id, ...body});
    }
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param("id") id: number) {
        return this.userService.deleteUser({id});
    }

}
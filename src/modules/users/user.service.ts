import { Injectable,OnModuleInit } from "@nestjs/common";
import { PostgresService } from "src/db";
import { UserTableModel } from "./model";

@Injectable()
export class UserService implements OnModuleInit{
    constructor(private readonly pg: PostgresService) {}

    async onModuleInit() {
        try {
            await this.pg.query(UserTableModel);
            console.log("User Table created!");
        } catch (error) {
            console.log("Error on conecting to database");
        }
    }

    async getAllUsers () {
        const data = await this.pg.query("select * from users");
        return {
            message: "success",
            count: data.length,
            data: data
        }
    };
    async registerUser (payload: {fullname: string; username: string;email: string; password: string}) {
        const existingUser = await this.pg.query("select * from users where email = $1", [payload.email]);
        if (existingUser.length > 0) {
            throw new Error("User already exists");
        }
        const data = await this.pg.query(
            "insert into users (fullname,username,email,password) values ($1,$2,$3,$4) returning *",
            [payload.fullname, payload.username, payload.email, payload.password]
        );
        if (data.length == 0) {
            throw new Error("User not found");
        }
        return {
            message: "success",
            data: data
        }
    };
    async loginUser (payload: {email: string; password: string}) {
        const data = await this.pg.query("select * from users where email = $1 and password = $2", [payload.email, payload.password]);
        return {
            message: "success",
            data: data
        }
    }
    async getUserById (payload: {id: number}) {
        const data = await this.pg.query("selc* from users where id = $1", [payload.id]);
        return {
            message: "success",
            data: data
        }
    };
    async updateUser (payload: {id: number; fullname: string; username: string;email: string; password: string}) {
        const data = await this.pg.query(
            "update users set fullname = $1, username = $2, email = $3, password = $4 where id = $5 returning *",
            [payload.fullname, payload.username, payload.email, payload.password, payload.id]
        );
        return {
            message: "success",
            data: data
        }
    };
    async deleteUser (payload: {id: number}) {
        const data = await this.pg.query("delete from users where id = $1", [payload.id]);
        return {
            message: "success",
            data: data
        }
    }    
};
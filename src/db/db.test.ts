import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Pool} from "pg";

@Injectable()
export class PostgresService {
    #_pool: Pool
    constructor() {
        this.#_pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
        })
    };
    async query(queryString: string, params: any[] = []): Promise<any> {
        try {
            const result = await this.#_pool.query(queryString,params);
            return result.rows;
        } catch (error) {
            throw new InternalServerErrorException("Error executing query!", error);
        }
    }
}
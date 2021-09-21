import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

/**
 * Single global pool to be used for all queries
 * Grabs connection info out of environment variables:
 * PGUSER       default=??
 * PGHOST       default=localhost
 * PGPASSWORD   default=??
 * PGDATABASE   default=postgres
 * PGPORT       default=5432
 */
const pool = new Pool();

async function init(): Promise<void> {
    // Validate connection
    try {
        await pool.query('SELECT NOW()');
    } catch (e) {
        console.log("Failed to connect to DB: ", e);
        throw e;
    }

    // Migrate the database schema
    // Referenc: https://www.npmjs.com/package/postgres-migrations
    const client = await pool.connect();
    try {
        await migrate({client}, "db-migrations");
    } finally {
        // release the client back to the pool when we're done
        await client.release();
    }
}

// Verify connection and run migrations on startup
init();

interface TestObject {
    id: number;
    name: string;
    score: number;
}

export async function testQueryAll(): Promise<TestObject[]> {
    const res = await pool.query("SELECT id, name, score FROM test_table");
    return res.rows as TestObject[];
}
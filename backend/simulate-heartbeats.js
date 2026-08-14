require('dotenv').config();
const mysql = require('mysql2/promise');
const crypto = require('crypto');

let apps = [];
let skippedApp = null;
let skipUntil = 0;

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function run() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root_password',
        database: process.env.DB_DATABASE || 'payments_gateway2',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log('Connected to the database via pool.');

    const [rows] = await pool.query('SELECT DISTINCT app_name FROM observability_events');
    apps = rows.map(r => r.app_name);
    console.log('Loaded apps:', apps);

    // Force an immediate crash right away on startup for one of the apps (e.g., first one)
    if (apps.length > 0) {
        skippedApp = apps[0];
        skipUntil = Date.now() + 45000;
        console.log(`[SIMULATOR] URGENT: Forcing immediate skip for ${skippedApp} until ${new Date(skipUntil).toISOString()}`);
    }

    setInterval(async () => {
        const now = Date.now();
        
        // Randomly start skipping an app if not already skipping
        // 15% chance every 5s -> frequent crashes as requested
        if (now > skipUntil && Math.random() < 0.15) {
            skippedApp = apps[Math.floor(Math.random() * apps.length)];
            // Skip for 45 seconds to ensure it crosses the 30s TTL + some buffer
            skipUntil = now + 45000;
            console.log(`[SIMULATOR] Deliberately skipping heartbeats for ${skippedApp} until ${new Date(skipUntil).toISOString()}`);
        } else if (now > skipUntil && skippedApp !== null) {
            console.log(`[SIMULATOR] Resuming heartbeats for ${skippedApp}`);
            skippedApp = null;
        }

        for (const app of apps) {
            if (app === skippedApp) {
                continue;
            }

            try {
                const executionId = crypto.randomUUID();
                // Ensure proper MySQL UTC datetime string: YYYY-MM-DD HH:MM:SS
                const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
                
                await pool.execute(
                    'INSERT INTO app_heartbeats (app_name, execution_id, timestamp, ttl_seconds) VALUES (?, ?, ?, ?)',
                    [app, executionId, timestamp, 30]
                );
                console.log(`[SIMULATOR] Inserted heartbeat for ${app} at ${timestamp}`);
            } catch (err) {
                console.error(`[SIMULATOR] Error inserting heartbeat for ${app}:`, err.message);
            }
        }
    }, 5000);
}

run().catch(console.error);

import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

export const TEMP_DB = '/tmp/database.sqlite';

export class DB {
    /** @type {?Database} */
    #db = null;
    /** @type {?Object} */
    options = null;

    /**
     * @param {Object} [options=null]
     */
    constructor(options = null) {
        this.options = options;
    }

    /**
     * @async
     * @returns void
     */
    async #connect() {
        if (this.#db) {
            return this;
        }

        const filename = this.options?.filename || TEMP_DB;

        this.#db = await open({
            filename,
            driver: sqlite3.Database
        });
    }

    /**
     * @async
     * @returns void
     */
    async #disconnect() {
        await this.#db.close();
        this.#db = null;
    }

    /**
     * @async
     * @param {{async()}} callback
     * @returns {null|Array<Object>|Object}
     */
    async #execute(callback) {
        await this.#connect();

        if (!this.#db) {
            return null;
        }

        const result = await callback();

        await this.#disconnect();

        return result;
    }

    /**
     * @async
     * @param {string} query
     * @param {Array<any, any>} bindings
     * @returns {null|Array<Object>}
     */
    async all(query, bindings) {
        await this.#connect();

        if (!this.#db) {
            return null;
        }

        const statement = await this.#db.prepare(query);
        const result = await statement.all(bindings);

        await this.#disconnect();

        return result;
    }

    /**
     * @async
     * @param {string} query
     * @param {string[]} bindings
     * @returns {null|Object}
     */
    async get(query, bindings) {
        await this.#connect();

        if (!this.#db) {
            return null;
        }

        const statement = await this.#db.prepare(query);
        const result = await statement.get(bindings);

        await this.#disconnect();

        return result;
    }

}

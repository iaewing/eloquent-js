import {snakeCase} from "change-case";
import pluralize from "pluralize"
import {Query} from "./builder/Query.js";

/**
 * @typedef {Object} ModelOptions
 * @property {?string} table - The table where records of the model exist.
 * @property {?string} primaryKey - The primary key of the model in the table
 */


export class Model {
    /** @type string  */
    table = null;
    /** @type string  */
    primaryKey;
    /** @type Query  */
    #queryBuilder = null;

    /**
     * @param {ModelOptions} [options={}]
     */
    constructor(options= {}) {
        this.table = options?.table || this._getTableName();
        this.primaryKey = options?.primaryKey || 'id';
        this.#queryBuilder = Query.table(this.table);
    }

    /**
     * @param {Record<string, any>} fields
     * @returns string
     */
    static create(fields) {
        return new this().create(fields);
    }

    /**
     * @returns string
     */
    static all() {
        return new this().get();
    }

    /**
     * @param {number} [limit=1]
     * @returns string
     */
    static first(limit = 1) {
        return new this().first(limit);
    }

    /**
     * @param {number} [limit=1]
     * @returns string
     */
    first(limit = 1) {
        return this.#queryBuilder
            .limit(limit)
            .toSql();
    }

    /**
     * @returns string
     */
    get() {
        return this.#queryBuilder
            .toSql();
    }

    /**
     * @param {Record<string, any>} fields
     * @returns string
     */
    create(fields) {
        return this.#queryBuilder
            .insert(fields);
    }

    /**
     * @param {...string} columns
     * @returns Model
     */
    select(...columns) {
        this.#queryBuilder
            .select(...columns);

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Model
     */
    where(column, operator, value) {
        this.#queryBuilder
            .where(column, operator, value);

        return this;
    }

    /**
     * @param {boolean} conditional
     * @param {function(Model)} callback
     * @returns {void}
     */
    when(conditional, callback) {
        if (conditional) {
            callback(this);
        }
    }

    /**
     * @param {...string} columns
     * @returns Model
     */
    groupBy(...columns) {
        this.#queryBuilder
            .groupBy(...columns);

        return this;
    }

    /**
     * @param {string} column
     * @param {string} operator
     * @param {string | number } value
     * @returns Model
     */
    having(column, operator, value) {
        this.#queryBuilder
            .having(column, operator, value);

        return this;
    }

    /**
     * @param {string} column
     * @param {"ASC" | "DESC"} [order=DESC]
     * @returns Model
     */
    orderBy(column, order = "DESC") {
        this.#queryBuilder
            .orderBy(column, order);

        return this;
    }

    /**
     * @returns string
     */
    _getModelName() {
        return this.constructor.name;
    }

    /**
     * @returns string
     */
    _getTableName() {
        return snakeCase(
            pluralize.plural(this._getModelName())
        );
    }
}
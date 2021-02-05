const database = require("../config/database")();

class old_Orm {
    // Atributos
    /**
     * Classe Responsável pela abstração do banco de dados.
     * @param {*} table (Required) Type: String, Recebe a tabela principal a ser trabalhada na query desejada.
     */
    constructor(table = null) {
        this.action = null; // select, insert, update or delete
        this.table = table;
        this.joinValues = [];
        this.selectFields = "*";
        this.whereFields = [];
        this.whereValues = [];
        this.typeWhere = "AND";
        this.whereSecondaryValues = [];
        this.whereSecondaryFields = "";
        this.groupByValue = "";
        this.orderByValue = "";
        this.limitValue = "";


        this.query = null;
    }

    // Métodos

    /**
     * Função que inicia uma busca no banco de dados através do comando SELECT
     * @param {*} select (Optional)  Type: String, Recebe os campos da tabela a ser buscados, caso não seja passado, será um select all (*)
     */
    select(select = "*") {
        if (this.action == null) {
            this.action = "SELECT"
            this.selectFields = select;
        }       

        return this;
    }

    /**
     * Função que realiza uma uniao de tabelas em uma busca através do comando JOIN
     * @param {*} table  (Required) Type: String, Recebe a tabela de união do join
     * @param {*} on (Required) Type: String, Recebe a clausula de ligação do join
     * @param {*} type (Optional) Type: Stryng, Recebe o tipo de join, caso não seja passado será assumido como INNER
     */
    join(table = "", on = "", type = "INNER"){
        if(table != "" && on != "") {
            this.joinValues.push(` ${type} JOIN ${table} ON ${on} `)
        }
        return this;
    }

    orderBy(field = "") {
        this.orderByValue = field;
    }

    groupBy(field = "") {
        this.groupByValue = field;
    }

    limit(limit = 0, offset = 0) {
        if(limit > 0) {
            if(offset == 0) {
                // limit normal
                this.limitValue = ` LIMIT ${limit} `;
            } else {
                this.limitValue = ` LIMIT ${limit}, ${offset} `;
            }
        }
    }

    /**
     * Função que seta o Where da query a ser executada no banco de dados
     * @param {*} fields (Required) Type: Array, recebe os campos para ser usado no Where
     * @param {*} values (Required) Type: Array, recebe os valores para ser usado no Where
     * @param {*} typeWhere (Optional) Type: Boolean, Caso não seja setado, assume-se que a clausula seja AND, caso passe valor, será OR
     */
    where(fields, values, typeWhere = "AND") {        
        // Faltando validar dados de entrada
        if (this.whereFields.length == 0 && this.whereValues.length == 0) {
            this.whereFields = fields;
            this.whereValues = values;
            this.typeWhere = typeWhere == "AND" ? "AND" : "OR";
        }

        return this;
    }

    /**
     * Função que seta o Where da query de forma livre e personalizada a ser executada no banco de dados
     * @param {*} fields (Required) Type: String, recebe o where, com os valores substituidos por ?
     * @param {*} values (Required) Type: Array, recebe os valores para ser usado no Where
     */
    whereSecondary(fields, values) {        
        // Faltando validar dados de entrada
        this.whereSecondaryFields = ` WHERE ${fields} `;
        this.whereSecondaryValues = values;

        return this;
    }

    // Métodos de criação da query
    queryBuild() {
        switch (this.action) {
            case "SELECT":
                return this.selectBuild();
            case "INSERT":
                return this.insertBuild();
            case "UPDATE":
                return this.updateBuild();
            case "DELETE":
                return this.deleteBuild();
            default:
                return null;
        }
    }
    selectBuild() {
        this.query = `SELECT ${this.selectFields} FROM ${this.table}`;

        this.joinBuild();

        // Verifica o tipo de where usado, caso seja o secundario (personalizado) insere o mesmo na query
        if(this.whereSecondaryFields == "")
            this.whereBuild();
        else
            this.query += this.whereSecondaryFields;

        // OUTRAS CLAUSULAS DEVEM SER ESCRITAS AQUI
        this.query += this.limitValue;

    }
    insertBuild() {

    }
    updateBuild() {

    }
    deleteBuild() {

    }

    // Builders extras
    whereBuild() {
        if (this.whereFields != []) {
            this.whereFields.map((whereField, i) => {
                if (i == 0) {
                    this.query += ` WHERE ${whereField} = ?`;
                } else {
                    this.query += ` ${this.typeWhere} ${whereField} = ?`;
                }
            })
        }
    }
    joinBuild() {
        if(this.joinValues.length > 0) {
            this.joinValues.map(joinValue => {
                this.query += joinValue
            })
        }
    }

    // Finalizador do orm
    /**
     * Método que finaliza uma busca no banco de dados e retorna o resultado em uma promisse. 
     * Ao usar esse método, é necessário encadear um methodo de finalização assincrona (.then) para poder trabalhar com os resultados retornados
     * @param {*} debug (Optional) Type: Boolean, Recebe 
     */
    get(debug = false) {
        let res = null;
        if (this.query != "") {
            this.queryBuild();

            if(debug)
                console.log(`DEBUG QUERY: ${this.query}`);
            return new Promise((resolve, reject) => {
                if(this.whereSecondaryValues.length > 0)
                    this.whereValues = this.whereSecondaryValues;
                
                if (this.whereValues.length > 0)
                    database.query(`${this.query}`, this.whereValues, (err, rows) => {
                        if (err) {
                            res = err;
                            reject({ error: err });
                        } else {
                            resolve({ result: rows });
                        }

                    })
                else
                    database.query(`${this.query}`, (err, rows) => {
                        if (err) {
                            res = err;
                            reject({ error: err });
                        } else {
                            resolve({ result: rows });
                        }

                    })
            })
        }
    }

    alternativeQuery(query, values = []) {
        return new Promise((resolve, reject) => {
            database.query(`${query}`, values, (err, rows) => {
                if (err) {
                    res = err;
                    reject({ error: err });
                } else {
                    resolve({ result: rows });
                }

            })
        })
    }
}

module.exports = old_Orm;
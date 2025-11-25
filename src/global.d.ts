// Type definitions for better-sqlite3
declare module 'better-sqlite3' {
  class Database {
    constructor(path: string, options?: Options);
    prepare(sql: string): Statement;
    exec(sql: string): this;
    close(): void;
  }

  interface Statement {
    run(...params: any[]): { lastInsertRowid: number | bigint; changes: number };
    get(...params: any[]): any;
    all(...params: any[]): any[];
  }

  interface Options {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (message?: any, ...additionalArgs: any[]) => void;
  }

  export = Database;
}

// Type definitions for @sveltejs/kit
declare module '@sveltejs/kit' {
  export function json(data: any, init?: ResponseInit): Response;
}

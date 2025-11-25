declare module 'svelte' {
  export function onMount(fn: () => void | (() => void)): void;
  export function onDestroy(fn: () => void): void;
  export function createEventDispatcher<T extends Record<string, any>>(): (event: string, detail?: T[keyof T]) => void;
  export function setContext<T>(key: string | symbol, context: T): T;
  export function getContext<T>(key: string | symbol): T;
  export function hasContext(key: string | symbol): boolean;
  export function tick(): Promise<void>;

  export interface SvelteComponent {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }

  export interface SvelteComponentDev {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }

  export interface SvelteComponentTyped {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }
}

declare module 'svelte/server' {
  export function onMount(fn: () => void | (() => void)): void;
  export function onDestroy(fn: () => void): void;
  export function createEventDispatcher<T extends Record<string, any>>(): (event: string, detail?: T[keyof T]) => void;
  export function setContext<T>(key: string | symbol, context: T): T;
  export function getContext<T>(key: string | symbol): T;
  export function hasContext(key: string | symbol): boolean;
  export function tick(): Promise<void>;

  export interface SvelteComponent {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }

  export interface SvelteComponentDev {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }

  export interface SvelteComponentTyped {
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }
}

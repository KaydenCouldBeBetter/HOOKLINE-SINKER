declare module 'svelte' {
  export interface SvelteComponent {
    $$prop_def: any;
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }
}

declare module 'svelte/server' {
  export interface SvelteComponent {
    $$prop_def: any;
    $$prop_def: any;
    $on: (event: string, handler: (event: any) => void) => () => void;
    $set: (props: any) => void;
  }
}

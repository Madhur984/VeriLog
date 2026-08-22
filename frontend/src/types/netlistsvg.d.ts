/**
 * netlistsvg ships no types (its own `built/*.d.ts` are not referenced by the
 * package manifest). Only `render` is used here; the rest of the surface is the
 * CLI, which never reaches the browser.
 */
declare module 'netlistsvg' {
  /**
   * @param skin  the skin SVG, as text
   * @param netlist a parsed Yosys `write_json` object
   * @param cb node-style callback receiving the serialized SVG
   */
  export function render(
    skin: string,
    netlist: unknown,
    cb: (err: Error | null, svg: string) => void,
  ): void;
}

/** Vite's `?raw` suffix imports a file's text; used for the schematic skin. */
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

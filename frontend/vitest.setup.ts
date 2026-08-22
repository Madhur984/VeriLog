/**
 * Test bootstrap — runs inside every vitest worker before any test module loads.
 *
 * The Yosys engine (@yowasp/yosys) that the judge synthesizes with is compiled
 * with the WebAssembly exception-handling proposal, and V8 still gates that
 * proposal's `exnref` value type behind a flag. Without it, the very first
 * synthesis dies at module load with:
 *
 *   CompileError: WebAssembly.compileStreaming(): invalid value type 'exn',
 *   enable with --experimental-wasm-exnref
 *
 * which surfaces as "reference failed to synthesize" / "Your design did not
 * compile" and reads like a broken netlist simulator. It is not: the same wasm
 * loads fine in the browser, which is where the judge actually executes. Only
 * Node needs convincing.
 *
 * The flag is set here, at runtime, rather than passed on a command line,
 * because tests run in pool workers rather than in the process that reads argv:
 * poolOptions.forks.execArgv does not reach them, and NODE_OPTIONS refuses V8
 * flags outright. setFlagsFromString runs inside each worker and applies before
 * anything compiles wasm, so it works whichever pool vitest picks.
 */
import v8 from 'node:v8';

v8.setFlagsFromString('--experimental-wasm-exnref');

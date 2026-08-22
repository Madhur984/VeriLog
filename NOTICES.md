# Third-party notices

Components redistributed to the browser as part of the BitForBytes frontend.

The governing constraint (see [`docs/verilog-judge-toolchain.md`](docs/verilog-judge-toolchain.md#alternatives-evaluated)):
serving a compiled artefact to a browser is **distribution**, so a strong-copyleft
dependency would extend its terms to this frontend. GPL-licensed tools are
therefore kept behind a process boundary on the server, or not used at all —
which is why the judge runs Yosys (ISC) rather than Icarus Verilog (GPLv2+).

Everything below is either permissive or weak (file-scope) copyleft, and none of
it obliges this application to be released under its terms.

---

## Yosys — `@yowasp/yosys`

- **Licence:** ISC (permissive)
- **Upstream:** https://github.com/YosysHQ/yosys
- **WASM packaging:** https://github.com/YoWASP/yosys
- **Use:** synthesizes Verilog to a JSON netlist in a Web Worker. The
  ~54 MB `.wasm` is served from `public/yowasp/` and is a redistributed binary.

ISC requires the copyright notice and permission notice be preserved; both ship
inside the package under `node_modules/@yowasp/yosys`.

---

## netlistsvg

- **Licence:** MIT (permissive)
- **Copyright:** © Neil Turley and contributors
- **Upstream:** https://github.com/nturley/netlistsvg
- **Use:** turns the Yosys netlist into an SVG schematic
  (`src/engine/verilog/schematic/yosysToSvg.ts`).

**Modified files.** `src/engine/verilog/schematic/judge.skin.svg` is a derivative
of netlistsvg's bundled `lib/default.svg`. It is redrawn for this app's themes
and extended to cover the word-level cells Yosys emits under `prep`. The file
carries a header recording its origin, as MIT's attribution clause requires.

---

## elkjs

- **Licence:** EPL-2.0 (Eclipse Public License 2.0), with elkjs 0.3.x published
  under **EPL-1.0**. Newer releases are dual-licensed `EPL-2.0 OR GPL-3.0-or-later`.
- **Upstream:** https://github.com/kieler/elkjs — a JavaScript build of the
  Eclipse Layout Kernel (https://www.eclipse.org/elk/)
- **Version:** pinned to `0.3.0`, the release netlistsvg depends on
  (`elkjs: ^0.3.0`). Pinned explicitly so a transitive bump cannot silently
  change the layout engine under the schematic.
- **Use:** graph layout for the schematic. Bundled via the `elkjs` →
  `lib/elk.bundled.js` alias in `vite.config.ts`.

**Why this is compatible.** The EPL is *weak, file-scope* copyleft: its
obligations attach to modifications of EPL-licensed files, not to a larger work
that merely links or bundles them. elkjs is shipped **unmodified**, so:

- this frontend is not required to be EPL-licensed;
- the notice above satisfies the attribution requirement;
- the corresponding source is the published `elkjs@0.3.0` package, available from
  npm and from the upstream repository.

Where a newer elkjs is dual-licensed `EPL-2.0 OR GPL-3.0-or-later`, **EPL-2.0 is
the licence elected here.** The GPL option is deliberately not exercised, for the
same reason Icarus was rejected.

> If elkjs is ever *modified* rather than merely bundled, the modified files must
> be published under the EPL. Keep local changes in our own files (the skin, the
> post-processor) rather than patching the vendored library.

---

## Monaco Editor

- **Licence:** MIT
- **Upstream:** https://github.com/microsoft/monaco-editor
- **Use:** the code editors in the Judge and Sandbox.

---

## Notes for future dependencies

Before adding anything that reaches the browser, check the licence against the
rule above:

| Licence family | Browser-shippable | Notes |
|---|---|---|
| MIT / ISC / BSD / Apache-2.0 | yes | attribute here |
| EPL, MPL, LGPL | yes, unmodified | weak copyleft — do not patch the vendored source |
| GPL / AGPL | **no** | server-side only, behind a process boundary |

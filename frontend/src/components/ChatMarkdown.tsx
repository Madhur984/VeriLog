/**
 * Renders VoltMonkey's replies.
 *
 * The panel used to print the raw string, so students saw literal `**bold**`,
 * `## headings` and `$V_{DS}$` instead of formatted text. This turns the small
 * subset a chat reply actually uses into elements, and hands real math to
 * KaTeX (already a dependency, via TextbookEquation).
 *
 * Scoped deliberately to a chat bubble: headings collapse to a bold line rather
 * than rendering as page headings, and there are no tables. Anything it doesn't
 * recognise falls through as plain text — never as raw HTML.
 *
 * It also has to survive STREAMING, where the tail of the text is routinely a
 * half-written `**bo` or an unclosed `$`. Unmatched markers simply don't match
 * and render as themselves, so partial output degrades instead of flickering.
 */
import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/** KaTeX output is generated markup, not model text — safe to inject. */
const mathHtml = (tex: string, display: boolean): string | null => {
    try {
        return katex.renderToString(tex, { displayMode: display, throwOnError: false });
    } catch {
        return null;
    }
};

/**
 * Inline pass: `code`, **bold**, *italic*, [text](url), $math$.
 * Ordered so code wins first — a backtick span must not have its contents
 * re-interpreted as bold or math.
 */
function renderInline(text: string, keyBase: string): React.ReactNode[] {
    const out: React.ReactNode[] = [];
    // A single regex keeps the alternatives mutually exclusive and ordered.
    const re =
        /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*|_[^_\n]+_)|(\[[^\]\n]+\]\([^)\s]+\))|(\$\$?[^$\n]+\$\$?)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let n = 0;

    while ((m = re.exec(text))) {
        if (m.index > last) out.push(text.slice(last, m.index));
        const tok = m[0];
        const key = `${keyBase}-i${n++}`;

        if (m[1]) {
            out.push(
                <code
                    key={key}
                    className="rounded bg-black/10 px-1 py-px font-mono text-[0.92em] dark:bg-white/15"
                >
                    {tok.slice(1, -1)}
                </code>,
            );
        } else if (m[2]) {
            out.push(<strong key={key} className="font-bold">{tok.slice(2, -2)}</strong>);
        } else if (m[3]) {
            out.push(<em key={key}>{tok.slice(1, -1)}</em>);
        } else if (m[4]) {
            const cut = tok.indexOf('](');
            const label = tok.slice(1, cut);
            const href = tok.slice(cut + 2, -1);
            // Only http(s) and in-app paths; never javascript: or data:.
            const safe = /^(https?:\/\/|\/)/i.test(href);
            out.push(
                safe ? (
                    <a
                        key={key}
                        href={href}
                        target={href.startsWith('/') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:opacity-70"
                    >
                        {label}
                    </a>
                ) : (
                    label
                ),
            );
        } else if (m[5]) {
            const display = tok.startsWith('$$');
            const tex = tok.replace(/^\$\$?|\$\$?$/g, '');
            const html = mathHtml(tex, display);
            out.push(
                html ? (
                    <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                    // KaTeX refused it — show the source, not a broken bubble.
                    <span key={key}>{tex}</span>
                ),
            );
        }
        last = m.index + tok.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
}

type Block =
    | { kind: 'p'; lines: string[] }
    | { kind: 'ul'; items: string[] }
    | { kind: 'ol'; items: string[] }
    | { kind: 'code'; lines: string[]; lang?: string }
    | { kind: 'quote'; lines: string[] }
    | { kind: 'h'; text: string };

/** Group lines into blocks. Deliberately small — this is a chat reply. */
function parseBlocks(src: string): Block[] {
    const lines = src.replace(/\r\n?/g, '\n').split('\n');
    const blocks: Block[] = [];
    let i = 0;

    const last = () => blocks[blocks.length - 1];

    while (i < lines.length) {
        const line = lines[i];

        // Fenced code. An unterminated fence (still streaming) runs to the end.
        const fence = line.match(/^\s*```(\w+)?\s*$/);
        if (fence) {
            const body: string[] = [];
            i++;
            while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) body.push(lines[i++]);
            i++; // closing fence, if present
            blocks.push({ kind: 'code', lines: body, lang: fence[1] });
            continue;
        }

        if (!line.trim()) { i++; continue; }

        const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
        if (heading) { blocks.push({ kind: 'h', text: heading[1] }); i++; continue; }

        // A "**Heading:**" line on its own is how models fake headings.
        const fakeHeading = line.match(/^\s*\*\*([^*]+)\*\*:?\s*$/);
        if (fakeHeading) { blocks.push({ kind: 'h', text: fakeHeading[1] }); i++; continue; }

        const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
        if (bullet) {
            const b = last();
            if (b && b.kind === 'ul') b.items.push(bullet[1]);
            else blocks.push({ kind: 'ul', items: [bullet[1]] });
            i++;
            continue;
        }

        const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
        if (numbered) {
            const b = last();
            if (b && b.kind === 'ol') b.items.push(numbered[1]);
            else blocks.push({ kind: 'ol', items: [numbered[1]] });
            i++;
            continue;
        }

        const quote = line.match(/^\s*>\s?(.*)$/);
        if (quote) {
            const b = last();
            if (b && b.kind === 'quote') b.lines.push(quote[1]);
            else blocks.push({ kind: 'quote', lines: [quote[1]] });
            i++;
            continue;
        }

        // Horizontal rules add nothing in a bubble this size.
        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { i++; continue; }

        const b = last();
        if (b && b.kind === 'p') b.lines.push(line);
        else blocks.push({ kind: 'p', lines: [line] });
        i++;
    }
    return blocks;
}

const ChatMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const blocks = useMemo(() => parseBlocks(text), [text]);

    return (
        // Display math and long code overflow a ~380px bubble, so let them
        // scroll inside themselves rather than widening the panel.
        <div className="space-y-2 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1">
            {blocks.map((b, i) => {
                const k = `b${i}`;
                switch (b.kind) {
                    case 'h':
                        return (
                            <p key={k} className="font-bold">
                                {renderInline(b.text, k)}
                            </p>
                        );
                    case 'ul':
                        return (
                            <ul key={k} className="list-outside list-disc space-y-1 pl-4">
                                {b.items.map((it, j) => (
                                    <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
                                ))}
                            </ul>
                        );
                    case 'ol':
                        return (
                            <ol key={k} className="list-outside list-decimal space-y-1 pl-4">
                                {b.items.map((it, j) => (
                                    <li key={j}>{renderInline(it, `${k}-${j}`)}</li>
                                ))}
                            </ol>
                        );
                    case 'code':
                        return (
                            <pre
                                key={k}
                                className="overflow-x-auto rounded-lg bg-black/10 p-2 font-mono text-[0.86em] leading-snug dark:bg-black/40"
                            >
                                <code>{b.lines.join('\n')}</code>
                            </pre>
                        );
                    case 'quote':
                        return (
                            <blockquote key={k} className="border-l-2 border-current/30 pl-2 opacity-90">
                                {renderInline(b.lines.join(' '), k)}
                            </blockquote>
                        );
                    default:
                        return <p key={k}>{renderInline(b.lines.join(' '), k)}</p>;
                }
            })}
        </div>
    );
};

export default ChatMarkdown;

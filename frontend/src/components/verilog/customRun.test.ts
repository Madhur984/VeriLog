/**
 * Value parsing for the custom-run bench.
 *
 * Students type decimal, C-style and Verilog literals interchangeably, so all
 * three have to work. The width masking matters as much as the parsing: a field
 * that silently accepts 300 into an 8-bit port would make the bench disagree
 * with the hardware, which is the one thing it must never do.
 */
import { describe, it, expect } from 'vitest';
import { parseValue } from './CustomRunPanel';

describe('parseValue', () => {
  it('reads plain decimal', () => {
    expect(parseValue('0', 8)).toBe(0n);
    expect(parseValue('42', 8)).toBe(42n);
    expect(parseValue('255', 8)).toBe(255n);
  });

  it('reads C-style hex and binary prefixes', () => {
    expect(parseValue('0xFF', 8)).toBe(255n);
    expect(parseValue('0xff', 8)).toBe(255n);
    expect(parseValue('0b1010', 4)).toBe(10n);
  });

  it('reads Verilog literals in every base', () => {
    expect(parseValue("8'hA5", 8)).toBe(0xa5n);
    expect(parseValue("4'b1011", 4)).toBe(11n);
    expect(parseValue("8'd200", 8)).toBe(200n);
    expect(parseValue("8'o17", 8)).toBe(15n);
  });

  it('accepts a sized literal with the size omitted', () => {
    expect(parseValue("'hFF", 8)).toBe(255n);
  });

  it('ignores underscores, which Verilog allows as digit separators', () => {
    expect(parseValue("8'b1010_1010", 8)).toBe(0xaan);
    expect(parseValue('1_000', 16)).toBe(1000n);
  });

  it('masks to the port width rather than accepting an over-wide value', () => {
    // 300 does not fit in 8 bits; the hardware would keep the low bits, so so do we.
    expect(parseValue('300', 8)).toBe(300n & 0xffn);
    expect(parseValue('0xFFFF', 8)).toBe(0xffn);
    expect(parseValue('3', 1)).toBe(1n);
  });

  it('treats an empty field as zero rather than as an error', () => {
    expect(parseValue('', 8)).toBe(0n);
    expect(parseValue('   ', 8)).toBe(0n);
  });

  it('rejects what it cannot represent, so the field can mark itself invalid', () => {
    expect(parseValue('hello', 8)).toBeNull();
    expect(parseValue('12abc', 8)).toBeNull();
    expect(parseValue('-5', 8)).toBeNull();
    // x and z have no meaning on a driven input — the bench drives real levels.
    expect(parseValue("8'hXX", 8)).toBeNull();
    expect(parseValue("4'bzzzz", 4)).toBeNull();
  });

  it('handles widths past 32 bits without losing precision', () => {
    expect(parseValue('0xDEADBEEFCAFEBABE', 64)).toBe(0xdeadbeefcafebaben);
  });
});

# Digital System Design — Number Systems, Boolean Algebra, Combinational Circuits

Reference for B.Tech digital electronics. All formulas verified.

## 1. Number Systems and Codes

### 1.1 Bases
- **Binary (base 2)**: digits {0,1}. Bit weight $2^i$.
- **Octal (base 8)**: groups of 3 binary bits.
- **Hex (base 16)**: digits 0–9, A–F. Groups of 4 binary bits.

### 1.2 Conversion shortcuts
- Decimal → binary: divide by 2, collect remainders bottom-up.
- Binary fraction → decimal: $0.b_1b_2b_3\ldots = b_1\cdot 2^{-1} + b_2\cdot 2^{-2} + \ldots$.
- Decimal fraction → binary: multiply by 2 repeatedly; integer part is the next bit.
- Binary → octal: pad to multiples of 3 bits, convert each group.
- Binary → hex: pad to multiples of 4 bits, convert each group.

### 1.3 Signed representations
| Form | Range (n bits) | Notes |
|------|----------------|-------|
| Sign-magnitude | $-(2^{n-1}-1)$ to $+(2^{n-1}-1)$ | two zeros |
| 1's complement | $-(2^{n-1}-1)$ to $+(2^{n-1}-1)$ | two zeros, end-around carry |
| **2's complement** | $-2^{n-1}$ to $+2^{n-1}-1$ | single zero, hardware-friendly |

To negate in 2's complement: invert all bits, then add 1.

Addition overflow rule (2's comp): overflow when the carries into and out of the sign bit differ, i.e. $C_{n-1} \oplus C_n = 1$.

### 1.4 Codes
- **BCD (8421)**: each decimal digit → 4 binary bits. Invalid combos 1010–1111.
- **Excess-3**: BCD + 3. Self-complementing (9's complement = bitwise NOT).
- **Gray code**: adjacent values differ by one bit. Binary→Gray: $G_i = B_i \oplus B_{i+1}$ with $B_n = 0$. Useful in K-maps, shaft encoders.
- **ASCII**: 7-bit character code (extended 8-bit).
- **Hamming code**: $2^p \ge m + p + 1$ for $m$ data bits and $p$ parity bits. Detects + corrects single-bit errors.

## 2. Boolean Algebra

### 2.1 Postulates and identity laws
$$A + 0 = A,\quad A \cdot 1 = A,\quad A + A' = 1,\quad A \cdot A' = 0$$
$$A + A = A,\quad A \cdot A = A,\quad A + 1 = 1,\quad A \cdot 0 = 0$$

### 2.2 Key theorems
- **Commutative**: $A+B = B+A,\; A\cdot B = B\cdot A$.
- **Associative**: $(A+B)+C = A+(B+C)$.
- **Distributive**: $A(B+C) = AB+AC,\; A+BC = (A+B)(A+C)$.
- **Absorption**: $A + AB = A,\; A(A+B) = A,\; A + A'B = A + B$.
- **DeMorgan's**: $(A+B)' = A'B',\; (AB)' = A'+B'$.
- **Consensus**: $AB + A'C + BC = AB + A'C$.

### 2.3 Standard forms
- **SOP (Sum-of-Products)**: $F = AB + A'C + BC'$.
- **POS (Product-of-Sums)**: $F = (A+B)(A'+C)(B+C')$.
- **Canonical SOP**: sum of **minterms** $\Sigma m(\ldots)$.
- **Canonical POS**: product of **maxterms** $\Pi M(\ldots)$.
- Minterm $m_i$ of $n$ vars = AND of all vars in a unique combination corresponding to row $i$.
- Maxterm $M_i$ = OR of all vars with the complement of row $i$.
- Relation: $F = \Sigma m_i$ iff $F' = \Sigma m_j$ for the remaining rows, equivalently $F = \Pi M_j$.

## 3. Logic Gates

### 3.1 Basic gates
| Gate | Symbol | Truth (2-in) |
|------|--------|--------------|
| AND  | $A \cdot B$ | 1 only if both inputs 1 |
| OR   | $A + B$    | 0 only if both inputs 0 |
| NOT  | $A'$       | inverts |
| NAND | $(AB)'$    | universal |
| NOR  | $(A+B)'$   | universal |
| XOR  | $A \oplus B$ | 1 if inputs differ |
| XNOR | $(A \oplus B)'$ | 1 if inputs equal |

### 3.2 Universality
Any function can be built from only NAND or only NOR.
- **NOT from NAND**: tie inputs: $\text{NAND}(A,A) = A'$.
- **AND from NAND**: $\text{NAND}(\text{NAND}(A,B), \text{NAND}(A,B)) = AB$.
- **OR from NAND**: $\text{NAND}(A',B') = A + B$ (DeMorgan).
- Symmetric constructions hold for NOR.

### 3.3 XOR identities
$$A \oplus 0 = A,\quad A \oplus 1 = A',\quad A \oplus A = 0,\quad A \oplus A' = 1$$
$$A \oplus B \oplus C = \text{odd parity},\quad (A \oplus B)' = AB + A'B'$$

## 4. Minimization

### 4.1 K-Maps (Karnaugh maps)
- Cells arranged so that **adjacent cells differ in exactly one variable** (Gray code on axes).
- Group sizes must be powers of 2: 1, 2, 4, 8, 16.
- Larger groups = fewer literals. Wrap edges and corners.
- **Prime implicant (PI)**: a group that cannot be expanded.
- **Essential PI (EPI)**: covers at least one minterm not covered by any other PI. Always selected.
- For POS minimization, group 0s and complement the result.

#### Steps
1. Plot minterms (1s) and don't-cares (X) in the map.
2. Identify all PIs.
3. Mark EPIs (they're required).
4. Pick non-essential PIs greedily to cover remaining minterms with fewest/largest groups.

### 4.2 Quine-McCluskey (Tabular)
- Algorithmic equivalent of K-map, scales beyond 5 variables.
- Step 1: list minterms grouped by number of 1s.
- Step 2: combine pairs that differ in one bit; mark used terms with ✓.
- Step 3: repeat until no further combinations.
- Step 4: unticked terms are PIs.
- Step 5: prime implicant chart → pick EPIs, then minimal cover.

### 4.3 Hazards
- **Static-1 hazard**: output should stay 1 but briefly glitches to 0.
- **Static-0 hazard**: opposite.
- **Dynamic hazard**: 3+ transitions when only 1 expected.
- Eliminate static hazards in SOP form by adding the **consensus term** that bridges adjacent groups in the K-map.

## 5. Arithmetic Circuits

### 5.1 Half adder
$$S = A \oplus B,\quad C_{out} = AB$$

### 5.2 Full adder
$$S = A \oplus B \oplus C_{in},\quad C_{out} = AB + C_{in}(A \oplus B)$$

### 5.3 Ripple-carry adder
- $n$ full adders cascaded; carry ripples through. Delay $= n \cdot t_{FA}$.
- Worst case grows linearly with $n$.

### 5.4 Carry look-ahead adder (CLA)
Define $G_i = A_iB_i$ (generate), $P_i = A_i \oplus B_i$ (propagate).
$$C_{i+1} = G_i + P_iC_i$$
Carries computed in parallel — delay $O(\log n)$ with hierarchical CLA.

### 5.5 Subtractor (2's complement)
$A - B = A + B' + 1$. Use full adder with XOR on B input and $C_{in} = 1$.

### 5.6 Comparator
$n$-bit magnitude comparator outputs $A>B$, $A=B$, $A<B$. Built from cascaded cells using XNOR (equality) and AND of higher-order equality + lower-order inequality.

## 6. Code Converters and MSI Blocks

### 6.1 Decoder
- $n$-to-$2^n$ decoder: one output high per input code.
- Active-low outputs common; enable input adds gating.
- Implements any SOP: $F(\Sigma m_i) = \text{OR of selected decoder outputs}$.

### 6.2 Encoder
- $2^n$-to-$n$. **Priority encoder** resolves ambiguity when multiple inputs active.

### 6.3 Multiplexer (MUX)
- $2^n$-to-1, $n$ select lines: $Y = \sum_i s_i \cdot D_i$ where $s_i$ is the minterm of select lines.
- A $2^n$-to-1 MUX implements any $n$-variable function by tying input lines to the truth-table column.
- A $2^{n-1}$-to-1 MUX implements any $n$-variable function with one extra inverter (Shannon expansion).

### 6.4 Demultiplexer
- 1-to-$2^n$: distributes a data input to one of $2^n$ outputs based on select.

### 6.5 Parity generator/checker
- Even parity: $P = A \oplus B \oplus C \oplus \ldots$.
- Odd parity: $P = (A \oplus B \oplus C \oplus \ldots)'$.

## 7. PLD-style implementation

| Device | AND plane | OR plane |
|--------|-----------|----------|
| ROM    | fixed (full decoder) | programmable |
| PAL    | programmable | fixed |
| PLA    | programmable | programmable |

Use PLA for sparse multi-output functions; PAL for fast fixed-OR designs; ROM for arbitrary lookup tables.

## 8. Common pitfalls students hit

1. **Confusing minterm and maxterm numbering** — minterm $m_3$ in 3 vars is row 011 ($A'BC$), maxterm $M_3$ is its complement OR $(A+B'+C')$.
2. **Forgetting don't-cares** in K-maps — they're free 1s for grouping purposes.
3. **Overflow in 2's comp** — overflow ≠ carry-out. A subtraction can have no overflow even with a borrow.
4. **Hazard glitches** in async logic — always check transitions between adjacent K-map cells in your final SOP.
5. **MUX as logic builder** — the select lines are the variables; data lines are the function values for each combination.

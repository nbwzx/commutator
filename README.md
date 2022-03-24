# Commutator
Decompose algorithms in commutator notation.

Let <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/J9W6pjRIDj.svg"> be any group. If <!-- $a,b \in G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/hzGAuZv640.svg">, then the commutator of <!-- $a$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/UhYiFhLcuQ.svg"> and <!-- $b$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/3eUfhUParw.svg"> is the element <!-- $[a,b]=aba^{−1}b^{−1}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/Ntecnjrojy.svg">. The expression <!-- $x\colon a$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/3LN26IAubW.svg"> denotes the conjugate of <!-- $a$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/2gxcQizkRw.svg"> by <!-- $x$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/9iB3HkjVB9.svg">, defined as <!-- $xax^{−1}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/GL6wwtSHya.svg">. Therefore, <!-- $c\colon[a,b]$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/aeNksYUPvc.svg"> means <!-- $c a b a^{−1} b^{−1} c^{−1}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/ECU0xU8Yfx.svg">.

In this repository, we assume that <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/Gc1pCvufb5.svg"> is a free group.

In mathematics, the free group <!-- $F_{S}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/EAUg5lHTBi.svg"> over a given set <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/Ibcd0FcTOp.svg"> consists of all words that can be built from members of <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/DWsWhbICkM.svg">, considering two words to be different unless their equality follows from the group axioms (e.g. <!-- $s t=s u u^{-1} t$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/fVzQWUoHVF.svg">, but <!-- $s \neq t^{-1}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/iwq8fMflYT.svg"> for <!-- $s, t, u \in S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/zZWgobxgom.svg"> ). The members of <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/egB8X9ylT4.svg"> are called generators of <!-- $F_{S}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/xVA1KxA0G9.svg">, and the number of generators is the rank of the free group. An arbitrary group <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/SEBZPzvZBn.svg"> is called free if it is isomorphic to <!-- $F_{S}$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/6ngjvQGpMe.svg"> for some subset <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/97GOyXaPGv.svg"> of <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/8dHefb78dL.svg">, that is, if there is a subset <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/QYGvJ9ZjmI.svg"> of <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/Oqhmg8BnIn.svg"> such that every element of <!-- $G$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/BqRlGijkvY.svg"> can be written in exactly one way as a product of finitely many elements of <!-- $S$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/SBgCUnUpcK.svg"> and their inverses (disregarding trivial variations such as <!-- $s t=s u u^{-1} t$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/C7FL0bS5Mk.svg"> ).

It is worth researching since many 3-cycle formulas in a Rubik's cube can be written as commutators.

Currently, the time complexity of this algorithm is <!-- $O(n^2)$ --> <img style="transform: translateY(0.1em); background: white;" src="assets/svg/UMMhXBMaRf.svg">. It is still unknown if there is a faster algorithm or if this algorithm can detect all possible commutators.

If you have a better algorithm, please let me know. Thank you.

Example 1:

```
Input: s = "R U R' U'"
Output: "[R,U]"
```

Example 2:

```
Input: s = "a b c a' b' c'"
Output: "[a b,c b]"
Explanation: a b + c b + b' a' + b' c' = a b c a' b' c'.
And "[a c',c b]" is also a valid answer.
```

Example 3:

```
Input: s = "D F' R U' R' D' R D U R' F R D' R'"
Output: "D:[F' R U' R',D' R D R']"
And "[D F' R U' R' D',R D R' D']" is also a valid answer.
```

Example 4:

```
Input: s = "R' F' R D' R D R2 F2 R2 D' R' D R' F' R"
Output: "R' F':[R D' R D R2,F2]"
```

Example 5:

```
Input: s = "R U R'"
Output: "Not found."
```

Constraints:
- s consist of only English letters.
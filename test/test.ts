"use strict";

import { assert } from "console";

const comm = require("../assets/dist/js/commutator.ts");

function assertFree(algorithm: string, expect: string, bool = true, order = 0) {
  const res: string[] = comm.search({
    algorithm: algorithm,
    order: order,
    initialReplace: {},
    finalReplace: {},
    commute: {},
  });
  for (const alg of res) {
    assert(
      comm.expand({
        algorithm: alg,
        order: order,
        initialReplace: {},
        finalReplace: {},
        commute: {},
      }) === algorithm,
      algorithm + "!= " + alg
    );
  }
  assert(
    bool === res.indexOf(expect) > -1,
    algorithm + " = " + expect + ", " + bool
  );
}

function assertCommute(
  algorithm: string,
  expect: string,
  bool = true,
  order = 0
) {
  const res: string[] = comm.search({
    algorithm: algorithm,
    order: order,
    initialReplace: {},
    finalReplace: {},
  });
  assert(
    bool === res.indexOf(expect) > -1,
    algorithm + " = " + expect + ", " + bool
  );
}

console.time("test");

assertFree("a b a' b'", "[a,b]");
assertFree("a b a' b'", "a b a':[b',a]");
assertFree("a b a' b'", "a b a' b':[a,b]", false);
assertFree("a b c b' c' a'", "a:[b,c]");
assertFree("a b c a' b' c'", "[a b,c a']");
assertFree("a b c b' a' d c' d'", "a b:[c,b' a' d]");
assertFree("a b c d c' b' a' e d' e'", "e:[e' a b c,d]");
assertFree("a b c d e b' a' c' e' d'", "[a b c,d e c]");
assertFree("a b c d e b' a' d' c' e'", "[a b e',e c d]");
assertFree("a b c b' a' d c' d'", "a b:[c,b' a' d]");
assertFree("a b c d a' c' b' d'", "[a b c,d a']");
assertFree("a b c d c' b' a' e d' e'", "e:[e' a b c,d]");
assertFree("a b c a b' a' c' a'", "[a b c,a c]");
assertFree("a b a2' b' a", "a:[b,a2']");
assertFree("a b a2' b' a", "a':[a2,b]", false);
assertFree("a b c b a' c' b2'", "[a b',b2 c]");
assertFree("a b c b a' b2' c'", "[a b,c b2]");
assertFree("a b c b2 a' b' c' b2'", "[a b',b2 c b]");
assertFree("a b c b3' a' b c' b", "[a b2,b' c b']");
assertFree("a b5 c b2 a' b4' c' b3'", "[a b2,b3 c b4]");
assertFree("a b c d c2' b' a' c d'", "[a b c,d c']");
assertFree("a b a' b' c d c' d'", "[a,b]+[c,d]");
assertFree("a2 b a' b' c a' c'", "a:[[a,b]+[c,a']]");
assertFree("a b c d c' a' b' d'", "[a,b]+[b a c,d]");
assertFree("a b c d a' b' c' d'", "[a,b]+[b a c,d c]");
assertFree("a b c d e a' b' c' d' e'", "[a b,c d e a']+[c d,e c']");
assertFree(
  "a b c d c' b' a' d' e f e' f'",
  "a b c:[[d,c' b' a']+c' b' a':[e,f]]"
);
assertFree(
  "a b c d a' b' d' e f g h f' i g' h' i' e' c'",
  "[a b,c d a']+c e f:[g h,f' i g']"
);
assertFree(
  "a b c d e a' b' e' f g h f' d' i g' h' i' c'",
  "[a b,c d e a']+c d f:[g h,f' d' i g']"
);
assertFree(
  "a b c d e f a' b' f' g h d' i g' e' h' i' c'",
  "[a b,c d e f a']+c d:[e g h,d' i h]"
);
assertFree(
  "a b c d e f g a' b' g' h d' i e' h' f' i' c'",
  "[a b,c d e f g a']+c d:[e f h,d' i e']"
);
assertFree(
  "a b c d e f d' g h a' b' h' i e' f' i' g' c'",
  "[a b,c d e f d' g h a']+c d:[e f,d' g i e']"
);
assertFree(
  "a b c d e f g d' h f' i a' b' i' e' g' h' c'",
  "a b c d e f:[[g d' h,f' i a' b' i' e' g']+f' i:[a' b',i' e' d' c' a]]"
);
assertFree(
  "a b c d e f g d' h e' g' i a' b' i' f' h' c'",
  "a b c d:[[e f g,d' h e']+d' h f i:[a' b',i' f' h' c' a]]"
);
assertFree(
  "a b c d e f a' c' g h e' i g' b' f' h' i' d'",
  "[a b c,d e f a']+d e:[f b g h,e' i h]"
);
assertFree(
  "a b c d e f g a' c' h e' i f' h' b' g' i' d'",
  "[a b c,d e f g a']+d e:[f g b h,e' i f']"
);
assertFree(
  "a b c d e f b' g h e' i g' a' c' f' h' i' d'",
  "a b:[[c d e f,b' g h e' i g' a' c']+b' g:[h e' i,g' a' d i]]"
);
assertFree(
  "a b c d e f g b' h e' i f' h' a' c' g' i' d'",
  "a b c d e:[[f g b' h,e' i f']+e' i g:[b' a' c',g' i' d' c']]"
);
assertFree(
  "a b c d e f g a' d' h f' i b' g' h' c' i' e'",
  "[a b c d,e f g a']+e f:[g b c h,f' i b' g']"
);

assertCommute("a R L a' R' L'", "[a,R L]");
assertCommute("a R L M a' R' L' M'", "[a,R L M]");
assertCommute("R L a M a' R' L' M'", "R L:[a,M]");
assertCommute("L a R b L' a' R' b'", "[L a R,b R L']");
assertCommute("L a R b L' a' R' b'", "L a R b L' a':[R' b' L,a R L]");
assertCommute("L a R L b R L2' a' R2' b'", "[L a R L,b R2 L']");
assertCommute("a R b L a' R' b' L'", "[a R L',L b R]");
assertCommute("a R b L a' R' b' L'", "a R b L a':[R' b' L',a R L']");
assertCommute("a R b L a' R' b' L'", "a R b L a' R' b':[L' a R,b R L]");
assertCommute("a R2 b R' L2 a' R' L' b' L'", "[a R2 L',L b R L]");
assertCommute("a R2 L2 M2 b R' a' R' L M2' b' L3'", "[a R2 L' M2,L3 b R' a']");

console.timeEnd("test");

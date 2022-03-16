import { Monad1 } from "fp-ts/Monad";
import { Filterable1 } from "fp-ts/Filterable";
import { identity, pipe } from "fp-ts/function";
import { not, Predicate } from "fp-ts/Predicate";
import { isSome, none, some } from "fp-ts/Option";
import { isLeft } from "fp-ts/Either";
import { Alternative1 } from "fp-ts/Alternative";
import { Foldable1 } from "fp-ts/Foldable";
import * as O from "fp-ts/Option";

export const URI = "Generator";
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
    interface URItoKind<A> {
        [URI]: Generator<A>;
    }
}

export const map = <A, B>(f: (a: A) => B) => {
    return function* (fa: Generator<A>): Generator<B> {
        for (const a of fa) {
            yield f(a);
        }
    };
};

export function* of<A>(a: A) {
    yield a;
}

export const reduce =
    <A, B>(b: B, f: (b: B, a: A) => B) => {
        return function* (fa: Generator<A>) {
            for (const a of fa) {
                b = f(b, a);
                yield b;
            }
        };
    };

export const take = (n: number) => {
    return function* <A>(fa: Generator<A>) {
        for (let i = 0, v = fa.next(); i < n && !v.done; i++, v = fa.next()) {
            yield v.value;
        }
    };
};

export const findIndex =
    (n: number) =>
        <A>(fa: Generator<A>): O.Option<A> => pipe(
            fa,
            take(n),
            last
        );

export const last = <A>(fa: Generator<A>): O.Option<A> => {
    let res: O.Option<A> = O.none;
    for (const a of fa) {
        res = O.some(a);
    }
    return res;
};

export const getArray = <A>(fa: Generator<A>) =>
    pipe(
        fa,
        reduce(new Array<A>(), (b, a: A) => [...b, a]),
        last
    );


// export const generator: Monad1<"Generator"> & Filterable1<"Generator"> & Alternative1<"Generator"> & Foldable1<"Generator"> = {
//     URI: "Generator",
//     * ap(fab, fa) {
//         for (const ab of fab) {
//             for (const a of fa) {
//                 yield ab(a);
//             }
//         }
//     },
//     * chain(fa, f) {
//         for (const a of fa) {
//             for (const b of f(a)) {
//                 yield b;
//             }
//         }
//     },
//     * filter<A>(fa: Generator<A>, p: Predicate<A>) {
//         for (const a of fa) {
//             if (p(a)) {
//                 yield a;
//             }
//         }
//     },
//     * filterMap(fa, f) {
//         for (const a of fa) {
//             const ob = f(a);
//             if (isSome(ob)) {
//                 yield ob.value;
//             }
//         }
//     },
//     compact: fa => generator.filterMap(fa, identity),
//     partition<A>(fa: Generator<A>, f: Predicate<A>) {
//         return {
//             left: generator.filter(fa, not(f)),
//             right: generator.filter(fa, f)
//         };
//     },
//     partitionMap(fa, f) {
//         return {
//             left: generator.filterMap(fa, a => {
//                 const ebc = f(a);
//                 return isLeft(ebc) ? some(ebc.left) : none;
//             }),
//             right: generator.filterMap(fa, a => {
//                 const ebc = f(a);
//                 return isLeft(ebc) ? none : some(ebc.right);
//             })
//         };
//     },
//     separate: fa => generator.partitionMap(fa, identity),
//     * zero() {
//     },
//     * alt(fx, fy) {
//         for (const x of fx) {
//             yield x;
//         }
//         for (const y of fy()) {
//             yield y;
//         }
//     }
// };

const r = pipe(
    (function* () {
        let i = 0;
        while (true) {
            i++;
            yield i;
        }
    })(),
    map(n => n ** 2),
    reduce(0, (b, a) => b + a),
    take(10),
    last
);

console.log(r);
//
// for (let i of r) {
//     console.log(i);
// }
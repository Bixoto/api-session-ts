import {describe, expect, it, test} from 'vitest';
import {coerceDates} from './utils';

test('coerceDates', () => {
    describe('without options', () => {
        it('coerces valid date on field created_at', () => {
            const date = new Date(),
                thing: { created_at: string | Date } = {created_at: date.toISOString(),};

            coerceDates(thing);
            expect(thing.created_at instanceof Date).toBe(true);
            // direct date comparison doesn't work
            expect((thing.created_at as Date).toISOString()).toBe(date.toISOString());
        });

        it('coerce invalid date on field created_at', () => {
            expect(+coerceDates({created_at: 'foo'}).created_at).toBeNaN()
        })
    })
    describe('with options', () => {
        it('doesn\'t coerce invalid date on field created_at if keep_invalid is false', () => {
            expect(+coerceDates({created_at: 'foo'}, {keep_invalid: true}).created_at).toBe('foo')
        })
    })
});
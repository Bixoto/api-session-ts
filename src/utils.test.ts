import {expect, test} from 'vitest';
import {coerceDates} from './utils';

test('coerceDates', () => {
    const date = new Date(),
        thing: { created_at: string | Date } = {created_at: date.toISOString(),};

    coerceDates(thing);
    expect(thing.created_at instanceof Date).toBe(true);
    // direct date comparison doesn't work
    expect((thing.created_at as Date).toISOString()).toBe(date.toISOString());
});

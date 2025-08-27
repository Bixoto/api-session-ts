export type AnyPayload = Array<unknown> | Record<string, unknown> | null

function stringValue(value: unknown) {
    if (value === undefined) {
        return '';
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    return '' + value;
}

/** Stringify params values */
export function makeURLSearchParams(params: Record<string, unknown> | string[][] | undefined): URLSearchParams {
    if (params === undefined) {
        return new URLSearchParams();
    }
    if (Array.isArray(params)) {
        return new URLSearchParams(params.map(([key, value]) => [key, stringValue(value)]));
    }

    const string_params: string[][] = [];

    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value === null || value === undefined) {
            return;
        }
        if (Array.isArray(value)) {
            value.forEach(value_ => {
                string_params.push([key, stringValue(value_)]);
            });
        } else {
            string_params.push([key, stringValue(value)]);
        }
    });

    return new URLSearchParams(string_params);
}

export function isDateField(k: string, v: unknown): boolean {
    return typeof v === 'string' && (k.endsWith('_at') || k.endsWith('_date'));
}


/**
 * Convert to Date objects all values that look like valid date strings.
 **/
export function coerceDates(payload: AnyPayload | any, options?: {
    is_date_field?: (k: string, v: unknown) => boolean,
    keep_invalid?: boolean,
}): typeof payload {
    if (!payload) {
        return payload;
    }

    const is_date_field = options?.is_date_field || isDateField,
        keep_invalid = options?.keep_invalid ?? true;

    if (Array.isArray(payload)) {
        return (payload as AnyPayload[]).map(value => coerceDates(value, options));
    }

    for (const field in payload) {
        const value = payload[field];

        if (Array.isArray(value)) {
            payload[field] = value.map(value => coerceDates(value, options));
        } else if (is_date_field(field, value)) {
            const date_value = new Date(value);
            if (keep_invalid || !isNaN(+date_value)) {
                payload[field] = date_value;
            }
        }
    }

    return payload;
}
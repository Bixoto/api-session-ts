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


/**
 * Convert to Date objects all values that look like valid date strings.
 **/
export function coerceDates(payload: AnyPayload | any, options?: {
    date_regexp?: RegExp,
    keep_invalid?: boolean,
}): typeof payload {
    if (!payload) {
        return payload;
    }

    const date_regexp = options?.date_regexp || /^(?:19[789]\d|20[0-4]\d)-\d{2}-\d{2}/,
        keep_invalid = options?.keep_invalid ?? false;

    if (Array.isArray(payload)) {
        return (payload as AnyPayload[]).map(value => coerceDates(value, options));
    }

    for (const field in payload) {
        const value = payload[field];

        if (Array.isArray(value)) {
            payload[field] = value.map(value => coerceDates(value, options));
        } else if (typeof value === 'string' && date_regexp.test(value)) {
            const date_value = new Date(value as string);
            if (keep_invalid || !isNaN(+date_value)) {
                payload[field] = date_value;
            }
        }
    }

    return payload;
}
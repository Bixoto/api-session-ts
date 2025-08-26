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
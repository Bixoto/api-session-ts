export class HTTPError extends Error {
    response: Response;
    url: string;
    request_params?: RequestInit;

    constructor(response: Response, url: string, request_params?: RequestInit) {
        super(`${response.status} ${response.statusText} for ${url}`);
        Object.setPrototypeOf(this, HTTPError.prototype);

        this.response = response;
        this.url = url;
        this.request_params = request_params;
    }
}

export type Init = RequestInit & {
    headers?: Record<string, string>
}

export class APISession {
    readonly base_url: string;
    readonly headers: Record<string, string>;
    readonly readonly: boolean;

    static readonly READ_METHODS: Set<string> = new Set(['CONNECT', 'GET', 'HEAD', 'OPTIONS', 'TRACE'])

    /**
     * @param base_url
     * @param options
     */
    constructor(base_url: string, options?: {
        headers?: Record<string, string>,
        user_agent?: string,
        readonly?: boolean,
    }) {
        if (!options) {
            options = {}
        }

        this.base_url = base_url;
        this.headers = options.headers || {};
        this.readonly = options.readonly || false;

        if (options.user_agent) {
            this.headers["User-Agent"] = options.user_agent;
        }
    }

    /**
     * Return a full URL by concatenating the client's base URL with the provided endpoint.
     * If the endpoint is already a URL, return it as-is.

     * @param endpoint
     * @protected
     */
    protected fullUrl(endpoint: string): string {
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint
        }

        return `${this.base_url}${endpoint}`;
    }


    /**
     * Like fetch() but with the client's default headers and base URL.
     * Raise a HTTPError if the response is not successful.
     */
    async fetch(endpoint: string, init?: Init): Promise<Response> {
        const method = (init?.method || 'GET').toUpperCase();

        if (this.readonly && APISession.READ_METHODS.has(method)) {
            throw new Error(`Can't perform ${method} request in read-only mode.`)
        }

        const url = this.fullUrl(endpoint);
        console.debug(`HTTP ${method} ${url}` + (init?.body ? ` with ${init?.body}` : ''));
        const response = await fetch(
            url,
            {
                ...init,
                headers: {
                    Accept: 'application/json',
                    ...this.headers,
                    ...init?.headers
                }
            }
        );
        if (!response.ok) {
            throw new HTTPError(response, url, init);
        }

        return response;
    }

    async fetchJSON<T=any>(endpoint: string, init?: Init): Promise<T> {
        const req = await this.fetch(endpoint, init);
        return await req.json() as T;
    }

    getJSON<T=any>(endpoint: string): Promise<T> {
        return this.fetchJSON<T>(endpoint);
    }

    putJSON<T=any>(endpoint: string, body: unknown): Promise<T> {
        return this.fetchJSON<T>(endpoint, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
    }

    async postJSON<T=any>(endpoint: string, body: unknown): Promise<T> {
        return this.fetchJSON<T>(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
    }

    /**
     * Perform a `GET` request.
     */
    get(endpoint: string): Promise<Response> {
        return this.fetch(endpoint, {method: 'GET'})
    }

    /**
     * Perform a `HEAD` request.
     */
    head(endpoint: string): Promise<Response> {
        return this.fetch(endpoint, {method: 'HEAD'});
    }

    /**
     * Perform a `DELETE` request.
     */
    delete(endpoint: string): Promise<Response> {
        return this.fetch(endpoint, {method: 'DELETE'});
    }

    /**
     * Perform a `OPTIONS` request.
     */
    options(endpoint: string): Promise<Response> {
        return this.fetch(endpoint, {method: 'OPTIONS'});
    }
}

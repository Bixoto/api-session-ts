export class APISession {
	readonly base_url: string;

	constructor(base_url: string) {
		this.base_url = base_url;
	}

	protected fullUrl(endpoint: string) {
		return `${this.base_url}${endpoint}`;
	}
}

export type DnsValueType = string | {
	priority: number;
	server: string;
};

export type DnsSection = Record<string, unknown> | {
	name: string;
	type: string;
	ttl: number;
	class: string;
	value: DnsValueType;
};

export type DnsParseLoopResponse = {
	[key: string]: any;
	question?: any[];
	header?: any[];
	answers: DnsSection[];
	timings: {total: number};
	resolver: string;
};

export const isDnsSection = (output: any): output is DnsSection => typeof (output as DnsSection) !== 'undefined';

/* eslint-disable @typescript-eslint/naming-convention */
export const SECTION_REG_EXP = /(;; )(\S+)( SECTION:)/g;
export const NEW_LINE_REG_EXP = /\r?\n/;
/* eslint-enable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SharedDigParser = {
	parseSection(values: string[]): DnsSection {
		return {
			name: values[0],
			type: values[3],
			ttl: Number(values[1] ?? ''),
			class: values[2],
			value: SharedDigParser.parseValue(values),
		};
	},

	parseValue(values: string[]): DnsValueType {
		const type = String(values[3]).toUpperCase();

		if (type === 'SOA') {
			return String(values.slice(4)).replace(/,/g, ' ');
		}

		if (type === 'MX') {
			return {priority: Number(values[4]), server: String(values[5])};
		}

		if (type === 'TXT') {
			return String(values.slice(4).join(' '));
		}

		return String(values[values.length - 1]);
	},
};

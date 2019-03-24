import * as SystemUtils from '../src/utils/system.utils';

describe('Index Tests', () => {
	it('should have init method', async done => {
		expect(SystemUtils.sleep).toBeDefined();
		const time: number = new Date().getTime();
		await SystemUtils.sleep(1000);
		const diff = new Date().getTime() - time;
		expect(diff).toBeGreaterThanOrEqual(1000);
		expect(diff).toBeLessThanOrEqual(1250);
		done();
	});
});

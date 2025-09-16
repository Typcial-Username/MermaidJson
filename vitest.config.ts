import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            {
                test: {
                    name: 'node',
                    environment: 'happy-dom',
                }
            },
            {
                test: {
                    browser: {
                        headless: true,
                        instances: [{ browser: 'chromium' }],
                    }
                },
                environments: {'browser': {}},
            }
        ]
    },
})
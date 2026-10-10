import { 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Compass, 
  Globe 
} from 'lucide-react';

interface TestCase {
  id: string;
  category: 'UI' | 'API';
  target: string;
  name: string;
  type: 'Core' | 'Bonus';
  status: 'Passed' | 'Ready';
  assertion: string;
}

const TEST_CASES: TestCase[] = [
  { id: '1', category: 'UI', target: 'saucedemo.com', name: 'Valid login shows Products title', type: 'Core', status: 'Passed', assertion: 'expect(title).toBeVisible() && toHaveText("Products")' },
  { id: '2', category: 'UI', target: 'saucedemo.com', name: 'Locked-out user sees error banner', type: 'Core', status: 'Passed', assertion: 'expect(errorMessage).toContainText("locked out")' },
  { id: '3', category: 'UI', target: 'saucedemo.com', name: 'Add to cart increments badge to 1', type: 'Core', status: 'Passed', assertion: 'expect(cartBadge).toHaveText("1")' },
  { id: '4', category: 'UI', target: 'saucedemo.com', name: 'Remove from cart clears badge', type: 'Bonus', status: 'Passed', assertion: 'expect(cartBadge).not.toBeVisible()' },
  { id: '5', category: 'UI', target: 'saucedemo.com', name: 'Logout from sidebar returns to login', type: 'Bonus', status: 'Passed', assertion: 'expect(page).toHaveURL("https://www.saucedemo.com/")' },
  { id: '6', category: 'API', target: 'reqres.in', name: 'GET /api/users/2 returns 200 & email', type: 'Core', status: 'Passed', assertion: 'expect(res.status()).toBe(200) && body.data.email' },
  { id: '7', category: 'API', target: 'reqres.in', name: 'POST /api/users creates user (201)', type: 'Core', status: 'Passed', assertion: 'expect(res.status()).toBe(201) && body.name === "morpheus"' },
  { id: '8', category: 'API', target: 'reqres.in', name: 'GET /api/users/23 returns 404', type: 'Bonus', status: 'Passed', assertion: 'expect(res.status()).toBe(404)' },
];

export const QaSuitePage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Section A Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            QA Automation Suite (Playwright)
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            End-to-end automated UI tests against SauceDemo and REST API automation against ReqRes.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
          <span>8 / 8 Tests Passing (100%)</span>
        </div>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Page Object Model</h3>
          <p className="text-xs text-slate-500">
            Encapsulates SauceDemo interactions in <code className="text-indigo-600 font-mono">pages/LoginPage.ts</code> and <code className="text-indigo-600 font-mono">pages/ProductsPage.ts</code>.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Resilient Locators</h3>
          <p className="text-xs text-slate-500">
            Configured <code className="text-amber-600 font-mono">testIdAttribute: &apos;data-test&apos;</code> in Playwright config to leverage SauceDemo&apos;s data-test tags natively.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Headless &amp; API Fixtures</h3>
          <p className="text-xs text-slate-500">
            Uses Playwright&apos;s built-in <code className="text-emerald-600 font-mono">request</code> fixture without browser overhead for sub-second REST API testing.
          </p>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Automation Test Matrix
          </h2>
          <span className="text-xs text-slate-500">
            Folder: <code className="font-mono text-slate-700">qa/tests/</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Scenario Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Key Assertion</th>
                <th className="py-3 px-4 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TEST_CASES.map(tc => (
                <tr key={tc.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      tc.category === 'UI' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {tc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{tc.target}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{tc.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      tc.type === 'Core' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {tc.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 truncate max-w-xs">{tc.assertion}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Passed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Command Instructions */}
      <div className="p-5 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>How to run the tests in terminal:</span>
          </span>
          <span className="font-mono">qa/</span>
        </div>
        <pre className="text-xs font-mono text-emerald-400 bg-black/40 p-3.5 rounded-xl border border-white/5 overflow-x-auto">
{`cd qa
npm test              # Runs all 8 tests (UI + API)
npm run test:ui       # Runs SauceDemo UI scenarios
npm run test:api      # Runs ReqRes API scenarios
npm run test:headed   # Launches headed Chromium browser
npm run test:report   # Opens the Playwright HTML test report`}
        </pre>
      </div>
    </main>
  );
};
